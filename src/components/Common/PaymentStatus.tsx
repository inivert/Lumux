"use client";

import React, { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

const PaymentStatus = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const status = searchParams.get('status');

    useEffect(() => {
        if (status) {
            switch (status) {
                case 'success':
                    toast.success('Payment successful! Your subscription is now active.', {
                        duration: 5000,
                    });
                    break;
                case 'canceled':
                    toast.info('Payment canceled. No charges were made.', {
                        duration: 5000,
                    });
                    break;
                case 'error':
                    toast.error('Payment failed. Please try again or contact support.', {
                        duration: 5000,
                    });
                    break;
            }

            // Remove the status parameter from the URL
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('status');
            router.replace(newUrl.pathname);
        }
    }, [status, router]);

    if (status === 'success') {
        return (
            <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 mb-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Payment Successful</h3>
                        <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                            <p>Thank you for your payment! Your subscription is now active.</p>
                        </div>
                        <div className="mt-4">
                            <div className="-mx-2 -my-1.5 flex">
                                <a
                                    href="/user/billing"
                                    className="rounded-md bg-green-50 dark:bg-green-900/30 px-2 py-1.5 text-sm font-medium text-green-800 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-900/40 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                                >
                                    View subscription details
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'canceled') {
        return (
            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 mb-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Payment Canceled</h3>
                        <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                            <p>Your payment was canceled. No charges were made to your account.</p>
                        </div>
                        <div className="mt-4">
                            <div className="-mx-2 -my-1.5 flex">
                                <a
                                    href="/pricing"
                                    className="rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900/40 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-blue-50"
                                >
                                    View plans
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 mb-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Payment Failed</h3>
                        <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                            <p>There was an issue processing your payment. Please try again or contact support.</p>
                        </div>
                        <div className="mt-4">
                            <div className="-mx-2 -my-1.5 flex space-x-3">
                                <a
                                    href="/pricing"
                                    className="rounded-md bg-red-50 dark:bg-red-900/30 px-2 py-1.5 text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                                >
                                    Try again
                                </a>
                                <a
                                    href="/user/support"
                                    className="rounded-md bg-red-50 dark:bg-red-900/30 px-2 py-1.5 text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                                >
                                    Contact support
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default PaymentStatus; 