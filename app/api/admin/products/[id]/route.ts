import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { Product } from "@/types/product";
import clientPromise from "@/lib/mongodb";

const DB = "blackinkkk";
const COLLECTION = "products";

// PUT /api/admin/products/[id]
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Disallow changing the id via body
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, _id: __id, ...update } = body;

        const client = await clientPromise;
        const col = client.db(DB).collection<Product>(COLLECTION);
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
