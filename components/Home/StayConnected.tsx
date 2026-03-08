import Button from "../Buttons_And_Links/Button";
import ConcaveCarousel from "../ConcaveCarousel";
import { Stagger, StaggerItem, FadeUp } from "../Animate";

export default function StayConnected() {

    return (
        <section className="py-12 sm:py-16 lg:py-20 flex flex-col gap-5 w-full overflow-hidden">
            <Stagger className="flex flex-col items-center gap-5 w-full" stagger={0.1} delay={0}>
                <StaggerItem>
                    <div className="flex items-center gap-2 bg-black text-white rounded-full px-4 py-1.5 text-[13px] font-Inter tracking-[-0.02em] select-none">
                        Stay connected
                    </div>
                </StaggerItem>

                <StaggerItem>
                    <h2 className="text-[40px]! sm:text-[48px]! mb-0! text-center px-4">
                        See our fashion and designs 
<br />in modern street wear vibes
                    </h2>
                </StaggerItem>

                <StaggerItem>
                    <p className="t16 mb-0! text-center max-w-105 px-6">
Connect with us on social media for a daily dose of fresh styles, featuring exclusive looks from our designers and fashion gurus.
                    </p>
                </StaggerItem>

                <StaggerItem>
                    <div className="flex items-center gap-3 flex-wrap justify-center">
                        <Button variant="btn2" title="See collections" href="/products" />
                        <Button variant="btn1" title="Contact us" href="/contact" />
                    </div>
                </StaggerItem>
            </Stagger>

            <FadeUp distance={20} delay={0.1} className="mt-15">
                <ConcaveCarousel />
            </FadeUp>
        </section>
    );
}
