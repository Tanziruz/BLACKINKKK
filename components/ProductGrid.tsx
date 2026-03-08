// Server Component — no "use client" needed
import { getHomeProducts } from "@/lib/products";
import type { ProductTag } from "@/types/product";
import ProductCard from "@/components/Cards/ProuductCard";
import BestSellerTag from "@/components/Buttons_And_Links/BestSellerTag";
import ProductCardTag from "@/components/Buttons_And_Links/ProductCardTag";

function resolveTag(tag?: ProductTag) {
    if (tag === "best-seller") return <BestSellerTag />;
    if (tag === "new") return <ProductCardTag />;
    return undefined;
}

export default async function ProductGrid() {
    const products = await getHomeProducts();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-4 md:mt-6">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    image_main={product.image_main}
                    image_hover={product.image_hover}
                    tag={resolveTag(product.tag)}
                    stock={product.stock}
                    sizes={product.sizes}
                />
            ))}
        </div>
    );
}
