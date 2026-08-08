import { cache } from "react";
import type { Product } from "@/types/product";
import clientPromise from "./mongodb";

const DB = "blackinkkk";
const COLLECTION = "products";

async function collection() {
    const client = await clientPromise;
    return client.db(DB).collection<Product>(COLLECTION);
}

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// cache() deduplicates identical calls within the same RSC render pass.
// NavWrapper and any product grid sharing the same request hit MongoDB once.
export const getProducts = cache(async function getProducts(): Promise<Product[]> {
    const col = await collection();
    const products = await col.find({}, { projection: { _id: 0 } }).toArray();
    return shuffle(products);
});

export const getHomeProducts = cache(async function getHomeProducts(): Promise<Product[]> {
    const col = await collection();
    // Only fetch fields consumed by the home product card
    const products = await col
        .find(
            { includeHome: true },
            {
                projection: {
                    _id: 0,
                    id: 1,
                    title: 1,
                    price: 1,
                    originalPrice: 1,
                    image_main: 1,
                    image_hover: 1,
                    tag: 1,
                    stock: 1,
                    sizes: 1,
                },
            }
        )
        .toArray();
    return shuffle(products);
});

export const getProductById = cache(async function getProductById(id: string): Promise<Product | null> {
    const col = await collection();
    return col.findOne({ id }, { projection: { _id: 0 } });
});
