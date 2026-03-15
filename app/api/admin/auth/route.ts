import { NextResponse } from "next/server";
import { makeToken, SESSION_COOKIE } from "@/lib/auth";
import {
    clearAdminRateLimit,
    extractClientIdentifier,
    getAdminLockStatus,
    recordAdminFailure,
} from "@/lib/admin-rate-limit";

function readPositiveInt(value: string | undefined, fallback: number): number {
    const parsed = Number.parseInt(value ?? "", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const MAX_FAILED_ATTEMPTS = readPositiveInt(process.env.ADMIN_LOGIN_MAX_ATTEMPTS, 5);
const FAILURE_WINDOW_SECONDS = readPositiveInt(process.env.ADMIN_LOGIN_WINDOW_SECONDS, 300);
const LOCKOUT_SECONDS = readPositiveInt(process.env.ADMIN_LOGIN_LOCKOUT_SECONDS, 900);

export async function POST(request: Request) {
    const identifier = extractClientIdentifier(request);

    const lockStatus = await getAdminLockStatus(identifier);
    if (lockStatus.isLocked) {
        return NextResponse.json(
            {
                error: `Too many failed attempts. Try again in ${lockStatus.retryAfterSeconds}s.`,
                retryAfter: lockStatus.retryAfterSeconds,
            },
            {
                status: 429,
                headers: { "Retry-After": String(lockStatus.retryAfterSeconds) },
            }
        );
    }

    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
        return NextResponse.json(
            { error: "Admin password not configured." },
            { status: 500 }
        );
    }

    if (password !== adminPassword) {
        const failureState = await recordAdminFailure(
            identifier,
            FAILURE_WINDOW_SECONDS,
            MAX_FAILED_ATTEMPTS,
            LOCKOUT_SECONDS
        );

        if (failureState.isLocked) {
            return NextResponse.json(
                {
                    error: `Too many failed attempts. Try again in ${failureState.retryAfterSeconds}s.`,
                    retryAfter: failureState.retryAfterSeconds,
                },
                {
                    status: 429,
                    headers: { "Retry-After": String(failureState.retryAfterSeconds) },
                }
            );
        }

        return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    await clearAdminRateLimit(identifier);

    const token = await makeToken(password);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // 8-hour session
        maxAge: 60 * 60 * 8,
    });
    return response;
}
