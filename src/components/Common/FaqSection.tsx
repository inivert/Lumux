import React from 'react';
import { faqData } from '@/staticData/faqData';

const FaqSection: React.FC = () => {
  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="mt-6 border-t border-gray-200 divide-y divide-gray-200">
          {faqData.map((item, index) => (
            <details key={index} className="py-6">
              <summary className="text-lg font-medium text-gray-900 cursor-pointer">
                {item.question}
              </summary>
              <div className="mt-2 text-base text-gray-500">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqSection;
