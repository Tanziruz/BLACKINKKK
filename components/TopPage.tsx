import Image from "next/image";
import Button from "./Buttons_And_Links/Button";
import { EntryStagger, EntryItem } from "./Animate";

interface TopPageProps {
    imageSrc: string;
    imageAlt: string;
    tagTitle: string;
    title: string;
    description: string;
    button1Text: string;
    button1Link: string;
    button2Text: string;
    button2Link: string;
}

export default function TopPage({ imageSrc, imageAlt, tagTitle, title, description, button1Text, button1Link, button2Text, button2Link }: TopPageProps) {

  return (
    <section className="relative h-[90vh] w-full overflow-hidden flex flex-col justify-center items-center pb-32 pt-30">
      <div className="absolute inset-0 -z-10 ">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className="object-cover object-center transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-x-0 bottom-0 h-2/5 backdrop-blur-3xl mask-[linear-gradient(to_bottom,transparent,black)]" />
      </div>

      <EntryStagger className="flex flex-col items-center gap-3 w-full max-w-155 px-5 text-center" delayChildren={0.25} stagger={0.12}>
        <EntryItem>
          <div className="w-fit bg-white-15 backdrop-blur-sm rounded-full px-3.5 py-1.5">
            <p className="font-Ronzino-Medium text-white text-[12px] lg:text-[13px] tracking-[-0.025em] leading-[1.4em] mb-0!">
              {tagTitle}
            </p>
          </div>
        </EntryItem>

        <EntryItem distance={30}>
          <h1 className="text-center text-5xl lg:text-6xl">{title}</h1>
        </EntryItem>

        <EntryItem>
          <p className="t18 text-white-80! text-center leading-[1.5em] mb-3">
            {description}
          </p>
        </EntryItem>

        <EntryItem>
          <div className="flex items-center justify-center gap-2.5 pt-1">
            <Button variant="btn1" title={button1Text} href={button1Link} />
             <Button variant="btn3" title={button2Text} href={button2Link} />
          </div>
        </EntryItem>
      </EntryStagger>
    </section>
  );
}
