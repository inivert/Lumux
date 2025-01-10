import { Product } from '@/types/product';

export const products: Product[] = [
    {
        id: process.env.NEXT_PUBLIC_STRIPE_STARTER_PLAN_ID || 'starter_plan',
        name: 'Starter Plan',
        description: 'Everything you need to get started',
        monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PLAN_MONTHLY_PRICE_ID || 'price_starter_monthly',
        yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PLAN_YEARLY_PRICE_ID || 'price_starter_yearly',
        features: [
            'Up to 3 projects',
            'Basic customization',
            'Community support',
            'Regular updates'
        ],
        isAddon: false
    },
    {
        id: process.env.NEXT_PUBLIC_STRIPE_EXTRA_CHANGES_ID || 'extra_changes',
        name: 'Extra Changes',
        description: 'Additional changes for your projects',
        monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_EXTRA_CHANGES_MONTHLY_PRICE_ID || 'price_extra_changes_monthly',
        yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_EXTRA_CHANGES_YEARLY_PRICE_ID || 'price_extra_changes_yearly',
        features: [
            'Additional monthly changes',
            'Priority queue',
            'Rollback support'
        ],
        isAddon: true
    },
    {
        id: process.env.NEXT_PUBLIC_STRIPE_BOOKING_SYSTEM_ID || 'booking_system',
        name: 'Booking System',
        description: 'Complete booking and scheduling system',
        monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_BOOKING_SYSTEM_MONTHLY_PRICE_ID || 'price_booking_monthly',
        yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_BOOKING_SYSTEM_YEARLY_PRICE_ID || 'price_booking_yearly',
        features: [
            'Online booking system',
            'Calendar management',
            'Automated reminders',
            'Payment processing'
        ],
        isAddon: true
    },
    {
        id: process.env.NEXT_PUBLIC_STRIPE_CONTENT_MANAGER_ID || 'content_manager',
        name: 'Content Manager',
        description: 'Advanced content management tools',
        monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_CONTENT_MANAGER_MONTHLY_PRICE_ID || 'price_content_monthly',
        yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_CONTENT_MANAGER_YEARLY_PRICE_ID || 'price_content_yearly',
        features: [
            'Content scheduling',
            'Media library',
            'SEO tools',
            'Analytics dashboard'
        ],
        isAddon: true
    },
    {
        id: process.env.NEXT_PUBLIC_STRIPE_USER_ACCOUNTS_ID || 'user_accounts',
        name: 'User Accounts',
        description: 'Complete user management system',
        monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_USER_ACCOUNTS_MONTHLY_PRICE_ID || 'price_accounts_monthly',
        yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_USER_ACCOUNTS_YEARLY_PRICE_ID || 'price_accounts_yearly',
        features: [
            'User registration',
            'Role management',
            'Authentication system',
            'User profiles'
        ],
        isAddon: true
    }
]; 