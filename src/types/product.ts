export interface Price {
    id: string;
    amount: number;
    currency: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    features: string[];
    isAddon: boolean;
    isSubscription: boolean;
    monthlyPrice: Price | null;
    yearlyPrice: Price | null;
    oneTimePrice: Price | null;
    defaultPrice: Price | null;
    metadata: {
        features?: string;
        addonId?: string;
        type?: string;
    };
    isOwned?: boolean;
}

export interface CartItem {
    productId: string;
    priceId: string;
    isYearly?: boolean;
}

export interface UserProduct {
    productId: string;
    priceId: string;
    status: string;
    isYearly?: boolean;
    currentPeriodEnd?: Date;
    purchaseDate?: Date;
}

export interface UserProducts {
    userId: string;
    products: UserProduct[];
} 