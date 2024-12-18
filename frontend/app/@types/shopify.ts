export interface ShopifyProduct {
    id: number;
    title: string;
    handle: string;
    body_html: string;
    published_at: Date;
    created_at: Date;
    updated_at: Date;
    vendor: string;
    product_type: string;
    tags: string[];
    variants: Variant[];
    images: Image[];
    options: Option[];
}

interface Image {
    id: number;
    created_at: Date;
    position: number;
    updated_at: Date;
    product_id: number;
    variant_ids: number[];
    src: string;
    width: number;
    height: number;
    alt?: null;
}

interface Option {
    name: string;
    position: number;
    values: string[];
}

interface Variant {
    id: number;
    title: string;
    option1: string;
    option2: null;
    option3: null;
    sku: string;
    requires_shipping: boolean;
    taxable: boolean;
    featured_image: Image | null;
    available: boolean;
    price: string;
    grams: number;
    compare_at_price: null | string;
    position: number;
    product_id: number;
    created_at: Date;
    updated_at: Date;
}