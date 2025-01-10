"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { formatCurrency } from '@/utils/format';

interface SubscriptionItem {
    id: string;
    productId: string;
    productName: string;
    amount: number;
    currency: string;
    interval: string;
    intervalCount: number;
}

interface PaymentMethod {
    id: string;
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    isDefault: boolean;
}

interface Invoice {
    id: string;
    number: string;
    amount: number;
    currency: string;
    status: string;
    date: number;
    pdfUrl: string;
}

interface SubscriptionData {
    id: string;
    status: string;
    currentPeriodStart: number;
    currentPeriodEnd: number;
    cancelAtPeriodEnd: boolean;
    cancelAt: number | null;
    trialEnd: number | null;
    items: SubscriptionItem[];
}

interface UpcomingInvoiceLineItem {
    description: string;
    amount: number;
    currency: string;
    period: {
        start: number;
        end: number;
    };
}

interface UpcomingInvoice {
    amount: number;
    currency: string;
    date: number;
    lineItems: UpcomingInvoiceLineItem[];
}

interface SubscriptionDetails {
    hasSubscription: boolean;
    subscriptions: SubscriptionData[];
    paymentMethods: PaymentMethod[];
    invoices: Invoice[];
    upcomingInvoice: UpcomingInvoice | null;
}

const SubscriptionDetails = () => {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<SubscriptionDetails | null>(null);

    useEffect(() => {
        const fetchSubscriptionDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/user/subscription');
                setData(response.data);
                setError(null);
            } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to load subscription details');
                console.error('Error fetching subscription details:', err);
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchSubscriptionDetails();
        }
    }, [session]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'active_trial':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'active_canceling':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'payment_overdue':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
            case 'payment_failed':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'canceled':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    const getStatusMessage = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'Active';
            case 'active_trial':
                return 'Trial Period';
            case 'active_canceling':
                return 'Canceling Soon';
            case 'payment_overdue':
                return 'Payment Overdue';
            case 'payment_failed':
                return 'Payment Failed';
            case 'canceled':
                return 'Canceled';
            default:
                return status.charAt(0).toUpperCase() + status.slice(1);
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const calculateTotalCost = (subscriptions: SubscriptionData[]) => {
        // Group items by interval to handle mixed billing periods
        const items = subscriptions.flatMap(s => s.items);
        
        const monthlyCost = items
            .filter(item => item.interval === 'month')
            .reduce((total, item) => total + (item.amount || 0), 0);

        const yearlyCost = items
            .filter(item => item.interval === 'year')
            .reduce((total, item) => total + (item.amount || 0), 0);

        // Calculate monthly equivalent of yearly cost
        const yearlyToMonthly = Math.round(yearlyCost / 12);

        return {
            monthly: monthlyCost,
            yearly: yearlyCost,
            totalMonthly: monthlyCost + yearlyToMonthly,
            hasMonthly: monthlyCost > 0,
            hasYearly: yearlyCost > 0
        };
    };

    const consolidateSubscriptions = (subscriptions: SubscriptionData[]): SubscriptionData[] => {
        // Early return if no subscriptions
        if (!subscriptions.length) return [];
        
        // Split items into main plans and add-ons
        const mainPlans = new Map<string, SubscriptionData[]>();
        const allAddOns = new Set<string>();
        
        // First pass: categorize subscriptions and collect add-ons
        subscriptions.forEach(sub => {
            sub.items.forEach(item => {
                if (item.productName.toLowerCase().includes('add-on')) {
                    allAddOns.add(item.productName);
                } else {
                    const plans = mainPlans.get(item.productName) || [];
                    plans.push({...sub});
                    mainPlans.set(item.productName, plans);
                }
            });
        });
        
        // Process main plans
        const consolidatedPlans: SubscriptionData[] = [];
        mainPlans.forEach((plans, planName) => {
            // Sort by status priority (active > canceling > others)
            const sortedPlans = plans.sort((a, b) => {
                const getStatusPriority = (status: string) => {
                    if (status === 'active') return 0;
                    if (status === 'canceling') return 1;
                    return 2;
                };
                return getStatusPriority(a.status) - getStatusPriority(b.status);
            });
            
            // Take the highest priority plan
            const primaryPlan = sortedPlans[0];
            
            // Collect all add-ons for this plan
            const planAddOns = subscriptions
                .flatMap(sub => sub.items)
                .filter(item => allAddOns.has(item.productName));
            
            // Create consolidated subscription with all add-ons
            consolidatedPlans.push({
                ...primaryPlan,
                items: [
                    ...primaryPlan.items.filter(item => !item.productName.toLowerCase().includes('add-on')),
                    ...planAddOns
                ]
            });
        });
        
        // If we have add-ons but no main plans, create a subscription just for add-ons
        if (consolidatedPlans.length === 0 && allAddOns.size > 0) {
            const addOnItems = subscriptions
                .flatMap(sub => sub.items)
                .filter(item => allAddOns.has(item.productName));
            
            consolidatedPlans.push({
                ...subscriptions[0],
                items: addOnItems
            });
        }
        
        return consolidatedPlans;
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                        <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!data?.hasSubscription) {
        return (
            <div className="text-center py-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Active Subscription</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    You don't have any active subscriptions at the moment.
                </p>
                <a
                    href="/pricing"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    View Plans
                </a>
            </div>
        );
    }

    const consolidatedSubscriptions = consolidateSubscriptions(data.subscriptions);
    console.log('Subscription consolidation:', {
        original: {
            count: data.subscriptions.length,
            items: data.subscriptions.flatMap(s => s.items.map(i => i.productName))
        },
        consolidated: {
            count: consolidatedSubscriptions.length,
            items: consolidatedSubscriptions.flatMap(s => s.items.map(i => i.productName))
        }
    });
    const { monthly: monthlyTotal, yearly: yearlyTotal, hasMonthly, hasYearly } = calculateTotalCost(consolidatedSubscriptions);

    return (
        <div className="space-y-8">
            {/* Active Subscriptions */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="w-full">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Active Subscriptions
                        </h3>
                        <div className="mt-4 space-y-6">
                            {consolidatedSubscriptions.map(subscription => {
                                const mainPlan = subscription.items.find(item => !item.productName.toLowerCase().includes('add-on'));
                                const addons = subscription.items.filter(item => item.productName.toLowerCase().includes('add-on'));

                                return (
                                    <div key={subscription.id} className="space-y-4">
                                        {/* Main Plan */}
                                        {mainPlan && (
                                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {mainPlan.productName}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                            {formatCurrency(mainPlan.amount, mainPlan.currency)}/{mainPlan.interval}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                                                            {getStatusMessage(subscription.status)}
                                                        </span>
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                                            Main Plan
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {/* Subscription Status Info */}
                                                <div className="mt-3 text-sm">
                                                    {subscription.status === 'active_trial' && subscription.trialEnd && (
                                                        <p className="text-blue-600 dark:text-blue-400">
                                                            Trial ends on {formatDate(subscription.trialEnd)}
                                                        </p>
                                                    )}
                                                    {subscription.status === 'active_canceling' && subscription.cancelAt && (
                                                        <p className="text-yellow-600 dark:text-yellow-400">
                                                            Subscription ends on {formatDate(subscription.cancelAt)}
                                                        </p>
                                                    )}
                                                    <p className="text-gray-500 dark:text-gray-400">
                                                        Current period: {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Add-ons */}
                                        {addons.length > 0 && (
                                            <div className="ml-4 space-y-2">
                                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Related Add-ons</h4>
                                                {addons.map(addon => (
                                                    <div key={addon.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {addon.productName}
                                                                </h4>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                                    {formatCurrency(addon.amount, addon.currency)}/{addon.interval}
                                                                </p>
                                                            </div>
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                                Add-on
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Total Cost */}
                <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-4">
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Total Subscription Cost</h4>
                        <div className="space-y-1">
                            {hasMonthly && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Subscriptions</span>
                                    <span className="text-sm font-medium text-primary">
                                        {formatCurrency(monthlyTotal, 'usd')}/month
                                    </span>
                                </div>
                            )}
                            {hasYearly && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Yearly Subscriptions</span>
                                    <span className="text-sm font-medium text-primary">
                                        {formatCurrency(yearlyTotal, 'usd')}/year
                                        <span className="text-xs text-gray-500 ml-1">
                                            ({formatCurrency(Math.round(yearlyTotal / 12), 'usd')}/month)
                                        </span>
                                    </span>
                                </div>
                            )}
                            {(hasMonthly || hasYearly) && (
                                <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">Total Monthly Cost</span>
                                        <span className="text-base font-semibold text-primary">
                                            {formatCurrency(monthlyTotal + Math.round(yearlyTotal / 12), 'usd')}/month
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming Payment */}
            {data.upcomingInvoice && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Upcoming Payments</h4>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div className="space-y-3">
                            {data.upcomingInvoice.lineItems
                                .sort((a, b) => b.amount - a.amount) // Sort by amount descending
                                .map((item, index) => (
                                <div key={index} className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {item.description}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Period: {formatDate(item.period.start)} - {formatDate(item.period.end)}
                                        </p>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {formatCurrency(item.amount, item.currency)}
                                    </span>
                                </div>
                            ))}
                            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Total Due on {formatDate(data.upcomingInvoice.date)}
                                    </p>
                                    <span className="text-base font-semibold text-primary">
                                        {formatCurrency(data.upcomingInvoice.amount, data.upcomingInvoice.currency)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Invoices */}
            {data.invoices.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Recent Invoices</h4>
                    <div className="space-y-3">
                        {data.invoices.map(invoice => (
                            <a
                                key={invoice.id}
                                href={invoice.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Invoice #{invoice.number}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {formatDate(invoice.date)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {formatCurrency(invoice.amount, invoice.currency)}
                                    </span>
                                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                    </svg>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionDetails; 