import StayConnected from "@/components/Home/StayConnected";
import TopPage from "@/components/TopPage";
import OurStory from "@/components/about/OurStory";
import TeamSection from "@/components/about/TeamSection";

export default function About() {
    return (
        <section className="max-w-screen w-screen overflow-hidden">
            <div className="h-dvh">
                <TopPage 
                    imageSrc="/About.png"
                    imageAlt="About Us Image"
                    tagTitle="Know About Us"
                    title="Timeless design, modern wearability"
                    description="We focus on creating essential garments that remain relevant, functional, and refined across seasons."
                    button1Text="Our Story"
                    button1Link="/products"
                    button2Text="Our Team"
                    button2Link="/team"
                />
            </div>
            <OurStory />
            <StayConnected />
        </section>
    );
}