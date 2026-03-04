import TopPage from "@/components/TopPage";
import AllProductsGrid from "@/components/AllProductsGrid";
import CatalogHeading from "@/components/CatalogHeading";

// Always fetch fresh product data from the database
export const dynamic = "force-dynamic";
import { LayoutGrid } from "lucide-react";
import StayConnected from "@/components/Home/StayConnected";

export default function Products() {
    return (
        <section className="max-w-screen w-screen overflow-hidden">
            <div className="h-dvh">
                <TopPage 
                    imageSrc="/Products.png"
                    imageAlt="Products Image"
                    tagTitle="The New Season"
                    title="Elevate your daily wardrobe with ease"
                    description="Explore our handpicked modern silhouettes crafted from the world's most sustainable fabrics."
                    button1Text="Contact Us"
                    button1Link="/contact"
                    button2Text="About Us"
                    button2Link="/about"
                />
            </div>

            <section className="px-4 sm:px-6 md:px-10 lg:px-16 py-8 sm:py-10 md:py-12 lg:py-16 flex flex-col gap-3 md:gap-4 lg:gap-5 w-full -mt-5">
                <CatalogHeading
                    Tagtitle="All Products"
                    TagIcon={LayoutGrid}
                    buttonTitle="Contact Us"
                    HeadingTitle1="Every piece,"
                    HeadingTitle2="every style"
                    hrefButton="/contact"
                    hrefTag="/products"
                />
                <AllProductsGrid />
                <div className="mt-5">
                    <StayConnected />
                </div>
            </section>
        </section>
    );
}

