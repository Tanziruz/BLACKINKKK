import StayConnected from "@/components/Home/StayConnected";
import TopPage from "@/components/TopPage";
import TeamSection from "@/components/about/TeamSection";

export default function Team() {
    return (
        <section className="max-w-screen w-screen overflow-hidden">
            <div className="h-dvh">
                <TopPage
                    imageSrc="/Team.png"
                    imageAlt="Team Image"
                    tagTitle="Meet the Team"
                    title="Meet the minds behind BLACKINKKK"
                    description="The creative visionaries and strategic thinkers who turn Blackinkkk into a unique identity every single day."
                    button1Text="Our Story"
                    button1Link="/about"
                    button2Text="Contact Us"
                    button2Link="/contact"
                />
            </div>
            <TeamSection />
            <StayConnected />
        </section>
    );
}
