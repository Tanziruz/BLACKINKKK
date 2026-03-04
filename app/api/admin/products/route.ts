import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { Product } from "@/types/product";
import clientPromise from "@/lib/mongodb";

const DB = "blackinkkk";
const COLLECTION = "products";

async function collection() {
    const client = await clientPromise;
    return client.db(DB).collection<Product>(COLLECTION);
}

// GET /api/admin/products — return all products
export async function GET() {
    try {
        const col = await collection();
        const products = await col.find({}, { projection: { _id: 0 } }).toArray();
        return NextResponse.json(products);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch products." }, { status: 500 });
    }
}

// POST /api/admin/products — create a new product
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate minimum required fields
        if (!body.title || body.price == null) {
            return NextResponse.json(
                { error: "title and price are required." },
                { status: 400 }
            );
        }

        const newProduct: Product = {
            id: `prod-${Date.now()}`,
            title: body.title,
            price: Number(body.price),
            originalPrice: Number(body.originalPrice ?? body.price),
            image_main: body.image_main ?? "",
            image_hover: body.image_hover ?? body.image_main ?? "",
            tag: body.tag ?? null,
            includeHome: body.includeHome ?? false,
            stock: Number(body.stock ?? 0),
            category: body.category ?? "",
            description: body.description ?? "",
            details: body.details ?? { material: "", care: "", warranty: "" },
            colors: body.colors ?? [],
        };

        const col = await collection();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (col as any).insertOne(newProduct);

        // Bust the Next.js cache so the home & products pages show the new product
        revalidatePath("/");
        revalidatePath("/products");

        return NextResponse.json(newProduct, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
    }
}
