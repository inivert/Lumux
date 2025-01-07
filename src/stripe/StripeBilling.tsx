"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { pricingData } from "../pricing/pricingData";
import PriceItem from "./StripeBilling/PriceItem";
import { Switch } from "@headlessui/react";

const StripeBilling = () => {
  const [showYearly, setShowYearly] = useState(false);
  const { data: session } = useSession();

  return (
    <section id="pricing" className="w-full py-16 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-base font-semibold leading-7 text-primary">Pricing</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Choose the perfect plan for your needs
          </p>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Simple, transparent pricing that grows with you. Try any plan free for 30 days.
          </p>
        </div>

        <div className="mb-12 flex justify-center">
          <div className="relative flex items-center gap-3 rounded-full bg-white dark:bg-gray-800 p-1.5 shadow-sm border border-gray-200 dark:border-gray-700">
            <span 
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                !showYearly 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
              onClick={() => setShowYearly(false)}
              role="button"
            >
              Monthly
            </span>
            <span 
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                showYearly 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
              onClick={() => setShowYearly(true)}
              role="button"
            >
              Yearly
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {pricingData
            .filter((plan) => !plan.isAddon)
            .map((plan, index) => (
              <PriceItem
                key={index}
                plan={plan}
                showYearly={showYearly}
              />
            ))}
        </div>

        {/* Add-ons Section */}
        <div className="mt-20">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Enhance your plan with add-ons
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
              Customize your solution with powerful add-ons
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pricingData
              .filter((plan) => plan.isAddon)
              .map((plan, index) => (
                <PriceItem
                  key={index}
                  plan={plan}
                  showYearly={showYearly}
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StripeBilling;
