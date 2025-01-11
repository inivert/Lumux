"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Product, Price } from '@/types/product';
import axios from 'axios';
import { Loader2, Check, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const PricingCard = ({ 
    product,
    showYearly,
    variant = 'default'
}: { 
    product: Product;
    showYearly: boolean;
    variant?: 'default' | 'featured' | 'addon';
}) => {
    const getActivePrice = (product: Product): Price | null => {
        if (!product.isSubscription) {
            return product.oneTimePrice || product.defaultPrice;
        }
        return showYearly ? (product.yearlyPrice || product.monthlyPrice) : (product.monthlyPrice || product.yearlyPrice);
    };

    const formatPrice = (price: Price | null) => {
        if (!price?.amount) return 'Contact us';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: price.currency.toUpperCase(),
            minimumFractionDigits: 0,
        }).format(price.amount);
    };

    const price = getActivePrice(product);

    return (
        <div className={`
            relative rounded-2xl p-8
            ${variant === 'featured' 
                ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                : variant === 'addon'
                    ? 'bg-white dark:bg-gray-800 border-2 border-dashed border-primary/20'
                    : 'bg-white dark:bg-gray-800 shadow-lg'
            }
        `}>
            {variant === 'featured' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-white text-primary px-4 py-1 rounded-full text-sm font-medium shadow-sm">
                        Most Popular
                    </div>
                </div>
            )}
            
            <div className="flex flex-col h-full">
                <div>
                    <h3 className={`text-xl font-bold ${variant === 'featured' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        {product.name}
                    </h3>
                    <p className={`mt-2 text-sm ${variant === 'featured' ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                        {product.description}
                    </p>
                </div>

                <div className="mt-6">
                    <div className="flex items-baseline">
                        <span className={`text-4xl font-bold ${variant === 'featured' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                            {formatPrice(price)}
                        </span>
                        {product.isSubscription && (
                            <span className={`ml-2 text-base ${variant === 'featured' ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                                /{showYearly ? 'year' : 'month'}
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-8 space-y-4">
                    {product.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <div className={`flex-shrink-0 w-5 h-5 rounded-full ${
                                variant === 'featured' 
                                    ? 'bg-white/20' 
                                    : 'bg-primary/10'
                            } flex items-center justify-center mt-0.5`}>
                                <Check className={`w-3 h-3 ${
                                    variant === 'featured' 
                                        ? 'text-white' 
                                        : 'text-primary'
                                }`} />
                            </div>
                            <span className={`text-sm ${
                                variant === 'featured' 
                                    ? 'text-white/90' 
                                    : 'text-gray-600 dark:text-gray-400'
                            }`}>
                                {feature}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const LandingPricing = () => {
    const { status } = useSession();
    const [billingType, setBillingType] = useState<'monthly' | 'yearly'>('monthly');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/stripe/prices');
            setProducts(response.data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // Filter main subscription products
    const mainProducts = (products || []).filter(p => {
        const isBuyWebsite = p.name?.toLowerCase().includes('buy a website');
        return !p.isAddon && p.isSubscription && !isBuyWebsite;
    });

    // Filter add-ons
    const addons = (products || []).filter(p => {
        const isBuyWebsite = p.name?.toLowerCase().includes('buy a website');
        return p.isAddon && !isBuyWebsite;
    });

    // Filter one-time products
    const oneTimeProducts = (products || []).filter(p => {
        const isBuyWebsite = p.name?.toLowerCase().includes('buy a website');
        return !p.isSubscription && !p.isAddon;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Choose the perfect plan for your needs. All plans include our core features.
                    </p>
                </div>

                {!status && (
                    <div className="mt-8 flex justify-center">
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/5 rounded-xl text-sm text-gray-600 dark:text-gray-400 border border-primary/10">
                            <Lock className="w-4 h-4 text-primary" />
                            <span>Please <Link href="/auth/signin" className="text-primary hover:text-primary/90 font-medium">sign in</Link> to make a purchase</span>
                        </div>
                    </div>
                )}

                {/* One-time Products */}
                {oneTimeProducts.length > 0 && (
                    <div className="mt-16">
                        <div className="text-center mb-12">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                One-time Purchase
                            </h3>
                            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Get started with a single payment. Includes one add-on of your choice.
                            </p>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-3">
                            {oneTimeProducts.map((product, index) => (
                                <PricingCard
                                    key={product.id}
                                    product={product}
                                    showYearly={false}
                                    variant={index === 1 ? 'featured' : 'default'}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Core Plan */}
                <div className="mt-32">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Core Subscription Plan
                        </h3>
                        <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Get the most out of our platform with our flexible subscription plan
                        </p>
                    </div>

                    {/* Billing Toggle */}
                    <div className="mt-12 flex justify-center">
                        <div className="relative bg-white dark:bg-gray-800 p-0.5 rounded-full flex self-center shadow-sm">
                            <button
                                onClick={() => setBillingType('monthly')}
                                className={`relative py-2 px-6 text-sm font-medium rounded-full whitespace-nowrap focus:outline-none focus:z-10 transition-colors duration-200 ${
                                    billingType === 'monthly'
                                        ? 'bg-primary text-white'
                                        : 'text-gray-700 dark:text-gray-300'
                                }`}
                            >
                                Monthly billing
                            </button>
                            <button
                                onClick={() => setBillingType('yearly')}
                                className={`relative py-2 px-6 text-sm font-medium rounded-full whitespace-nowrap focus:outline-none focus:z-10 transition-colors duration-200 ${
                                    billingType === 'yearly'
                                        ? 'bg-primary text-white'
                                        : 'text-gray-700 dark:text-gray-300'
                                }`}
                            >
                                Yearly billing
                                <span className="ml-1 text-xs text-emerald-400 font-normal">
                                    Save 20%
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-12">
                        <div className="max-w-3xl mx-auto">
                            {mainProducts.map((product, index) => (
                                <PricingCard
                                    key={product.id}
                                    product={product}
                                    showYearly={billingType === 'yearly'}
                                    variant="featured"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Add-ons */}
                {addons.length > 0 && (
                    <div className="mt-16">
                        <div className="text-center mb-12">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Optional Add-ons
                            </h3>
                            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Enhance your core plan with these powerful add-ons
                            </p>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-3">
                            {addons.map((product) => (
                                <PricingCard
                                    key={product.id}
                                    product={product}
                                    showYearly={billingType === 'yearly'}
                                    variant="addon"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* FAQ Link */}
                <div className="mt-16 text-center">
                    <Link
                        href="/#faq"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/90"
                    >
                        Have questions? Check our FAQ
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPricing; 