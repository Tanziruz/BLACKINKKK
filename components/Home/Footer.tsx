import { Mail, Phone, MapPin } from "lucide-react";
import Button from "../Buttons_And_Links/Button";
import FooterLink from "../Buttons_And_Links/FooterLink";
import { FadeUp, Stagger, StaggerItem } from "../Animate";

function ColHeading({ children }: { children: React.ReactNode }) {
    return (
        <p className="font-Inter text-white text-[16px] tracking-[-0.01em] leading-[1.55em] mb-3 font-medium">
            {children}
        </p>
    );
}

export default function Footer() {
    return (
        <footer className="bg-black w-full overflow-hidden">

            <div className="border-t border-white-15 mx-6 sm:mx-10 lg:mx-16" />

            <div className="px-6 sm:px-10 lg:px-16 pt-10 lg:pt-14 pb-6">
                <Stagger className="flex flex-col sm:flex-row gap-10 lg:gap-6" stagger={0.1}>

                    <StaggerItem className="flex flex-col gap-2 sm:w-[42%] lg:w-auto lg:flex-[1.6]">
                        <span className="font-Radiant  text-white text-xl tracking-[0.12em] uppercase">
                            BLACKINKKK
                        </span>
                        <p className="t16 text-white-60 mb-0! max-w-67.5">
                            Redefining streetwear with premium oversized t-shirts. Comfort meets style in every piece.
                        </p>
                        <div className="mt-2">
                            <Button variant="btn1" title="Contact Us" href="/contact" />
                        </div>
                    </StaggerItem>

                    <StaggerItem className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-4">

                        <div className="flex flex-col items-start">
                            <ColHeading>Quick Links</ColHeading>
                            <FooterLink title="Home" href="/" />
                            <FooterLink title="About" href="/about" />
                            <FooterLink title="Shop" href="/shop" />
                            <FooterLink title="Reviews" href="/reviews" />
                        </div>

                        <div className="flex flex-col items-start">
                            <ColHeading>Follow us:</ColHeading>
                            <FooterLink title="Instagram" href="https://instagram.com/Blackinkkk_fashion" />
                            <FooterLink title="Facebook" href="https://facebook.com/blackinkkk" />
                            <FooterLink title="Reddit" href="https://reddit.com/user/blackinkkk_fashion" />
                        </div>

                        <div className="col-span-2 lg:col-span-1 flex flex-col gap-3 [&_p]:mb-0!">
                            <ColHeading>Get in touch</ColHeading>

                            <div className="flex items-center gap-3">
                                <Mail size={16} className="text-white-60 shrink-0" />
                                <p className="t16 text-white-60 text-left!">Blackinkkk@aol.com</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Phone size={16} className="text-white-60 shrink-0" />
                                <span className="whitespace-nowrap">
                                    <p className="t16 text-white-60 text-left!">+91 98103 67883</p>
                                </span>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin size={16} className="text-white-60 shrink-0 mt-0.75" />
                                <p className="t16 text-white-60 text-left!">
                                    Ghaziabad,<br />
                                    Uttar Pradesh<br />
                                    201001
                                </p>
                            </div>
                        </div>

                    </StaggerItem>
                </Stagger>
            </div>

            <FadeUp distance={16} className="mt-4">
                <p className="font-Fino text-white uppercase select-none leading-[0.84em] tracking-[-0.02em] text-[18.5vw] px-5 mb-0!">
                    BLA<span className="radiant text-[16.5vw]">C</span>KINKKK
                </p>
            </FadeUp>

        </footer>
    );
}
