"use client";

import React from 'react';
import { useSession } from 'next-auth/react';

interface SubscriptionInfo {
    status: string;
    currentPeriodEnd: string;
    plan: string;
}

const SubscriptionDetails = () => {
    const { data: session } = useSession();
    
    // This would typically come from your API
    const subscription: SubscriptionInfo = {
        status: "active",
        currentPeriodEnd: "2024-02-09",
        plan: "Professional"
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'past_due':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Plan Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {subscription.plan} Plan
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Renews on {formatDate(subscription.currentPeriodEnd)}
                    </p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                </span>
            </div>

            {/* Next Payment */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Next Payment</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(subscription.currentPeriodEnd)}
                        </p>
                    </div>
                    <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        View Invoice
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionDetails; 