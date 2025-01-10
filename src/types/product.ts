export interface Price {
    id: string;
    amount: number | null;
    currency: string;
    type: 'one_time' | 'recurring';
    recurring?: {
        interval: 'day' | 'week' | 'month' | 'year';
        interval_count: number;
    } | null;
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