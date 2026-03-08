import StayConnected from "@/components/Home/StayConnected";
import TopPage from "@/components/TopPage";
import ContactForm from "@/components/contact/ContactForm";

export default function About() {
    return (
        <section className="max-w-screen w-screen overflow-hidden">
            <div className="h-dvh">
                <TopPage 
                    imageSrc="/Contact.avif"
                    imageAlt="About Us Image"
                    tagTitle="Here to help you"
                    title="Helping you define your personal style"
                    description="Contact us today for refined service from our creative design team."
                    button1Text="Browse Collections"
                    button1Link="/products"
                    button2Text="About Us"
                    button2Link="/about"
                />
            </div>
            <ContactForm />
            <StayConnected />
        </section>
    );
}