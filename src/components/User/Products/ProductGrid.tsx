"use client";

import React, { useState, useEffect } from 'react';
import Card from '@/components/Common/Dashboard/Card';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { CartItem, Product, Price } from '@/types/product';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const ProductGrid = () => {
    const { data: session } = useSession();
    const [showYearly, setShowYearly] = useState(false);
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
            setProducts(response.data.products);
        } catch (error) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const mainPlan = products.find(p => !p.isAddon);
    const addons = products.filter(p => p.isAddon);

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

    const handleAddToCart = (product: Product) => {
        if (isInCart(product.id)) {
            setCart(cart.filter(item => item.productId !== product.id));
            toast.success('Removed from cart');
        } else {
            const price = getActivePrice(product);
            
            if (!price?.id) {
                toast.error('Price not available');
                return;
            }

            const newItem: CartItem = {
                productId: product.id,
                priceId: price.id,
                ...(product.isSubscription && { isYearly: showYearly })
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

    return (
        <div className="max-w-7xl mx-auto space-y-12">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
                    Choose Your Plan
                </h1>
                <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
                    Select the perfect plan for your needs and supercharge your website
                </p>
            </motion.div>

            {/* Billing Toggle - Only show if there are subscription products */}
            {products.some(p => p.isSubscription) && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-center"
                >
                    <div className="relative flex items-center p-1 bg-gray-100 rounded-full dark:bg-gray-800">
                        <button
                            onClick={() => setShowYearly(false)}
                            className={`px-6 py-3 text-sm font-medium rounded-full transition-all duration-200 ${
                                !showYearly
                                    ? "bg-white text-primary shadow-sm dark:bg-gray-700"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setShowYearly(true)}
                            className={`px-6 py-3 text-sm font-medium rounded-full transition-all duration-200 ${
                                showYearly
                                    ? "bg-white text-primary shadow-sm dark:bg-gray-700"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Yearly
                            <span className="ml-1 text-xs text-green-500">Save 20%</span>
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Main Plan */}
            {mainPlan && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="max-w-4xl mx-auto overflow-hidden">
                        <div className="p-8">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {mainPlan.name}
                                    </h3>
                                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                                        {mainPlan.description}
                                    </p>
                                    <div className="mt-4">
                                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                            {formatPrice(getActivePrice(mainPlan))}
                                        </span>
                                        {mainPlan.isSubscription && (
                                            <span className="text-xl text-gray-600 dark:text-gray-400 ml-2">
                                                /{showYearly ? 'year' : 'month'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Features included:
                                    </h4>
                                    <ul className="space-y-3">
                                        {mainPlan.features.map((feature, index) => (
                                            <motion.li
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 + index * 0.1 }}
                                                className="flex items-start gap-3"
                                            >
                                                <svg className="w-5 h-5 text-primary mt-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="space-y-6">
                                    <button
                                        onClick={() => handleAddToCart(mainPlan)}
                                        className={`w-full py-4 px-6 text-lg font-semibold rounded-xl transition-all ${
                                            isInCart(mainPlan.id)
                                                ? "bg-red-500 hover:bg-red-600 text-white"
                                                : "bg-primary hover:bg-primary-dark text-white"
                                        } focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
                                    >
                                        {isInCart(mainPlan.id) ? "Remove from Cart" : "Add to Cart"}
                                    </button>

                                    {cart.length > 0 && (
                                        <button
                                            onClick={handleCheckout}
                                            disabled={checkoutLoading}
                                            className="w-full py-4 px-6 text-lg font-semibold rounded-xl bg-green-500 hover:bg-green-600 text-white transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {checkoutLoading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Processing...
                                                </span>
                                            ) : (
                                                "Proceed to Checkout"
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Add-ons */}
            {addons.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-8"
                >
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
                        Enhance Your Experience
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {addons.map((addon, index) => (
                            <motion.div
                                key={addon.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                            >
                                <Card className="h-full">
                                    <div className="p-6 flex flex-col h-full">
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {addon.name}
                                                </h3>
                                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                                    {addon.description}
                                                </p>
                                                <div className="mt-4">
                                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                        {formatPrice(getActivePrice(addon))}
                                                    </span>
                                                    {addon.isSubscription && (
                                                        <span className="text-gray-600 dark:text-gray-400 ml-1">
                                                            /{showYearly ? 'year' : 'month'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <ul className="space-y-3 mb-6">
                                                {addon.features.map((feature, featureIndex) => (
                                                    <motion.li
                                                        key={featureIndex}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.5 + featureIndex * 0.1 }}
                                                        className="flex items-start gap-3"
                                                    >
                                                        <svg className="w-5 h-5 text-primary mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                                            {feature}
                                                        </span>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </div>

                                        <button
                                            onClick={() => handleAddToCart(addon)}
                                            className={`w-full py-3 px-4 text-base font-semibold rounded-xl transition-all ${
                                                isInCart(addon.id)
                                                    ? "bg-red-500 hover:bg-red-600 text-white"
                                                    : "bg-primary hover:bg-primary-dark text-white"
                                            } focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
                                        >
                                            {isInCart(addon.id) ? "Remove from Cart" : "Add to Cart"}
                                        </button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ProductGrid; 