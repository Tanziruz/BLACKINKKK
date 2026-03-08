import Image from "next/image";
import { UserRound } from "lucide-react";
import SectionTag from "../Buttons_And_Links/SectionTag";
import { FadeUp } from "../Animate";

type Bullet = { label: string; text: string };
type Section = { heading: string; body: string; bullets?: Bullet[] };

const members: {
    name: string;
    role: string;
    tagline: string;
    portrait: string;
    intro: string;
    sections: Section[];
    quote: string;
    quoteAuthor: string;
    imageLeft: boolean;
}[] = [
    {
        name: "Sonal Arora",
        role: "Founder",
        tagline: "Where Creativity Meets Culture",
        portrait: "/Sonal.png",
        intro: "Founded by Sonal Arora, BLACKINKKK is more than just a clothing brand—it is a canvas for self-expression. We believe that what you wear should be a reflection of who you are, which is why we specialize in merging creativity, comfort, and culture into bold, wearable art.",
        sections: [
            {
                heading: "Our Vision",
                body: "At the heart of BLACKINKKK is a commitment to the modern individual. Whether it's through our curated mass-produced collections or our bespoke customized T-shirts, every garment is a statement of identity.",
            },
            {
                heading: "The Craft Behind the Brand",
                body: "Our founder, Sonal Arora, personally shapes every design. With a sharp eye for fashion psychology, pop culture, and evolving streetwear trends, Sonal ensures that every piece is:",
                bullets: [
                    { label: "Unique & Trendy:", text: "Designs that stay ahead of the curve." },
                    { label: "Premium Quality:", text: "Crafted with high-quality fabrics and precision printing techniques." },
                    { label: "Customer-Centric:", text: "Built on a foundation of style and direct feedback from our community." },
                ],
            },
            {
                heading: "Digital-First Identity",
                body: "As a digital-savvy brand, we use storytelling and striking visuals to build a strong, edgy community. We don't just sell T-shirts; we build engagement through social media and shared experiences, strengthening the modern, bold identity that defines the BLACKINKKK lifestyle.",
            },
        ],
        quote: "\"I am committed to growing this brand with discipline and creativity, ensuring that every design resonates with the energy of the streets and the soul of the wearer.\"",
        quoteAuthor: "Sonal Arora, Founder",
        imageLeft: false,
    },
    {
        name: "Bony I",
        role: "Lead Business Consultant",
        tagline: "The Visionary Behind the Ink",
        portrait: "/Bony.png",
        intro: "Behind every great brand is a strategic blueprint. For BLACKINKKK, that blueprint was drafted and brought to life by Bony I, our lead Business Consultant. In the fast-paced world of Indian streetwear, a \"vibe\" isn't enough—it requires a marriage of street culture and business rigour. Bony has been the architect of that union, overseeing the vital frameworks that keep us moving forward.",
        sections: [
            {
                heading: "Driving the Evolution",
                body: "From the first idea to the final sale, Bony's expertise spans the entire lifecycle of our brand:",
                bullets: [
                    { label: "Strategic GTM Execution:", text: "Orchestrating our entry into the competitive Indian retail space with precision." },
                    { label: "Product Development:", text: "Ensuring every garment meets the high standards of quality and \"street-vibe\" aesthetics our community demands." },
                    { label: "Marketing & Sales Innovation:", text: "Designing growth strategies that bridge the gap between our creative vision and our customers' wardrobes." },
                ],
            },
            {
                heading: "Our Mission",
                body: "Under Bony's strategic guidance, we invite our audience to do more than just wear a T-shirt; we want you to \"Ink your style.\"",
            },
        ],
        quote: "\"Turning a vision into a reality requires more than just passion—it requires a strategy that respects the art and understands the market. At BLACKINKKK, we are building a legacy of self-expression.\"",
        quoteAuthor: "Bony I",
        imageLeft: true,
    },
];

export default function TeamSection() {
    return (
        <section className="px-6 sm:px-10 lg:px-16 py-12 sm:py-16 lg:py-12 flex flex-col items-center gap-16 lg:gap-28">
            {/* Section header */}
            <div className="flex flex-col items-center gap-4 text-center">
                <FadeUp distance={16}>
                    <SectionTag icon={UserRound} title="Meet the Team" />
                </FadeUp>
                <FadeUp delay={0.08}>
                    <h2 className="text-[36px]! md:text-[44px]! mb-0! max-w-2xl">
                        The minds behind BLACKINKKK
                    </h2>
                </FadeUp>
                <FadeUp delay={0.16} distance={18}>
                    <p className="t18 mb-0! max-w-xl text-black/60 text-center">
                        BLACKINKKK is built by passionate individuals who live and breathe streetwear culture.
                    </p>
                </FadeUp>
            </div>

            {/* Member rows */}
            {members.map((member) => (
                <div
                    key={member.name}
                    className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start"
                >
                    {/* Portrait */}
                    <FadeUp
                        distance={28}
                        delay={0.05}
                        className={`w-full ${member.imageLeft ? "lg:order-first" : "lg:order-last"}`}
                    >
                        <div className="relative w-full max-w-sm mx-auto aspect-3/4 rounded-2xl overflow-hidden bg-[#f0ede8]">
                            <Image
                                src={member.portrait}
                                alt={`Portrait of ${member.name}`}
                                fill
                                className="object-cover object-top"
                            />
                        </div>
                    </FadeUp>

                    {/* Content */}
                    <div className={`flex flex-col gap-5 ${member.imageLeft ? "lg:order-last" : "lg:order-first"}`}>
                        <FadeUp distance={20} delay={0.08}>
                            <div className="flex flex-col gap-1 mb-1">
                                <p className="font-Inter text-[11px] tracking-[0.2em] uppercase text-black/40 mb-0!">
                                    {member.role}
                                </p>
                                <h3 className="text-[34px]! md:text-[40px]! mb-0! leading-[1.08em]!">
                                    {member.name}
                                </h3>
                                <p className="font-Ronzino-Medium text-[17px] text-black/60 mb-0! mt-1.5 italic">
                                    {member.tagline}
                                </p>
                            </div>
                        </FadeUp>

                        <FadeUp distance={18} delay={0.12}>
                            <p className="t18 mb-0! text-black/70 text-left sm:text-justify!">{member.intro}</p>
                        </FadeUp>

                        {member.sections.map((section, si) => (
                            <FadeUp key={section.heading} distance={16} delay={0.14 + si * 0.06}>
                                <div className="flex flex-col gap-2.5">
                                    <h5 className="text-[20px]! mb-0! leading-[1.2em]!">{section.heading}</h5>
                                    <p className="t18 mb-0! text-black/70">{section.body}</p>
                                    {section.bullets && (
                                        <ul className="flex flex-col gap-2 mt-0.5 pl-0.5">
                                            {section.bullets.map((b) => (
                                                <li
                                                    key={b.label}
                                                    className="font-Inter text-[16px] text-black/70 leading-[1.55em] flex items-start gap-3"
                                                >
                                                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-black/35 translate-y-1.75" />
                                                    <span>
                                                        <strong>{b.label}</strong> {b.text}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </FadeUp>
                        ))}

                        <FadeUp distance={14} delay={0.3}>
                            <blockquote className="mt-2 border-l-2 border-black/15 pl-5">
                                <p className="font-Ronzino-Medium text-[17px] text-black/75 mb-2! italic leading-[1.65em]">
                                    {member.quote}
                                </p>
                                <p className="font-Inter text-[12px] tracking-[0.12em] uppercase text-black/45 mb-0!">
                                    — {member.quoteAuthor}
                                </p>
                            </blockquote>
                        </FadeUp>
                    </div>
                </div>
            ))}

            {/* Divider between members */}
        </section>
    );
}
