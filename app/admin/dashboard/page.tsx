"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Product, ProductTag } from "@/types/product";
import ImageDropZone from "./ImageDropZone";

// ─────────────────────────────────────────────────────────────────────────────
// Types for the "Add Product" form
// ─────────────────────────────────────────────────────────────────────────────
interface ColorDraft {
    name: string;
    hex: string;
    image_main: string;
    image_hover: string;
    sizeStocks: Record<string, number>;
}

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
type Size = (typeof ALL_SIZES)[number];

interface ProductDraft {
    sku: string;
    productId: string;
    title: string;
    price: string;
    originalPrice: string;
    category: string;
    stock: string;
    description: string;
    tag: ProductTag;
    includeHome: boolean;
    image_main: string;
    image_hover: string;
    material: string;
    care: string;
    sizes: Size[];
    colors: ColorDraft[];
    sizeStocks: Record<string, number>;
}

const EMPTY_DRAFT: ProductDraft = {
    sku: "",
    productId: "",
    title: "",
    price: "",
    originalPrice: "",
    category: "",
    stock: "",
    description: "",
    tag: null,
    includeHome: false,
    image_main: "",
    image_hover: "",
    material: "",
    care: "",
    sizes: [],
    colors: [],
    sizeStocks: {},
};

// ─────────────────────────────────────────────────────────────────────────────
// Small helper components
// ─────────────────────────────────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <label className="text-white/60 text-xs tracking-widest uppercase">
            {children}
        </label>
    );
}

function TextInput({
    value,
    onChange,
    placeholder,
    type = "text",
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
}) {
    return (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="bg-white/5 border border-white/15 text-white rounded-none px-3 py-2.5 text-sm outline-none focus:border-white/50 transition-colors placeholder:text-white/20 w-full"
        />
    );
}

function TextAreaInput({
    value,
    onChange,
    placeholder,
    rows = 3,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    rows?: number;
}) {
    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="bg-white/5 border border-white/15 text-white rounded-none px-3 py-2.5 text-sm outline-none focus:border-white/50 transition-colors placeholder:text-white/20 w-full resize-none"
        />
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: map an existing Product → ProductDraft for the edit form
// ─────────────────────────────────────────────────────────────────────────────
function productToDraft(p: Product): ProductDraft {
    return {
        sku: p.id,
        productId: p.productId ?? "",
        title: p.title,
        price: String(p.price),
        originalPrice: String(p.originalPrice),
        category: p.category ?? "",
        stock: String(p.stock),
        description: p.description ?? "",
        tag: p.tag ?? null,
        includeHome: p.includeHome ?? false,
        image_main: p.image_main,
        image_hover: p.image_hover,
        material: p.details?.material ?? "",
        care: p.details?.care ?? "",
        sizes: (p.sizes ?? []) as Size[],
        sizeStocks: Object.fromEntries(
            (p.sizeStocks ?? []).map((s) => [s.size, s.stock])
        ),
        colors: p.colors.map((c) => ({
            name: c.name,
            hex: c.hex,
            image_main: c.image_main,
            image_hover: "",
            sizeStocks: Object.fromEntries(
                (c.sizeStocks ?? []).map((s) => [s.size, s.stock])
            ),
        })),
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Product card in the admin grid
// ─────────────────────────────────────────────────────────────────────────────
function AdminProductCard({
    product,
    onDelete,
    onEdit,
}: {
    product: Product;
    onDelete: (id: string) => void;
    onEdit: (product: Product) => void;
}) {
    const [confirming, setConfirming] = useState(false);
    const [deleting, setDeleting] = useState(false);

    async function handleDelete() {
        if (!confirming) { setConfirming(true); return; }
        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/products/${product.id}`, {
                method: "DELETE",
            });
            if (res.ok) onDelete(product.id);
        } finally {
            setDeleting(false);
            setConfirming(false);
        }
    }

    return (
        <div className="group relative bg-white/5 border border-white/10 overflow-hidden flex flex-col">
            {/* Image */}
            <div className="relative aspect-3/4 bg-black/40 overflow-hidden">
                {product.image_main ? (
                    <Image
                        src={product.image_main}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white/20 text-xs">No image</span>
                    </div>
                )}
                {/* Tag badge */}
                {product.tag && (
                    <span className="absolute top-2 left-2 bg-white text-black text-[10px] tracking-widest uppercase px-2 py-0.5">
                        {product.tag}
                    </span>
                )}
            </div>

            {/* Info */}
            <div className="p-3 flex flex-col gap-1 flex-1">
                <p className="text-white text-sm font-medium leading-snug line-clamp-2">
                    {product.title}
                </p>
                <p className="text-white/40 text-xs">{product.category}</p>
                <div className="flex items-baseline gap-2 mt-auto pt-2">
                    <span className="text-white text-sm font-semibold">₹{product.price}</span>
                    {product.originalPrice > product.price && (
                        <span className="text-white/30 text-xs line-through">
                            ₹{product.originalPrice}
                        </span>
                    )}
                    <span className="ml-auto text-white/30 text-xs">{product.stock} in stock</span>
                </div>
            </div>

            {/* Edit button */}
            {!confirming && (
                <button
                    onClick={() => onEdit(product)}
                    className="w-full py-2.5 text-xs tracking-widest uppercase font-medium transition-colors bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70 border-t border-white/10"
                >
                    Edit
                </button>
            )}

            {/* Delete button */}
            <button
                onClick={handleDelete}
                disabled={deleting}
                className={`
                    w-full py-2.5 text-xs tracking-widest uppercase font-medium transition-colors
                    ${confirming
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-white/5 text-white/40 hover:bg-red-600/20 hover:text-red-400 border-t border-white/10"
                    }
                    disabled:opacity-50
                `}
            >
                {deleting ? "Deleting…" : confirming ? "Confirm Delete?" : "Delete"}
            </button>
            {/* Cancel confirm */}
            {confirming && (
                <button
                    onClick={() => setConfirming(false)}
                    className="w-full py-1.5 text-xs text-white/30 hover:text-white/60 bg-black/40 transition-colors"
                >
                    Cancel
                </button>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Color variant row inside the Add Product modal
// ─────────────────────────────────────────────────────────────────────────────
function ColorRow({
    color,
    index,
    sizes,
    onChange,
    onRemove,
}: {
    color: ColorDraft;
    index: number;
    sizes: Size[];
    onChange: (index: number, updated: ColorDraft) => void;
    onRemove: (index: number) => void;
}) {
    function set(key: keyof ColorDraft, value: string) {
        onChange(index, { ...color, [key]: value });
    }

    function setSizeStock(size: string, stock: number) {
        onChange(index, {
            ...color,
            sizeStocks: { ...color.sizeStocks, [size]: stock },
        });
    }

    return (
        <div className="border border-white/10 p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="text-white/50 text-xs uppercase tracking-widest">
                    Variant {index + 1}
                </span>
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="text-white/20 hover:text-red-400 transition-colors text-xs"
                >
                    Remove
                </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <FieldLabel>Color name</FieldLabel>
                    <TextInput value={color.name} onChange={(v) => set("name", v)} placeholder="e.g. Obsidian" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <FieldLabel>Hex</FieldLabel>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={color.hex || "#000000"}
                            onChange={(e) => set("hex", e.target.value)}
                            className="w-10 h-10 rounded-none border border-white/15 bg-transparent cursor-pointer p-0.5"
                        />
                        <TextInput value={color.hex} onChange={(v) => set("hex", v)} placeholder="#1F1F1F" />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <ImageDropZone label="Main image" value={color.image_main} onChange={(v) => set("image_main", v)} />
                <ImageDropZone label="Hover image" value={color.image_hover} onChange={(v) => set("image_hover", v)} />
            </div>
            {/* Per-size stock inputs */}
            {sizes.length > 0 && (
                <div className="flex flex-col gap-2 pt-1">
                    <span className="text-white/40 text-[10px] uppercase tracking-widest">
                        Stock per size
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                        {sizes.map((size) => (
                            <div key={size} className="flex items-center gap-2">
                                <span className="text-white/50 text-xs w-7 shrink-0">{size}</span>
                                <input
                                    type="number"
                                    min={0}
                                    value={color.sizeStocks[size] ?? 0}
                                    onChange={(e) =>
                                        setSizeStock(size, Math.max(0, Number(e.target.value) || 0))
                                    }
                                    className="bg-white/5 border border-white/15 text-white rounded-none px-2 py-1.5 text-xs outline-none focus:border-white/50 transition-colors w-full"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Add / Edit Product Modal
// ─────────────────────────────────────────────────────────────────────────────
function AddProductModal({
    onClose,
    onSaved,
    editProduct,
}: {
    onClose: () => void;
    onSaved: (p: Product) => void;
    editProduct?: Product | null;
}) {
    const isEdit = !!editProduct;
    const [draft, setDraft] = useState<ProductDraft>(
        isEdit ? productToDraft(editProduct!) : EMPTY_DRAFT
    );
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    function set<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
        setDraft((d) => ({ ...d, [key]: value }));
    }

    function toggleSize(size: Size) {
        setDraft((prev) => {
            const active = prev.sizes.includes(size);
            const newSizes = active
                ? prev.sizes.filter((s) => s !== size)
                : [...prev.sizes, size];

            // sync color sizeStocks
            const newColors = prev.colors.map((c) => {
                const s = { ...c.sizeStocks };
                if (active) delete s[size];
                else if (!(size in s)) s[size] = 0;
                return { ...c, sizeStocks: s };
            });

            // sync product-level sizeStocks
            const newSS = { ...prev.sizeStocks };
            if (active) delete newSS[size];
            else if (!(size in newSS)) newSS[size] = 0;

            return { ...prev, sizes: newSizes, colors: newColors, sizeStocks: newSS };
        });
    }

    // compute total stock for display
    const hasSizes = draft.sizes.length > 0;
    const hasColors = draft.colors.length > 0;
    const totalStock = (() => {
        if (hasSizes && hasColors) {
            return draft.colors.reduce(
                (sum, c) =>
                    sum + Object.values(c.sizeStocks).reduce((a, b) => a + b, 0),
                0
            );
        }
        if (hasSizes) {
            return Object.values(draft.sizeStocks).reduce((a, b) => a + b, 0);
        }
        return Number(draft.stock || 0);
    })();

    function addColor() {
        const initialSizeStocks: Record<string, number> = {};
        draft.sizes.forEach((size) => {
            initialSizeStocks[size] = 0;
        });
        set("colors", [
            ...draft.colors,
            { name: "", hex: "#000000", image_main: "", image_hover: "", sizeStocks: initialSizeStocks },
        ]);
    }

    function updateColor(index: number, updated: ColorDraft) {
        const next = [...draft.colors];
        next[index] = updated;
        set("colors", next);
    }

    function removeColor(index: number) {
        set("colors", draft.colors.filter((_, i) => i !== index));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!draft.sku.trim()) {
            setError("SKU code is required.");
            return;
        }
        if (!draft.productId.trim()) {
            setError("Product ID is required.");
            return;
        }
        if (!draft.title.trim() || !draft.price.trim() || !draft.originalPrice.trim()) {
            setError("Title, price, and original price are required.");
            return;
        }
        setError("");
        setSaving(true);
        try {
            const colors = draft.colors
                .filter((c) => c.name.trim())
                .map((c) => ({
                    name: c.name,
                    hex: c.hex,
                    image_main: c.image_main,
                    image_hover: c.image_hover || c.image_main,
                    sizeStocks: draft.sizes.map((size) => ({
                        size,
                        stock: c.sizeStocks[size] ?? 0,
                    })),
                }));

            const sizeStocks =
                draft.sizes.length > 0 && colors.length === 0
                    ? draft.sizes.map((size) => ({
                          size,
                          stock: draft.sizeStocks[size] ?? 0,
                      }))
                    : [];

            const body = {
                id: draft.sku.trim(),
                productId: draft.productId.trim(),
                title: draft.title.trim(),
                price: Number(draft.price),
                originalPrice: Number(draft.originalPrice),
                category: draft.category.trim(),
                stock: totalStock,
                description: draft.description.trim(),
                tag: draft.tag,
                includeHome: draft.includeHome,
                image_main: draft.image_main,
                image_hover: draft.image_hover || draft.image_main,
                details: {
                    material: draft.material.trim(),
                    care: draft.care.trim(),
                },
                sizes: draft.sizes,
                colors,
                sizeStocks,
            };

            const url = isEdit
                ? `/api/admin/products/${editProduct!.id}`
                : "/api/admin/products";
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error ?? (isEdit ? "Failed to update product." : "Failed to create product."));
                return;
            }

            const saved: Product = await res.json();
            onSaved(saved);
            onClose();
        } catch {
            setError("Something went wrong.");
        } finally {
            setSaving(false);
        }
    }

    return (
        // Backdrop
        <div
            className="fixed inset-0 bg-black/80 z-50 flex items-start justify-end"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            {/* Panel */}
            <div className="w-full max-w-xl h-full bg-[#0a0a0a] border-l border-white/10 overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-[#0a0a0a] border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
                    <div>
                        <p className="text-white/40 text-xs uppercase tracking-widest">Admin</p>
                        <h2 className="text-white text-base font-medium tracking-wide">
                            {isEdit ? "Edit Product" : "Add New Product"}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/30 hover:text-white transition-colors p-1"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-6">

                    {/* ── BASIC INFO ── */}
                    <section className="flex flex-col gap-4">
                        <SectionHeading>Basic Info</SectionHeading>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                                <FieldLabel>SKU Code *</FieldLabel>
                                <TextInput value={draft.sku} onChange={(v) => set("sku", v.toUpperCase().replace(/\s+/g, "-"))} placeholder="e.g. BLK-TS-001" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <FieldLabel>Product ID *</FieldLabel>
                                <TextInput value={draft.productId} onChange={(v) => set("productId", v.toUpperCase().replace(/\s+/g, "-"))} placeholder="e.g. PID-0001" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <FieldLabel>Product name *</FieldLabel>
                            <TextInput value={draft.title} onChange={(v) => set("title", v)} placeholder="e.g. Arctic Oversized Jacket" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                                <FieldLabel>Price *</FieldLabel>
                                <TextInput type="number" value={draft.price} onChange={(v) => set("price", v)} placeholder="129" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <FieldLabel>Original price *</FieldLabel>
                                <TextInput type="number" value={draft.originalPrice} onChange={(v) => set("originalPrice", v)} placeholder="179" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                                <FieldLabel>Category</FieldLabel>
                                <TextInput value={draft.category} onChange={(v) => set("category", v)} placeholder="e.g. Outerwear" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <FieldLabel>{hasSizes ? "Total Stock" : "Stock"}</FieldLabel>
                                {hasSizes ? (
                                    <div className="bg-white/5 border border-white/15 text-white/50 rounded-none px-3 py-2.5 text-sm">
                                        {totalStock} (auto-calculated)
                                    </div>
                                ) : (
                                    <TextInput type="number" value={draft.stock} onChange={(v) => set("stock", v)} placeholder="0" />
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                                <FieldLabel>Tag</FieldLabel>
                                <select
                                    value={draft.tag ?? ""}
                                    onChange={(e) => set("tag", (e.target.value as ProductTag) || null)}
                                    className="bg-white/5 border border-white/15 text-white rounded-none px-3 py-2.5 text-sm outline-none focus:border-white/50 transition-colors"
                                >
                                    <option value="">None</option>
                                    <option value="best-seller">Best Seller</option>
                                    <option value="new">New</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5 justify-end">
                                <label className="flex items-center gap-2.5 cursor-pointer pb-2.5">
                                    <div
                                        onClick={() => set("includeHome", !draft.includeHome)}
                                        className={`relative w-9 h-5 rounded-full transition-colors ${draft.includeHome ? "bg-white" : "bg-white/20"}`}
                                    >
                                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-black transition-transform ${draft.includeHome ? "translate-x-4.5" : "translate-x-0.5"}`} />
                                    </div>
                                    <span className="text-white/60 text-xs uppercase tracking-widest">Show on home</span>
                                </label>
                            </div>
                        </div>
                    </section>

                    <Divider />

                    {/* ── DESCRIPTION ── */}
                    <section className="flex flex-col gap-4">
                        <SectionHeading>Description</SectionHeading>
                        <div className="flex flex-col gap-1.5">
                            <FieldLabel>Description</FieldLabel>
                            <TextAreaInput value={draft.description} onChange={(v) => set("description", v)} placeholder="Describe the product…" rows={3} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <FieldLabel>Material</FieldLabel>
                            <TextInput value={draft.material} onChange={(v) => set("material", v)} placeholder="e.g. 80% wool, 20% recycled polyester" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <FieldLabel>Care instructions</FieldLabel>
                            <TextInput value={draft.care} onChange={(v) => set("care", v)} placeholder="e.g. Dry clean only" />
                        </div>
                    </section>

                    <Divider />

                    {/* ── SIZES ── */}
                    <section className="flex flex-col gap-4">
                        <SectionHeading>Available Sizes</SectionHeading>
                        <div className="flex flex-wrap gap-2">
                            {ALL_SIZES.map((size) => {
                                const active = draft.sizes.includes(size);
                                return (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => toggleSize(size)}
                                        className={`px-4 py-2 text-xs tracking-widest uppercase border transition-colors ${
                                            active
                                                ? "bg-white text-black border-white"
                                                : "bg-transparent text-white/40 border-white/15 hover:border-white/40 hover:text-white/70"
                                        }`}
                                    >
                                        {size}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* ── STOCK PER SIZE (only when sizes exist but no color variants) ── */}
                    {hasSizes && !hasColors && (
                        <>
                            <Divider />
                            <section className="flex flex-col gap-4">
                                <SectionHeading>Stock per Size</SectionHeading>
                                <div className="grid grid-cols-3 gap-2">
                                    {draft.sizes.map((size) => (
                                        <div key={size} className="flex items-center gap-2">
                                            <span className="text-white/50 text-xs w-7 shrink-0">{size}</span>
                                            <input
                                                type="number"
                                                min={0}
                                                value={draft.sizeStocks[size] ?? 0}
                                                onChange={(e) =>
                                                    set("sizeStocks", {
                                                        ...draft.sizeStocks,
                                                        [size]: Math.max(0, Number(e.target.value) || 0),
                                                    })
                                                }
                                                className="bg-white/5 border border-white/15 text-white rounded-none px-2 py-1.5 text-xs outline-none focus:border-white/50 transition-colors w-full"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </>
                    )}

                    <Divider />

                    {/* ── IMAGES ── */}
                    <section className="flex flex-col gap-4">
                        <SectionHeading>Product Images</SectionHeading>
                        <div className="grid grid-cols-2 gap-4">
                            <ImageDropZone label="Main image" value={draft.image_main} onChange={(v) => set("image_main", v)} />
                            <ImageDropZone label="Hover image" value={draft.image_hover} onChange={(v) => set("image_hover", v)} />
                        </div>
                    </section>

                    <Divider />

                    {/* ── COLOR VARIANTS ── */}
                    <section className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <SectionHeading>Color Variants</SectionHeading>
                            <button
                                type="button"
                                onClick={addColor}
                                className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest flex items-center gap-1.5"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                Add variant
                            </button>
                        </div>
                        {draft.colors.length === 0 && (
                            <p className="text-white/20 text-xs">No variants added yet.</p>
                        )}
                        {draft.colors.map((color, i) => (
                            <ColorRow
                                key={i}
                                color={color}
                                index={i}
                                sizes={draft.sizes}
                                onChange={updateColor}
                                onRemove={removeColor}
                            />
                        ))}
                    </section>

                    {/* ── SUBMIT ── */}
                    {error && <p className="text-red-400 text-xs">{error}</p>}
                    <div className="flex gap-3 pt-2 pb-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-white text-black text-xs tracking-[0.2em] uppercase px-6 py-3.5 font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
                        >
                            {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Product"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3.5 text-xs tracking-[0.2em] uppercase text-white/40 border border-white/10 hover:border-white/30 hover:text-white/70 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <h3 className="text-white/80 text-xs font-semibold tracking-[0.2em] uppercase">
            {children}
        </h3>
    );
}

function Divider() {
    return <div className="border-t border-white/8" />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard Page
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [loggingOut, setLoggingOut] = useState(false);

    const fetchProducts = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/products");
            if (res.status === 401) { router.push("/admin"); return; }
            const data = await res.json();
            setProducts(data);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    function handleDeleted(id: string) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
    }

    function handleCreated(product: Product) {
        setProducts((prev) => [product, ...prev]);
    }

    function handleUpdated(product: Product) {
        setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
    }

    async function handleLogout() {
        setLoggingOut(true);
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin");
    }

    return (
        <div className="min-h-screen bg-[#080808]">
            {/* Top Bar */}
            <header className="sticky top-0 z-30 bg-[#080808]/95 backdrop-blur border-b border-white/10 px-6 sm:px-10 py-4 flex items-center justify-between">
                <div>
                    <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase">Admin Panel</p>
                    <h1 className="text-white text-lg tracking-[0.12em] uppercase font-light">BLACKINKKK</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-white/30 text-xs hidden sm:block">{products.length} products</span>
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="text-white/30 hover:text-white/70 text-xs tracking-widest uppercase transition-colors"
                    >
                        {loggingOut ? "…" : "Log out"}
                    </button>
                </div>
            </header>

            {/* Products Grid */}
            <main className="px-6 sm:px-10 py-8">
                {loading ? (
                    <div className="flex items-center justify-center min-h-64">
                        <p className="text-white/20 text-sm tracking-widest uppercase animate-pulse">
                            Loading products…
                        </p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-64 gap-3">
                        <p className="text-white/20 text-sm">No products yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {products.map((product) => (
                            <AdminProductCard
                                key={product.id}
                                product={product}
                                onDelete={handleDeleted}
                                onEdit={(p) => setEditingProduct(p)}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Floating Add Button */}
            <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-8 right-8 w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:bg-white/90 active:scale-95 transition-all z-40"
                title="Add product"
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>

            {/* Add Product Modal */}
            {showModal && (
                <AddProductModal
                    onClose={() => setShowModal(false)}
                    onSaved={handleCreated}
                />
            )}

            {/* Edit Product Modal */}
            {editingProduct && (
                <AddProductModal
                    editProduct={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onSaved={(updated) => {
                        handleUpdated(updated);
                        setEditingProduct(null);
                    }}
                />
            )}
        </div>
    );
}
