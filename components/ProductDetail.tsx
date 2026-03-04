"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Globe2,
    Scissors,
    ShieldCheck,
    MapPin,
    CreditCard,
    RotateCcw,
    Mail,
    PhoneCall,
    Ruler,
    X,
} from "lucide-react";
import type { Product } from "@/types/product";
import ProductCardTag from "./Buttons_And_Links/ProductCardTag";
import BestSellerTag from "./Buttons_And_Links/BestSellerTag";
import { Stagger, StaggerItem } from "./Animate";

function WhatsAppIcon() {
    return (
        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ffffff">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
    );
}

const CONTACT_WHATSAPP = "919810367883"; // replace with real number (digits only)
const CONTACT_EMAIL    = "Blackinkkk@aol.com"; // replace with real email
const CONTACT_PHONE    = "+919810367883"; // replace with real phone

const E = [0.22, 1, 0.36, 1] as const;
const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E";
function entry(delay = 0) {
    return {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.55, delay, ease: E },
    };
}

function ContactSheet({ productTitle, onClose }: { productTitle: string; onClose: () => void }) {
    const waMessage = encodeURIComponent(
        `Hi! I'm interested in ordering the "${productTitle}". Could you help me with more design options?`
    );
    const waHref    = `https://wa.me/${CONTACT_WHATSAPP.replace(/\D/g, "")}?text=${waMessage}`;
    const mailHref  = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Order Inquiry – ${productTitle}`)}&body=${encodeURIComponent(`Hi,\n\nI'm interested in the ${productTitle} and would like to know more about the available designs.\n\nThank you!`)}`;
    const telHref   = `tel:${CONTACT_PHONE}`;

    const options = [
        {
            icon: WhatsAppIcon,
            label: "WhatsApp",
            sublabel: CONTACT_WHATSAPP,
            href: waHref,
            bg: "bg-[#25D366]",
            external: true,
        },
        {
            icon: Mail,
            label: "Email",
            sublabel: CONTACT_EMAIL,
            href: mailHref,
            bg: "bg-black",
            external: false,
        },
        {
            icon: PhoneCall,
            label: "Call us",
            sublabel: CONTACT_PHONE,
            href: telHref,
            bg: "bg-black",
            external: false,
        },
    ] as const;

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                key="cs-backdrop"
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
                onClick={onClose}
            />

            {/* Sheet */}
            <motion.div
                key="cs-sheet"
                className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[28px] px-5 pt-5 pb-8 shadow-2xl"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ duration: 0.42, ease: E }}
            >
                {/* Pull handle */}
                <div className="w-10 h-1 rounded-full bg-black/15 mx-auto mb-5" />

                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <p className="font-Inter text-black/40 text-[11px] tracking-[0.12em] uppercase mb-0.5">
                            {productTitle}
                        </p>
                        <h3 className="font-Ronzino-Medium text-black text-[20px] tracking-[-0.03em] leading-[1.25em]">
                            Contact us for more designs
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-black/6 hover:bg-black/10 transition-colors shrink-0 mt-0.5"
                        aria-label="Close"
                    >
                        <X size={16} strokeWidth={2} className="text-black/60" />
                    </button>
                </div>

                {/* Options */}
                <div className="flex flex-col gap-3">
                    {options.map(({ icon: Icon, label, sublabel, href, bg, external }) => (
                        <motion.a
                            key={label}
                            href={href}
                            target={external ? "_blank" : undefined}
                            rel={external ? "noopener noreferrer" : undefined}
                            className="flex items-center gap-4 rounded-2xl bg-[#F4F4F2] px-4 py-4 active:scale-[0.98] transition-transform duration-150"
                            whileTap={{ scale: 0.97 }}
                        >
                            <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                                <Icon size={20} color="#fff" strokeWidth={1.75} />
                            </div>
                            <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="font-Ronzino-Medium text-black text-[15px] tracking-[-0.02em] leading-none">
                                    {label}
                                </span>
                                <span className="font-Inter text-black/45 text-[12px] tracking-[-0.01em] truncate">
                                    {sublabel}
                                </span>
                            </div>
                            <svg
                                className="ml-auto text-black/25 shrink-0"
                                width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="1.75"
                            >
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </motion.a>
                    ))}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Size Selector
// ─────────────────────────────────────────────────────────────────────────────
function SizeSelector({ sizes }: { sizes: string[] }) {
    const [selected, setSelected] = useState<string | null>(null);
    return (
        <motion.div {...entry(0.40)} className="mb-5">
            <p className="font-Inter text-[13px] text-black mb-2.5">
                <span className="font-medium">Size</span>
                {selected && <span className="text-gray ml-2">{selected}</span>}
            </p>
            <div className="flex flex-wrap items-center gap-2">
                {sizes.map((size) => (
                    <button
                        key={size}
                        onClick={() => setSelected(size === selected ? null : size)}
                        className={`min-w-11 h-11 px-3 rounded-xl font-Inter text-[13px] font-medium tracking-[-0.01em] border transition-all duration-200 cursor-pointer ${
                            size === selected
                                ? "bg-black text-white border-black"
                                : "bg-white text-black border-black/15 hover:border-black/50"
                        }`}
                    >
                        {size}
                    </button>
                ))}
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Size Chart
// ─────────────────────────────────────────────────────────────────────────────
const SIZE_CHART_ROWS = [
    { size: "Small",  chestIn: 40, chestCm: 102, bodyIn: 27, bodyCm: 69,  sleeveIn: 8.5, sleeveCm: 22 },
    { size: "Medium", chestIn: 42, chestCm: 107, bodyIn: 28, bodyCm: 72,  sleeveIn: 9,   sleeveCm: 23 },
    { size: "Large",  chestIn: 44, chestCm: 112, bodyIn: 29, bodyCm: 74,  sleeveIn: 9.5, sleeveCm: 24 },
    { size: "XL",     chestIn: 47, chestCm: 120, bodyIn: 30, bodyCm: 76,  sleeveIn: 10,  sleeveCm: 25 },
];

function SizeChart() {
    return (
        <section className="px-4 sm:px-6 md:px-10 lg:px-16 pb-10 md:pb-14">
            <div className="bg-white rounded-2xl overflow-hidden border border-black/8">
                {/* Header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-black/8">
                    <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center shrink-0">
                        <Ruler className="w-4 h-4 text-white" strokeWidth={1.75} />
                    </div>
                    <div>
                        <p className="font-Ronzino-Medium text-black text-[14px] md:text-[15px] tracking-[-0.02em] leading-none mb-0.5">
                            Size Chart
                        </p>
                        <p className="font-Inter text-[11px] text-gray tracking-[-0.01em]">
                            Find your perfect fit
                        </p>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-120">
                        <thead>
                            <tr className="bg-black/4">
                                <th rowSpan={2} className="px-5 py-3 font-Inter text-[11px] font-semibold text-black/60 tracking-[0.08em] uppercase border-b border-r border-black/8 align-middle whitespace-nowrap">
                                    Size
                                </th>
                                <th colSpan={2} className="px-5 py-2 font-Inter text-[11px] font-semibold text-black/60 tracking-[0.08em] uppercase border-b border-r border-black/8 text-center">
                                    Chest
                                </th>
                                <th colSpan={2} className="px-5 py-2 font-Inter text-[11px] font-semibold text-black/60 tracking-[0.08em] uppercase border-b border-r border-black/8 text-center">
                                    Body Length
                                </th>
                                <th colSpan={2} className="px-5 py-2 font-Inter text-[11px] font-semibold text-black/60 tracking-[0.08em] uppercase border-b border-black/8 text-center">
                                    Sleeve Length
                                </th>
                            </tr>
                            <tr className="bg-black/4">
                                {["Inch", "Cm", "Inch", "Cm", "Inch", "Cm"].map((label, i) => (
                                    <th
                                        key={i}
                                        className={`px-4 py-2 font-Inter text-[11px] font-medium text-black/50 tracking-[-0.01em] italic border-b border-black/8 text-center ${i !== 5 ? "border-r" : ""}`}
                                    >
                                        {label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {SIZE_CHART_ROWS.map((row, idx) => (
                                <tr
                                    key={row.size}
                                    className={idx % 2 === 0 ? "bg-white" : "bg-[#F4F4F4]/60"}
                                >
                                    <td className="px-5 py-3.5 font-Ronzino-Medium text-black text-[14px] tracking-[-0.02em] border-r border-black/8 italic whitespace-nowrap">
                                        {row.size}
                                    </td>
                                    {[row.chestIn, row.chestCm, row.bodyIn, row.bodyCm, row.sleeveIn, row.sleeveCm].map((val, i) => (
                                        <td
                                            key={i}
                                            className={`px-4 py-3.5 font-Inter text-[13px] text-black/75 text-center ${i !== 5 ? "border-r border-black/8" : ""}`}
                                        >
                                            {val}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

// ─────────────────────────────────────────────────────────────────────────────

interface Props {
    product: Product;
}

const FEATURES = [
    {
        icon: ShieldCheck,
        title: "Trusted Quality",
        desc: "Every piece is checked to ensure it meets our standards.",
    },
    {
        icon: MapPin,
        title: "Real Time Tracking",
        desc: "Get live updates from our warehouse to your doorstep.",
    },
    {
        icon: CreditCard,
        title: "Secure Payments",
        desc: "Shop confidently with our secure, encrypted checkout.",
    },
    {
        icon: RotateCcw,
        title: "Easy Returns",
        desc: "Change your mind? Return any item easily within thirty days.",
    },
];

export default function ProductDetail({ product }: Props) {
    const hasColors = !!(product.colors && product.colors.length > 0);

    const [activeColorIndex, setActiveColorIndex] = useState(0);
    const [showContact, setShowContact] = useState(false);

    const currentImageMain = (hasColors
        ? product.colors![activeColorIndex].image_main
        : product.image_main) || PLACEHOLDER;

    const thumbnails = hasColors
        ? product.colors!.map((c) => ({ src: c.image_main, label: c.name }))
        : [];

    return (
        <div className="w-full bg-bg pt-10">
            <section className="px-4 sm:px-6 md:px-10 lg:px-16 py-8 md:py-12 lg:py-16">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16">

                    <motion.div
                        className="w-full lg:w-1/2"
                        initial={{ opacity: 0, x: -36 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: E }}
                    >
                        <div className="relative w-full aspect-4/5 rounded-2xl overflow-hidden bg-beige">
                            <div className="absolute top-4 left-4 z-10">
                                {product.tag === "new" && <ProductCardTag />}
                                {product.tag === "best-seller" && <BestSellerTag />}
                            </div>

                            <Image
                                src={currentImageMain}
                                alt={product.title}
                                fill
                                className="object-cover object-center transition-opacity duration-400"
                                priority
                            />

                            {hasColors && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                    {thumbnails.map((thumb, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveColorIndex(i)}
                                            aria-label={thumb.label}
                                            className={`relative w-11 h-13 sm:w-12 sm:h-14.5 rounded-xl overflow-hidden shrink-0 transition-all duration-200 ${
                                                i === activeColorIndex
                                                    ? "ring-2 ring-black ring-offset-1 scale-105"
                                                    : "ring-1 ring-white/70 hover:ring-white"
                                            }`}
                                        >
                                            <Image
                                                src={thumb.src || PLACEHOLDER}
                                                alt={thumb.label}
                                                fill
                                                className="object-cover object-center"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>

                    <div className="w-full lg:w-1/2 flex flex-col">

                        <motion.div {...entry(0.1)} className="flex items-center gap-2 mb-5">
                            <Link
                                href="/products"
                                className="font-Inter text-[13px] md:text-[14px] text-gray hover:text-black transition-colors duration-200"
                            >
                                Shop
                            </Link>
                            <span className="font-Inter text-[13px] md:text-[14px] text-gray">•</span>
                            <span className="font-Inter text-[13px] md:text-[14px] text-black">
                                {product.category ?? "Men's Wear"}
                            </span>
                        </motion.div>

                        <motion.h2 {...entry(0.18)} className="font-Ronzino-Medium text-black text-[28px] sm:text-[34px] md:text-[40px] lg:text-[44px] tracking-[-0.03em] leading-[1.12em] mb-4">
                            {product.title}
                        </motion.h2>

                        <motion.div {...entry(0.26)} className="flex items-baseline gap-3 mb-5">
                            <span className="font-Ronzino-Medium text-black text-[22px] md:text-[26px] tracking-[-0.03em] leading-[1.4em]">
                                ₹{product.price.toFixed(2)}
                            </span>
                            {product.originalPrice && (
                                <span className="font-Ronzino-Medium text-gray-2 text-[15px] md:text-[16px] tracking-[-0.035em] leading-[1.5em] line-through">
                                    ₹{product.originalPrice.toFixed(2)}
                                </span>
                            )}
                        </motion.div>

                        {product.description && (
                            <motion.p {...entry(0.32)} className="font-Inter text-[13px] md:text-[14px] text-[#6E6E6E] tracking-[-0.02em] leading-[1.65em] mb-6">
                                {product.description}
                            </motion.p>
                        )}

                        {hasColors && (
                            <motion.div {...entry(0.38)} className="mb-5">
                                <p className="font-Inter text-[13px] text-black mb-2.5">
                                    <span className="font-medium">Colour</span>
                                    <span className="text-gray ml-2">
                                        {product.colors![activeColorIndex].name}
                                    </span>
                                </p>
                                <div className="flex items-center gap-2.5">
                                    {product.colors!.map((color, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveColorIndex(i)}
                                            title={color.name}
                                            aria-label={color.name}
                                            className={`w-7 h-7 rounded-full transition-all duration-200 cursor-pointer ${
                                                i === activeColorIndex
                                                    ? "ring-2 ring-black ring-offset-2 scale-110"
                                                    : "ring-1 ring-black/20 hover:ring-black/50"
                                            }`}
                                            style={{ backgroundColor: color.hex }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Size selector */}
                        {product.sizes && product.sizes.length > 0 && (
                            <SizeSelector sizes={product.sizes} />
                        )}

                        <motion.div {...entry(0.46)} className="mb-6">
                            <p className="font-Inter text-[13px] font-medium text-black/50">
                                {product.stock} in stock
                            </p>
                        </motion.div>

                        <motion.button
                            {...entry(0.54)}
                            onClick={() => product.stock !== 0 && setShowContact(true)}
                            className={`btn-anim justify-center w-full bg-black text-white text-center font-Inter text-[15px] md:text-[16px] tracking-[-0.02em] leading-[1.5em] py-4 rounded-full hover:bg-black/85 active:scale-[0.99] transition-all duration-200 mb-7 cursor-pointer ${
                                product.stock === 0 ? "opacity-50 pointer-events-none" : ""
                            }`}
                            disabled={product.stock === 0}
                        >
                            <span className="btn-label">
                                <span className="btn-label-primary">
                                    {product.stock === 0 ? "Sold Out" : "Order Now"}
                                </span>
                                <span className="btn-label-secondary">
                                    {product.stock === 0 ? "Sold Out" : "Order Now"}
                                </span>
                            </span>
                        </motion.button>

                        {showContact && (
                            <ContactSheet
                                productTitle={product.title}
                                onClose={() => setShowContact(false)}
                            />
                        )}

                        {product.details && (
                            <motion.div {...entry(0.62)} className="border-t border-black/10">
                                {/* Material */}
                                <div className="flex items-start gap-3.5 py-4 border-b border-black/10">
                                    <Globe2 className="w-4.5 h-4.5 text-black mt-0.5 shrink-0" strokeWidth={1.5} />
                                    <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:gap-4">
                                        <span className="font-Inter text-[13px] md:text-[14px] text-black font-medium leading-[1.5em] shrink-0">
                                            Material
                                        </span>
                                        <span className="font-Inter text-[13px] md:text-[14px] text-gray leading-[1.5em] sm:text-right">
                                            {product.details.material}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5 py-4">
                                    <Scissors className="w-4.5 h-4.5 text-black mt-0.5 shrink-0" strokeWidth={1.5} />
                                    <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:gap-4">
                                        <span className="font-Inter text-[13px] md:text-[14px] text-black font-medium leading-[1.5em] shrink-0">
                                            Care
                                        </span>
                                        <span className="font-Inter text-[13px] md:text-[14px] text-gray leading-[1.5em] sm:text-right">
                                            {product.details.care}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

            {/* Size Chart */}
            <SizeChart />

            <section className="px-4 sm:px-6 md:px-10 lg:px-16 pb-12 md:pb-16 lg:pb-20">
                <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4" stagger={0.1}>
                    {FEATURES.map((feature) => (
                        <StaggerItem key={feature.title} className="bg-white rounded-2xl p-5 md:p-6">
                            <feature.icon
                                className="w-6 h-6 text-black mb-4"
                                strokeWidth={1.5}
                            />
                            <p className="font-Ronzino-Medium text-black text-[14px] md:text-[15px] tracking-[-0.02em] leading-[1.35em] mb-1.5">
                                {feature.title}
                            </p>
                            <p className="font-Inter text-[12px] md:text-[13px] text-gray tracking-[-0.01em] leading-[1.55em]">
                                {feature.desc}
                            </p>
                        </StaggerItem>
                    ))}
                </Stagger>
            </section>
        </div>
    );
}
