import { Redis } from "@upstash/redis";

type FailureResult = {
    isLocked: boolean;
    retryAfterSeconds: number;
    failureCount: number;
};

type LockCheckResult = {
    isLocked: boolean;
    retryAfterSeconds: number;
};

const memoryStore = new Map<string, { count: number; windowEndsAt: number; lockEndsAt: number }>();
let cachedRedis: Redis | null | undefined;

function getRedisClient(): Redis | null {
    if (cachedRedis !== undefined) {
        return cachedRedis;
    }

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        cachedRedis = null;
        return cachedRedis;
    }

    cachedRedis = new Redis({ url, token });
    return cachedRedis;
}

function nowSeconds(): number {
    return Math.floor(Date.now() / 1000);
}

function getKeys(identifier: string): { failureKey: string; lockKey: string } {
    return {
        failureKey: `admin:auth:fail:${identifier}`,
        lockKey: `admin:auth:lock:${identifier}`,
    };
}

function getMemoryState(identifier: string): { count: number; windowEndsAt: number; lockEndsAt: number } {
    const existing = memoryStore.get(identifier);
    if (existing) return existing;

    const fresh = { count: 0, windowEndsAt: 0, lockEndsAt: 0 };
    memoryStore.set(identifier, fresh);
    return fresh;
}

function checkLockInMemory(identifier: string): LockCheckResult {
    const now = nowSeconds();
    const state = getMemoryState(identifier);

    if (state.lockEndsAt <= now) {
        state.lockEndsAt = 0;
        return { isLocked: false, retryAfterSeconds: 0 };
    }

    return {
        isLocked: true,
        retryAfterSeconds: Math.max(1, state.lockEndsAt - now),
    };
}

function registerFailureInMemory(
    identifier: string,
    windowSeconds: number,
    maxFailures: number,
    lockSeconds: number
): FailureResult {
    const now = nowSeconds();
    const state = getMemoryState(identifier);

    if (state.lockEndsAt > now) {
        return {
            isLocked: true,
            retryAfterSeconds: Math.max(1, state.lockEndsAt - now),
            failureCount: state.count,
        };
    }

    if (state.windowEndsAt <= now) {
        state.count = 0;
        state.windowEndsAt = now + windowSeconds;
    }

    state.count += 1;

    if (state.count >= maxFailures) {
        state.lockEndsAt = now + lockSeconds;
        state.count = 0;
        state.windowEndsAt = 0;
        return {
            isLocked: true,
            retryAfterSeconds: lockSeconds,
            failureCount: maxFailures,
        };
    }

    return {
        isLocked: false,
        retryAfterSeconds: 0,
        failureCount: state.count,
    };
}

async function checkLockInRedis(identifier: string): Promise<LockCheckResult> {
    const redis = getRedisClient();
    if (!redis) return checkLockInMemory(identifier);

    const { lockKey } = getKeys(identifier);
    const ttl = await redis.ttl(lockKey);

    if (typeof ttl === "number" && ttl > 0) {
        return { isLocked: true, retryAfterSeconds: ttl };
    }

    return { isLocked: false, retryAfterSeconds: 0 };
}

async function registerFailureInRedis(
    identifier: string,
    windowSeconds: number,
    maxFailures: number,
    lockSeconds: number
): Promise<FailureResult> {
    const redis = getRedisClient();
    if (!redis) {
        return registerFailureInMemory(identifier, windowSeconds, maxFailures, lockSeconds);
    }

    const { failureKey, lockKey } = getKeys(identifier);

    const currentLockTtl = await redis.ttl(lockKey);
    if (typeof currentLockTtl === "number" && currentLockTtl > 0) {
        return {
            isLocked: true,
            retryAfterSeconds: currentLockTtl,
            failureCount: 0,
        };
    }

    const failureCount = await redis.incr(failureKey);
    if (failureCount === 1) {
        await redis.expire(failureKey, windowSeconds);
    }

    if (failureCount >= maxFailures) {
        await redis.set(lockKey, "1", { ex: lockSeconds });
        await redis.del(failureKey);

        return {
            isLocked: true,
            retryAfterSeconds: lockSeconds,
            failureCount,
        };
    }

    return {
        isLocked: false,
        retryAfterSeconds: 0,
        failureCount,
    };
}

async function clearInRedis(identifier: string): Promise<void> {
    const redis = getRedisClient();
    if (!redis) {
        memoryStore.delete(identifier);
        return;
    }

    const { failureKey, lockKey } = getKeys(identifier);
    await redis.del(failureKey, lockKey);
}

export function extractClientIdentifier(request: Request): string {
    const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const realIp = request.headers.get("x-real-ip")?.trim();
    const fallback = "unknown";
    const raw = forwardedFor || realIp || fallback;

    return raw.replace(/[^a-zA-Z0-9:._-]/g, "_");
}

export async function getAdminLockStatus(identifier: string): Promise<LockCheckResult> {
    try {
        return await checkLockInRedis(identifier);
    } catch {
        return checkLockInMemory(identifier);
    }
}

export async function recordAdminFailure(
    identifier: string,
    windowSeconds: number,
    maxFailures: number,
    lockSeconds: number
): Promise<FailureResult> {
    try {
        return await registerFailureInRedis(identifier, windowSeconds, maxFailures, lockSeconds);
    } catch {
        return registerFailureInMemory(identifier, windowSeconds, maxFailures, lockSeconds);
    }
}

export async function clearAdminRateLimit(identifier: string): Promise<void> {
    try {
        await clearInRedis(identifier);
    } catch {
        memoryStore.delete(identifier);
    }
}
