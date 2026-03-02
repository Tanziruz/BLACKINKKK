import { Info } from "lucide-react";
import SectionTag from "../Buttons_And_Links/SectionTag";
import { FadeUp } from "../Animate";


export default function OurStory() {
    return (
        <section className="px-6 sm:px-10 lg:px-16 py-12 sm:py-16 lg:py-20 flex flex-col items-center gap-6 -mt-5">

           <FadeUp distance={16}>
               <SectionTag icon={Info} title="About BLACKINKKK" />
           </FadeUp>
           <FadeUp delay={0.08}>
               <h5 className="text-[32px]! md:text-[32px]! lg:text-[32px]! mb-0! text-center">
                   Our Story
               </h5>
           </FadeUp>

           <FadeUp delay={0.16} distance={20}>
               <p className="t24 mb-0! text-left sm:text-justify! max-w-5xl">
                   <strong>BLACKINKKK</strong> was born from the vibrant street art scene, where self-expression and individuality reign supreme. A group of young, passionate artists, not satisfied by the limitations of traditional art forms, sought to create a clothing brand that was both stylish and environmentally responsible and hence decided to use clothing as their canvas. They saw T-shirts as a blank slate, a way to share their unique voices and perspectives with the world. BLACKINKKK became their platform, a way to challenge norms and inspire others to embrace their own creativity. BLACKINKKK is more than just a clothing brand; it&apos;s a movement towards a more sustainable future. We source organic materials, partner with fair-trade factories, and minimize their carbon footprint. BLACKINKKK is also a reflection of its founder&apos;s personal journey. The brand was also born from the founder&apos;s own passion for self-expression and their desire to connect with others who shared that passion. Each design tells a piece of their story, from overcoming challenges to celebrating personal victories. BLACKINKKK is a way for the founder to share their experiences and inspire others to embrace their own unique paths. It brings unique designs, high-quality materials, ethical production for every generation.
               </p>
           </FadeUp>

        </section>
    );
}
