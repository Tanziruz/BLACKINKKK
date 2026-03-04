"use client";
import Image from "next/image";
import Link from "next/link";
import ProductImageSwitch from "../Buttons_And_Links/ProductImageSwitch";
import { useState } from "react";
import ProductPageArrow from "../Buttons_And_Links/ProductPageArrow";

// Transparent 1×1 grey placeholder used when a product has no image yet
const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E";


interface ProductCardProps {
    id: string;
    image_main: string;
    image_hover: string;
    tag?: React.ReactNode;
    title: string;
    price: number;
    originalPrice?: number;
    stock?: number;
}

export default function ProductCard({ id, image_main, image_hover, tag, title, price, originalPrice, stock }: ProductCardProps) {
    const [hovered, setHovered] = useState(false);
    const soldOut = stock === 0;
    const mainSrc  = image_main  || PLACEHOLDER;
    const hoverSrc = image_hover || image_main || PLACEHOLDER;

    return (
        <Link href={`/products/${id}`} className="block w-full h-fit">
        <div
            className="group w-full h-fit hover:cursor-pointer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div id="product-image" className="relative w-full aspect-373/420 rounded-2xl overflow-hidden px-2 pt-2">
                {/* Tag */}
                <div className="relative top-1 left-1 z-10">
                    {soldOut ? (
                        <span className="font-Inter text-[11px] font-medium tracking-widest uppercase bg-black/70 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                            Sold Out
                        </span>
                    ) : tag}
                </div>

                <div className="absolute right-3.5 top-3.5 z-10">
                    <ProductPageArrow />
                </div>

                <Image
                    src={mainSrc}
                    alt="Product_Image"
                    fill
                    className="object-cover object-center transition-opacity duration-500 opacity-100 group-hover:opacity-0"
                />
                <Image
                    src={hoverSrc}
                    alt="Product_Image_Hover"
                    fill
                    className="object-cover object-center transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                />

                {/* Sold-out diagonal cross */}
                {soldOut && (
                    <svg
                        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
                        preserveAspectRatio="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(0,0,0,0.28)" strokeWidth="1.5" />
                        <line x1="100%" y1="0" x2="0" y2="100%" stroke="rgba(0,0,0,0.28)" strokeWidth="1.5" />
                    </svg>
                )}
            </div>

            <div className="px-1">
                <p className={`t16 mt-3 mb-0 font-[520] ${soldOut ? "line-through text-black/50" : "text-black"}`}>
                    {title}
                </p>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <p className={`font-Ronzino-Medium text-[22px] tracking-[-0.03em] leading-[1.5em] mb-0 ${
                            soldOut ? "text-black/30 line-through" : "text-black"
                        }`}>${price}</p>
                        {originalPrice && !soldOut && (
                            <p className="font-Ronzino-Medium text-gray-2 text-[15px] tracking-[-0.035em] leading-[1.5em] line-through">${originalPrice}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-2 relative bottom-4">
                        <ProductImageSwitch image={mainSrc} isActive={!hovered}/>
                        <ProductImageSwitch image={hoverSrc} isActive={hovered}/>
                    </div>
                </div>
            </div>
        </div>
        </Link>
    );
}