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
    defaultPrice: Price | null;
    monthlyPrice: Price | null;
    yearlyPrice: Price | null;
    oneTimePrice: Price | null;
    metadata?: {
        features?: string;
        addonId?: string;
        type?: string;
    };
}

export interface CartItem {
    productId: string;
    priceId: string;
    isYearly?: boolean;
}

export interface UserProducts {
    mainPlan?: {
        productId: string;
        status: string;
        currentPeriodEnd?: string;
    };
    addons: Array<{
        productId: string;
        status: string;
        currentPeriodEnd?: string;
    }>;
} 