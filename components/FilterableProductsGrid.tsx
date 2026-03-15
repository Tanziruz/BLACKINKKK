"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal, X, ChevronDown, Check } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { Product, ProductTag } from "@/types/product";
import ProductCard from "@/components/Cards/ProuductCard";
import BestSellerTag from "@/components/Buttons_And_Links/BestSellerTag";
import ProductCardTag from "@/components/Buttons_And_Links/ProductCardTag";

/* ─── helpers ─── */
function resolveTag(tag?: ProductTag) {
    if (tag === "best-seller") return <BestSellerTag />;
    if (tag === "new") return <ProductCardTag />;
    return undefined;
}

type SortOption = "default" | "price-asc" | "price-desc";

const SORT_LABELS: Record<SortOption, string> = {
    default: "Sort: Default",
    "price-asc": "Price: Low to High",
    "price-desc": "Price: High to Low",
};

/* ─── Reusable pill button ─── */
function Pill({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={`px-3.5 py-1.5 rounded-full font-Inter text-[13px] tracking-[-0.02em] leading-[1.4em] transition-all duration-200 cursor-pointer whitespace-nowrap ${
                active
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black/6"
            }`}
        >
            {children}
        </button>
    );
}

/* ─── Main component ─── */
export default function FilterableProductsGrid({ products }: { products: Product[] }) {
    const categories = useMemo(() => {
        const cats = products
            .map((p) => p.category)
            .filter((c): c is string => !!c);
        return ["All", ...Array.from(new Set(cats))];
    }, [products]);

    const colors = useMemo(() => {
        const colorNames = products.flatMap((p) => (p.colors ?? []).map((c) => c.name).filter(Boolean));
        return ["All", ...Array.from(new Set(colorNames))];
    }, [products]);

    const sizes = useMemo(() => {
        const directSizes = products.flatMap((p) => p.sizes ?? []);
        const sizeStocks = products.flatMap((p) => (p.sizeStocks ?? []).map((s) => s.size));
        const colorSizeStocks = products.flatMap((p) =>
            (p.colors ?? []).flatMap((c) => (c.sizeStocks ?? []).map((s) => s.size))
        );

        return ["All", ...Array.from(new Set([...directSizes, ...sizeStocks, ...colorSizeStocks]))];
    }, [products]);

    const [activeCategory, setActiveCategory] = useState("All");
    const [activeColor, setActiveColor] = useState("All");
    const [activeSize, setActiveSize] = useState("All");
    const [activeTag, setActiveTag] = useState<"all" | "new" | "best-seller">("all");
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sort, setSort] = useState<SortOption>("default");
    const [filtersOpen, setFiltersOpen] = useState(false);

    const filtered = useMemo(() => {
        let result = products.filter((p) => {
            if (activeCategory !== "All" && p.category !== activeCategory) return false;
            if (activeColor !== "All" && !(p.colors ?? []).some((c) => c.name === activeColor)) return false;
            if (activeSize !== "All") {
                const productSizes = new Set<string>([
                    ...(p.sizes ?? []),
                    ...(p.sizeStocks ?? []).map((s) => s.size),
                    ...(p.colors ?? []).flatMap((c) => (c.sizeStocks ?? []).map((s) => s.size)),
                ]);
                if (!productSizes.has(activeSize)) return false;
            }
            if (activeTag !== "all" && p.tag !== activeTag) return false;
            if (inStockOnly && p.stock === 0) return false;
            return true;
        });

        if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
        if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
        return result;
    }, [products, activeCategory, activeColor, activeSize, activeTag, inStockOnly, sort]);

    const hasActiveFilters =
        activeCategory !== "All" ||
        activeColor !== "All" ||
        activeSize !== "All" ||
        activeTag !== "all" ||
        inStockOnly ||
        sort !== "default";

    function resetAll() {
        setActiveCategory("All");
        setActiveColor("All");
        setActiveSize("All");
        setActiveTag("all");
        setInStockOnly(false);
        setSort("default");
    }

    return (
        <div className="w-full">
            {/* ── Filter bar ── */}
            <div className="flex flex-col gap-3">
                {/* Top row: toggle + sort + results count */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <button
                            onClick={() => setFiltersOpen((o) => !o)}
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-Inter text-[13px] tracking-[-0.02em] leading-[1.4em] transition-all duration-200 cursor-pointer border ${
                                filtersOpen || hasActiveFilters
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-black border-black/10 hover:border-black/30"
                            }`}
                        >
                            <SlidersHorizontal size={13} strokeWidth={2} />
                            Filters
                            {hasActiveFilters && (
                                <span className="w-1.5 h-1.5 rounded-full bg-white/80 -ml-0.5" />
                            )}
                        </button>

                        {hasActiveFilters && (
                            <button
                                onClick={resetAll}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full font-Inter text-[12px] tracking-[-0.02em] text-gray hover:text-black transition-colors duration-200 cursor-pointer"
                            >
                                <X size={11} strokeWidth={2} />
                                Clear all
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Sort dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 bg-white border border-black/10 hover:border-black/30 rounded-full pl-3.5 pr-3 py-1.5 font-Inter text-[13px] tracking-[-0.02em] text-black cursor-pointer transition-colors duration-200 focus:outline-none data-[state=open]:border-black/40">
                                    {SORT_LABELS[sort]}
                                    <ChevronDown size={12} strokeWidth={2} className="text-gray" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="min-w-45">
                                {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                                    <DropdownMenuItem
                                        key={key}
                                        onSelect={() => setSort(key)}
                                        className="flex items-center justify-between gap-3 font-Inter text-[13px] tracking-[-0.02em] cursor-pointer"
                                    >
                                        {SORT_LABELS[key]}
                                        {sort === key && <Check size={13} strokeWidth={2.5} className="text-black" />}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Results count */}
                        <span className="hidden sm:block font-Inter text-[13px] text-gray tracking-[-0.02em]">
                            {filtered.length} {filtered.length === 1 ? "item" : "items"}
                        </span>
                    </div>
                </div>

                {/* Expandable filter panel */}
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        filtersOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="bg-white rounded-2xl p-4 md:p-5 flex flex-col gap-4">

                        {/* Category */}
                        <div className="flex flex-col gap-2">
                            <span className="font-Inter text-[11px] uppercase tracking-[0.08em] text-gray font-medium">
                                Category
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((cat) => (
                                    <Pill
                                        key={cat}
                                        active={activeCategory === cat}
                                        onClick={() => setActiveCategory(cat)}
                                    >
                                        {cat}
                                    </Pill>
                                ))}
                            </div>
                        </div>

                        {/* Tag */}
                        <div className="flex flex-col gap-2">
                            <span className="font-Inter text-[11px] uppercase tracking-[0.08em] text-gray font-medium">
                                Tag
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {(["all", "new", "best-seller"] as const).map((t) => (
                                    <Pill
                                        key={t}
                                        active={activeTag === t}
                                        onClick={() => setActiveTag(t)}
                                    >
                                        {t === "all" ? "All" : t === "new" ? "New" : "Best Seller"}
                                    </Pill>
                                ))}
                            </div>
                        </div>

                        {/* Color */}
                        {colors.length > 1 && (
                            <div className="flex flex-col gap-2">
                                <span className="font-Inter text-[11px] uppercase tracking-[0.08em] text-gray font-medium">
                                    Color
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {colors.map((color) => (
                                        <Pill
                                            key={color}
                                            active={activeColor === color}
                                            onClick={() => setActiveColor(color)}
                                        >
                                            {color}
                                        </Pill>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size */}
                        {sizes.length > 1 && (
                            <div className="flex flex-col gap-2">
                                <span className="font-Inter text-[11px] uppercase tracking-[0.08em] text-gray font-medium">
                                    Size
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map((size) => (
                                        <Pill
                                            key={size}
                                            active={activeSize === size}
                                            onClick={() => setActiveSize(size)}
                                        >
                                            {size}
                                        </Pill>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stock */}
                        <div className="flex items-center gap-3">
                            <button
                                role="switch"
                                aria-checked={inStockOnly}
                                onClick={() => setInStockOnly((v) => !v)}
                                className={`relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer focus:outline-none ${
                                    inStockOnly ? "bg-black" : "bg-black/20"
                                }`}
                            >
                                <span
                                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                                        inStockOnly ? "translate-x-4" : "translate-x-0"
                                    }`}
                                />
                            </button>
                            <span className="font-Inter text-[13px] tracking-[-0.02em] text-black">
                                In stock only
                            </span>
                        </div>
                    </div>
                </div>

                {/* Active filter chips */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2">
                        {activeCategory !== "All" && (
                            <button
                                onClick={() => setActiveCategory("All")}
                                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/6 font-Inter text-[12px] tracking-[-0.02em] text-black hover:bg-black/10 transition-colors duration-150 cursor-pointer"
                            >
                                {activeCategory}
                                <X size={10} strokeWidth={2.5} />
                            </button>
                        )}
                        {activeColor !== "All" && (
                            <button
                                onClick={() => setActiveColor("All")}
                                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/6 font-Inter text-[12px] tracking-[-0.02em] text-black hover:bg-black/10 transition-colors duration-150 cursor-pointer"
                            >
                                Color: {activeColor}
                                <X size={10} strokeWidth={2.5} />
                            </button>
                        )}
                        {activeSize !== "All" && (
                            <button
                                onClick={() => setActiveSize("All")}
                                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/6 font-Inter text-[12px] tracking-[-0.02em] text-black hover:bg-black/10 transition-colors duration-150 cursor-pointer"
                            >
                                Size: {activeSize}
                                <X size={10} strokeWidth={2.5} />
                            </button>
                        )}
                        {activeTag !== "all" && (
                            <button
                                onClick={() => setActiveTag("all")}
                                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/6 font-Inter text-[12px] tracking-[-0.02em] text-black hover:bg-black/10 transition-colors duration-150 cursor-pointer"
                            >
                                {activeTag === "new" ? "New" : "Best Seller"}
                                <X size={10} strokeWidth={2.5} />
                            </button>
                        )}
                        {inStockOnly && (
                            <button
                                onClick={() => setInStockOnly(false)}
                                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/6 font-Inter text-[12px] tracking-[-0.02em] text-black hover:bg-black/10 transition-colors duration-150 cursor-pointer"
                            >
                                In stock only
                                <X size={10} strokeWidth={2.5} />
                            </button>
                        )}
                        {sort !== "default" && (
                            <button
                                onClick={() => setSort("default")}
                                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/6 font-Inter text-[12px] tracking-[-0.02em] text-black hover:bg-black/10 transition-colors duration-150 cursor-pointer"
                            >
                                {sort === "price-asc" ? "Price ↑" : "Price ↓"}
                                <X size={10} strokeWidth={2.5} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* ── Grid ── */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 mt-5">
                    {filtered.map((product) => (
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
            ) : (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <span className="font-Ronzino-Medium text-black text-[22px] tracking-[-0.03em]">
                        No results found
                    </span>
                    <span className="font-Inter text-[14px] text-gray tracking-[-0.02em]">
                        Try adjusting or clearing your filters.
                    </span>
                    <button
                        onClick={resetAll}
                        className="mt-2 px-5 py-2 rounded-full bg-black text-white font-Inter text-[13px] tracking-[-0.02em] hover:bg-black/80 transition-colors duration-200 cursor-pointer"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    );
}
