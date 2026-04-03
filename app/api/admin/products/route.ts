import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { Product, ProductColor, SizeStock } from "@/types/product";
import clientPromise from "@/lib/mongodb";

const DB = "blackinkkk";
const COLLECTION = "products";

async function collection() {
    const client = await clientPromise;
    return client.db(DB).collection<Product>(COLLECTION);
}

function computeTotalStock(
    colors: ProductColor[],
    sizeStocks?: SizeStock[],
    fallback = 0
): number {
    if (colors.length > 0) {
        const total = colors.reduce(
            (sum, c) =>
                sum + (c.sizeStocks ?? []).reduce((s, ss) => s + ss.stock, 0),
            0
        );
        if (total > 0) return total;
    }
    if (sizeStocks && sizeStocks.length > 0) {
        return sizeStocks.reduce((sum, ss) => sum + ss.stock, 0);
    }
    return fallback;
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
        const sku = String(body.id ?? "").trim();
        const productId = String(body.productId ?? "").trim();

        // Validate minimum required fields
        if (!sku || !productId || !body.title || body.price == null) {
            return NextResponse.json(
                { error: "SKU code, Product ID, title, and price are required." },
                { status: 400 }
            );
        }

        // Check for duplicate SKU
        const col = await collection();
        const existing = await col.findOne({ id: sku });
        if (existing) {
            return NextResponse.json(
                { error: "A product with this SKU code already exists." },
                { status: 409 }
            );
        }

        const existingProductId = await col.findOne({ productId });
        if (existingProductId) {
            return NextResponse.json(
                { error: "A product with this Product ID already exists." },
                { status: 409 }
            );
        }

        const colors: ProductColor[] = (body.colors ?? []).map(
            (c: ProductColor) => ({
                name: c.name,
                hex: c.hex,
                image_main: c.image_main,
                sizeStocks: c.sizeStocks ?? [],
            })
        );

        const sizeStocks: SizeStock[] = body.sizeStocks ?? [];

        const newProduct: Product = {
            id: sku,
            productId,
            title: body.title,
            price: Number(body.price),
            originalPrice: Number(body.originalPrice ?? body.price),
            image_main: body.image_main ?? "",
            image_hover: body.image_hover ?? body.image_main ?? "",
            tag: body.tag ?? null,
            includeHome: body.includeHome ?? false,
            stock: computeTotalStock(colors, sizeStocks, Number(body.stock ?? 0)),
            category: body.category ?? "",
            description: body.description ?? "",
            details: body.details ?? { material: "", care: "" },
            colors,
            sizes: body.sizes ?? [],
            sizeStocks,
        };

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
