import { getProductById } from "@/lib/products";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ id: string }>;
}

// Both generateMetadata and the page handler call getProductById with the same id.
// React cache() in lib/products.ts deduplicates these within the same render —
// only one MongoDB round-trip per request.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) return { title: "Product Not Found" };
    return {
        title: `${product.title} — BlackInkkk`,
        description: product.description ?? `Shop ${product.title} at BlackInkkk.`,
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const { id } = await params;
    // Free — result is already cached from generateMetadata call above
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    return <ProductDetail product={product} />;
}
