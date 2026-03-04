import Image from "next/image";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E";

interface ProductImageSwitchProps {
    image: string;
    isActive?: boolean;
}


export default function ProductImageSwitch({ image, isActive = false }: ProductImageSwitchProps) {
    const src = image || PLACEHOLDER;
    return (
        <div className={`w-[36px] h-[36px] bg-transparent border rounded-full flex justify-center items-center transition-colors duration-300 ${isActive ? "border-black-80" : "border-black-15"}`}>
            <div className="w-[30px] h-[30px] overflow-clip rounded-full z-10 object-contain object-center">
                <Image src={src} alt="Product Image" width={30} height={30} unoptimized={src === PLACEHOLDER} />
            </div>
        </div>
    );
}