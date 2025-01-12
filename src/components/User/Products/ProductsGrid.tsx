"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Product, Price } from '@/types/product';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ChevronDown, ChevronUp, ShoppingCart, Check, Lock } from 'lucide-react';

interface CartItem {
    productId: string;
    priceId: string;
    isYearly?: boolean;
}

const ProductCard = ({ 
    product, 
    showYearly, 
    isInCart,
    onAddToCart,
    isExpanded,
    onToggleExpand,
    isOwned
}: { 
    product: Product; 
    showYearly: boolean;
    isInCart: boolean;
    onAddToCart: (product: Product) => void;
    isExpanded: boolean;
    onToggleExpand: () => void;
    isOwned: boolean;
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
        <motion.div
            layout
            className={`group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-all duration-300 ${
                isOwned ? 'ring-2 ring-primary/20' : 'hover:shadow-lg hover:-translate-y-1'
            }`}
        >
            {isOwned && (
                <div className="absolute -top-3 -right-3 z-10">
                    <div className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                        <Lock size={12} />
                        Owned
                    </div>
                </div>
            )}
            <div 
                className="p-6 cursor-pointer"
                onClick={onToggleExpand}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                {product.name}
                            </h3>
                            <div className="flex items-baseline gap-1 mt-1">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {formatPrice(price)}
                                </span>
                                {product.isSubscription && (
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        /{showYearly ? 'year' : 'month'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {!isOwned && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAddToCart(product);
                                }}
                                className={`p-3 rounded-xl transition-colors ${
                                    isInCart
                                        ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                                }`}
                            >
                                {isInCart ? <Check size={20} /> : <ShoppingCart size={20} />}
                            </motion.button>
                        )}
                        <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronDown size={20} />
                        </motion.div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6 border-t dark:border-gray-700 mt-2 pt-4">
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
                                {product.description}
                            </p>
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-primary"></span>
                                    Features
                                </h4>
                                <ul className="grid gap-3">
                                    {product.features.map((feature, index) => (
                                        <motion.li 
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-start gap-3 group/feature"
                                        >
                                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/feature:bg-primary/20 transition-colors">
                                                <svg className="w-3 h-3 text-primary" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="text-sm text-gray-600 dark:text-gray-400 group-hover/feature:text-gray-900 dark:group-hover/feature:text-white transition-colors">
                                                {feature}
                                            </span>
                                        </motion.li>
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
    const { data: session, status } = useSession();
    const [billingType, setBillingType] = useState<'monthly' | 'yearly' | 'onetime'>('monthly');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
    const [ownedProducts, setOwnedProducts] = useState<string[]>([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.id) {
            fetchOwnedProducts();
        } else if (status === 'unauthenticated') {
            setOwnedProducts([]);
        }
    }, [status, session?.user?.id, fetchOwnedProducts]);

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

    const fetchOwnedProducts = useCallback(async () => {
        try {
            const response = await axios.get('/api/user/products', {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });
            setOwnedProducts(response.data.products.map((p: any) => p.id));
        } catch (error: any) {
            console.error('Error fetching owned products:', error);
            const errorMessage = error.response?.data?.error || 'Failed to load your products';
            const errorCode = error.response?.data?.code;

            if (error.response?.status === 401) {
                if (status === 'authenticated') {
                    toast.error('Your session has expired. Please refresh the page.');
                }
            } else if (error.response?.status === 404) {
                toast.error('User profile not found. Please try signing out and back in.');
            } else if (errorCode === 'STRIPE_CONFIG_ERROR') {
                toast.error('Payment service is not properly configured. Please contact support.');
            } else if (errorCode === 'STRIPE_AUTH_ERROR') {
                toast.error('Payment service authentication failed. Please contact support.');
            } else if (errorCode === 'STRIPE_CONNECTION_ERROR') {
                toast.error('Unable to connect to payment service. Please try again later.');
            } else if (errorCode === 'STRIPE_ERROR') {
                toast.error('Payment service is temporarily unavailable. Please try again later.');
            } else if (errorCode === 'DATABASE_ERROR') {
                toast.error('Database service is temporarily unavailable. Please try again later.');
            } else {
                toast.error(errorMessage);
            }
            setOwnedProducts([]);
        }
    }, [status]);

    // Filter products based on billing type (with null check)
    const visibleProducts = (products || []).filter(p => {
        const isBuyWebsite = p.name?.toLowerCase().includes('buy a website');
        
        if (billingType === 'onetime') {
            // Only show "Buy a Website" product in one-time view
            return isBuyWebsite;
        }
        // In monthly/yearly views, show subscription products except "Buy a Website"
        return !p.isAddon && p.isSubscription && !isBuyWebsite;
    });

    // Separate addons, excluding "Buy a Website" product (with null check)
    const addons = (products || []).filter(p => {
        const isBuyWebsite = p.name?.toLowerCase().includes('buy a website');
        return p.isAddon && !isBuyWebsite;
    });

    // Only show addons section in subscription views
    const showAddons = billingType !== 'onetime' && addons.length > 0;

    const handleAddToCart = (product: Product) => {
        if (isOwned(product.id)) {
            toast.error('You already own this product');
            return;
        }

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
            console.log('Cart items:', cart);
            const response = await axios.post('/api/stripe/payment', { items: cart });

            if (response.data.url) {
                window.location.href = response.data.url;
            } else {
                toast.error('Failed to create checkout session');
            }
        } catch (error: any) {
            console.error('Checkout error:', error);
            console.error('Error response:', error.response?.data);
            toast.error(error.response?.data?.error || 'Something went wrong');
        } finally {
            setCheckoutLoading(false);
        }
    };

    const handleToggleExpand = (productId: string) => {
        setExpandedProducts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });
    };

    const isOwned = (productId: string) => {
        return status === 'authenticated' && ownedProducts.includes(productId);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Billing Type Toggle */}
            <div className="flex flex-col items-center text-center space-y-8">
                <div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl"
                    >
                        Choose Your Plan
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-3 text-lg text-gray-600 dark:text-gray-400"
                    >
                        Select the perfect solution for your needs
                    </motion.p>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center p-1.5 bg-gray-100 dark:bg-gray-800/50 rounded-xl shadow-sm"
                >
                    <button
                        onClick={() => setBillingType('onetime')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                            billingType === 'onetime'
                                ? 'bg-white dark:bg-gray-800 text-primary shadow-sm dark:shadow-gray-900/50'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        One-time
                    </button>
                    <button
                        onClick={() => setBillingType('monthly')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                            billingType === 'monthly'
                                ? 'bg-white dark:bg-gray-800 text-primary shadow-sm dark:shadow-gray-900/50'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingType('yearly')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                            billingType === 'yearly'
                                ? 'bg-white dark:bg-gray-800 text-primary shadow-sm dark:shadow-gray-900/50'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Yearly
                        <span className="ml-1 text-xs text-green-500 font-normal">Save 20%</span>
                    </button>
                </motion.div>
            </div>

            {/* Main Products */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {billingType === 'onetime' ? 'One-time Purchase' : 'Subscription Plans'}
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        {billingType === 'onetime'
                            ? 'Get started with a one-time payment'
                            : 'Flexible plans that grow with your needs'}
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {visibleProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            showYearly={billingType === 'yearly'}
                            isInCart={isInCart(product.id)}
                            onAddToCart={handleAddToCart}
                            isExpanded={expandedProducts.has(product.id)}
                            onToggleExpand={() => handleToggleExpand(product.id)}
                            isOwned={isOwned(product.id)}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Add-ons Section */}
            {showAddons && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative pt-16 pb-4"
                >
                    <div className="text-center space-y-4 mb-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                        >
                            Enhance Your Website
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="text-3xl font-bold text-gray-900 dark:text-white"
                        >
                            Powerful Add-ons
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                        >
                            Take your website to the next level with our carefully crafted add-ons
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {addons.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + (index * 0.1) }}
                            >
                                <div className="relative">
                                    <div className="absolute -inset-px bg-gradient-to-r from-primary/30 via-primary/20 to-primary/10 rounded-[22px] blur-lg opacity-40" />
                                    <ProductCard
                                        product={product}
                                        showYearly={billingType === 'yearly'}
                                        isInCart={isInCart(product.id)}
                                        onAddToCart={handleAddToCart}
                                        isExpanded={expandedProducts.has(product.id)}
                                        onToggleExpand={() => handleToggleExpand(product.id)}
                                        isOwned={isOwned(product.id)}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="mt-16 text-center"
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-600 dark:text-gray-400">
                            <svg className="w-5 h-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Add-ons can be cancelled or modified anytime
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Cart Summary */}
            <AnimatePresence>
                {cart.length > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 shadow-lg z-50"
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <ShoppingCart size={16} className="text-primary" />
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {cart.length} item{cart.length !== 1 ? 's' : ''} in cart
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleCheckout}
                                    disabled={checkoutLoading}
                                    className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {checkoutLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Proceed to Checkout
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductsGrid; 