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

export async function getProducts(): Promise<Product[]> {
    const col = await collection();
    const products = await col.find({}, { projection: { _id: 0 } }).toArray();
    return shuffle(products);
}

export async function getHomeProducts(): Promise<Product[]> {
    const col = await collection();
    const products = await col.find({ includeHome: true }, { projection: { _id: 0 } }).toArray();
    return shuffle(products);
}

export async function getProductById(id: string): Promise<Product | null> {
    const col = await collection();
    return col.findOne({ id }, { projection: { _id: 0 } });
}
