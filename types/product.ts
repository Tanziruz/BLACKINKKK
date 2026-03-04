export type ProductTag = "best-seller" | "new" | null;

export interface ProductColor {
    name: string;
    hex: string;
    image_main: string;
}

export interface ProductDetails {
    material: string;
    care: string;
}

export interface Product {
    id: string;
    title: string;
    price: number;
    originalPrice: number;
    image_main: string;
    image_hover: string;
    tag?: ProductTag;
    includeHome?: boolean;
    stock: number;
    category?: string;
    description?: string;
    details?: ProductDetails;
    colors: ProductColor[];
    sizes?: string[];
}
