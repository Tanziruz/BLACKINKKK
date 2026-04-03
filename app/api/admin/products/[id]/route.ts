import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { Product, ProductColor, SizeStock } from "@/types/product";
import clientPromise from "@/lib/mongodb";

const DB = "blackinkkk";
const COLLECTION = "products";

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

// PUT /api/admin/products/[id]
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Extract new SKU (id) if provided, strip Mongo _id
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: newId, _id: __id, ...update } = body;
        const trimmedProductId =
            typeof update.productId === "string" ? update.productId.trim() : undefined;
        if (typeof update.productId === "string") {
            if (!trimmedProductId) {
                return NextResponse.json(
                    { error: "Product ID is required." },
                    { status: 400 }
                );
            }
            update.productId = trimmedProductId;
        }

        // Recompute total stock if variant data is present
        if (update.colors || update.sizeStocks) {
            update.stock = computeTotalStock(
                update.colors ?? [],
                update.sizeStocks,
                Number(update.stock ?? 0)
            );
        }

        const client = await clientPromise;
        const col = client.db(DB).collection<Product>(COLLECTION);

        // If the SKU is being changed, check for duplicates
        const skuChanged = newId && newId !== id;
        if (skuChanged) {
            const dup = await col.findOne({ id: newId });
            if (dup) {
                return NextResponse.json(
                    { error: "A product with this SKU code already exists." },
                    { status: 409 }
                );
            }
            update.id = newId;
        }

        if (trimmedProductId) {
            const dupProductId = await col.findOne({ productId: trimmedProductId, id: { $ne: id } });
            if (dupProductId) {
                return NextResponse.json(
                    { error: "A product with this Product ID already exists." },
                    { status: 409 }
                );
            }
        }

        const result = await col.findOneAndUpdate(
            { id },
            { $set: update },
            { returnDocument: "after" }
        );

        if (!result) {
            return NextResponse.json({ error: "Product not found." }, { status: 404 });
        }

        revalidatePath("/");
        revalidatePath("/products");
        revalidatePath(`/products/${id}`);
        if (skuChanged) revalidatePath(`/products/${newId}`);

        return NextResponse.json(result);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
    }
}

// DELETE /api/admin/products/[id]
export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const client = await clientPromise;
        const col = client.db(DB).collection<Product>(COLLECTION);
        const result = await col.deleteOne({ id });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Product not found." }, { status: 404 });
        }

        revalidatePath("/");
        revalidatePath("/products");
        revalidatePath(`/products/${id}`);

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to delete product." }, { status: 500 });
    }
}
