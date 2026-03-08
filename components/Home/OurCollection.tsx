import Image from "next/image";
import { Wallet, Shirt } from "lucide-react";
import Button from "../Buttons_And_Links/Button";
import CatalogHeading from "../CatalogHeading";
import { SlideInLeft, SlideInRight, FadeUp } from "../Animate";

export default function OurCollection() {
    return (
        <section className="px-4 sm:px-6 md:px-10 lg:px-16 py-8 sm:py-10 md:py-12 lg:py-16 flex flex-col gap-3 md:gap-4 lg:gap-5 w-full overflow-hidden ">
            <CatalogHeading
                Tagtitle="Our Collection"
                TagIcon={Shirt}
                buttonTitle="Shop All Items"
                HeadingTitle1="Modern Collections"
                HeadingTitle2="Defined by Street Fashion"
                hrefButton="/products"
                hrefTag="/products"
            />
            <div className="flex flex-col min-[950px]:flex-row gap-4 mt-2">
                <SlideInLeft className="relative w-full min-[950px]:w-1/2 aspect-480/460 rounded-3xl overflow-hidden">
                    <Image
                        src="/Our_Collection.jpeg"
                        alt="Men's Collection"
                        fill
                        className="object-cover object-center"
                    />
                </SlideInLeft>

                <SlideInRight delay={0.08} className="bg-beige flex flex-col justify-center gap-3 p-8 min-[950px]:p-10 lg:p-12 w-full min-[950px]:w-1/2 rounded-3xl">
                    <FadeUp delay={0.18}>
                        <span className="w-fit text-[13px] font-Inter text-black tracking-[-0.02em] bg-white rounded-full px-3.5 py-1 ">
                            Unisex Wear
                        </span>
                    </FadeUp>

                    <FadeUp delay={0.26}>
                        <h3 className="mb-0!">Premium modern collection for everyone</h3>
                    </FadeUp>

                    <FadeUp delay={0.34}>
                        <p className="t16 mb-0!">
                            Upgrade your daily look with our crafted pieces made from the finest fabrics for lasting comfort and timeless style.
                        </p>
                    </FadeUp>

                    <FadeUp delay={0.42}>
                        <div className="bg-white rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 mt-2">
                            <div className="flex items-center gap-3">
                                <div className="bg-black rounded-full p-2.5 shrink-0">
                                    <Wallet size={18} className="text-white" />
                                </div>
                                <div>
                                    <p className="t14 text-[14px]! mb-0.5!">Pricing start from:</p>
                                    <div className="flex items-center gap-2">
                                        <p className="t16 mb-0! text-black! font-[520]">₹599</p>
                                        <span className="text-black/40 text-sm">—</span>
                                        <p className="t16 mb-0! text-black! font-[520]">₹999</p>
                                    </div>
                                </div>
                            </div>
                            <Button variant="btn2" title="All collections" className="w-full sm:w-auto justify-center" href="/products" />
                        </div>
                    </FadeUp>
                </SlideInRight>
            </div>
        </section>
    );
}