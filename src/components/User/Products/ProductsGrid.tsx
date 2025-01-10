"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { CartItem, Product, Price } from '@/types/product';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ChevronDown, ChevronUp, ShoppingCart, Check } from 'lucide-react';

const ProductCard = ({ 
    product, 
    showYearly, 
    isInCart,
    onAddToCart 
}: { 
    product: Product; 
    showYearly: boolean;
    isInCart: boolean;
    onAddToCart: (product: Product) => void;
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

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
        }).format(price.amount / 100);
    };

    const price = getActivePrice(product);

    return (
        <motion.div
            layout
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
        >
            <div 
                className="p-4 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                {product.name}
                            </h3>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {formatPrice(price)}
                                {product.isSubscription && (
                                    <span className="ml-1">/{showYearly ? 'year' : 'month'}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart(product);
                            }}
                            className={`p-2 rounded-lg transition-colors ${
                                isInCart
                                    ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                            }`}
                        >
                            {isInCart ? <Check size={20} /> : <ShoppingCart size={20} />}
                        </button>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 border-t dark:border-gray-700 mt-2 pt-4">
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                {product.description}
                            </p>
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                    Features:
                                </h4>
                                <ul className="space-y-2">
                                    {product.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm">
                                            <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const ProductsGrid = () => {
    const { data: session } = useSession();
    const [billingType, setBillingType] = useState<'monthly' | 'yearly' | 'onetime'>('monthly');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/stripe/prices');
            console.log('Products response:', response.data);
            setProducts(response.data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    // Filter products based on billing type
    const visibleProducts = products.filter(p => {
        const isBuyWebsite = p.name.toLowerCase().includes('buy a website');
        
        if (billingType === 'onetime') {
            // Only show "Buy a Website" product in one-time view
            return isBuyWebsite;
        }
        // In monthly/yearly views, show subscription products except "Buy a Website"
        return !p.isAddon && p.isSubscription && !isBuyWebsite;
    });

    // Separate addons, excluding "Buy a Website" product
    const addons = products.filter(p => {
        const isBuyWebsite = p.name.toLowerCase().includes('buy a website');
        return p.isAddon && !isBuyWebsite;
    });

    // Only show addons section in subscription views
    const showAddons = billingType !== 'onetime' && addons.length > 0;

    const handleAddToCart = (product: Product) => {
        if (isInCart(product.id)) {
            setCart(cart.filter(item => item.productId !== product.id));
            toast.success('Removed from cart');
        } else {
            const price = product.isSubscription
                ? (billingType === 'yearly' ? product.yearlyPrice : product.monthlyPrice)
                : (product.oneTimePrice || product.defaultPrice);
            
            if (!price?.id) {
                toast.error('Price not available');
                return;
            }

            const newItem: CartItem = {
                productId: product.id,
                priceId: price.id,
                ...(product.isSubscription && { isYearly: billingType === 'yearly' })
            };
            setCart([...cart, newItem]);
            toast.success('Added to cart');
        }
    };

    const isInCart = (productId: string) => {
        return cart.some(item => item.productId === productId);
    };

    const handleCheckout = async () => {
        if (!session?.user?.id) {
            toast.error('Please sign in to continue');
            return;
        }

        if (cart.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        setCheckoutLoading(true);
        try {
            const response = await axios.post('/api/stripe/payment', {
                userId: session.user.id,
                items: cart
            });

            if (response.data.url) {
                window.location.href = response.data.url;
            } else {
                toast.error('Failed to create checkout session');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setCheckoutLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const SectionHeader = ({ title, description }: { title: string; description: string }) => (
        <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
        </div>
    );

    return (
        <div className="space-y-12">
            {/* Enhanced Billing Toggle */}
            <div className="flex justify-end">
                <div className="inline-flex items-center p-1 bg-gray-100 rounded-lg dark:bg-gray-800">
                    <button
                        onClick={() => setBillingType('monthly')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                            billingType === 'monthly'
                                ? "bg-white text-primary shadow-sm dark:bg-gray-700"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingType('yearly')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                            billingType === 'yearly'
                                ? "bg-white text-primary shadow-sm dark:bg-gray-700"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Yearly
                        <span className="ml-1 text-xs text-green-500">-20%</span>
                    </button>
                    <button
                        onClick={() => setBillingType('onetime')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                            billingType === 'onetime'
                                ? "bg-white text-primary shadow-sm dark:bg-gray-700"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        One-Time
                    </button>
                </div>
            </div>

            {/* Main Products Section */}
            <section>
                <SectionHeader 
                    title={
                        billingType === 'onetime' 
                            ? "One-Time Website Build" 
                            : "Website Maintenance Plans"
                    } 
                    description={
                        billingType === 'onetime' 
                            ? "Get your website built with a single payment - no recurring fees" 
                            : `Choose your ${billingType} maintenance plan to keep your website up-to-date`
                    }
                />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            showYearly={billingType === 'yearly'}
                            isInCart={isInCart(product.id)}
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                    {visibleProducts.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No products available for this billing type.
                        </div>
                    )}
                </div>
            </section>

            {/* Add-ons Section - Only shown in subscription views */}
            {showAddons && (
                <section>
                    <SectionHeader 
                        title="Optional Add-ons" 
                        description={`Enhance your ${billingType} plan with additional features`}
                    />
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {addons.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                showYearly={billingType === 'yearly'}
                                isInCart={isInCart(product.id)}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Checkout Button */}
            {cart.length > 0 && (
                <div className="fixed bottom-6 right-6 z-50">
                    <button
                        onClick={handleCheckout}
                        disabled={checkoutLoading}
                        className="px-6 py-3 bg-primary text-white rounded-lg shadow-lg hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {checkoutLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <ShoppingCart size={20} />
                                Checkout ({cart.length})
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductsGrid; 