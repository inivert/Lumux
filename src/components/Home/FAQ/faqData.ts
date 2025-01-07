interface Faq {
  id: number;
  question: string;
  answer: string;
}

const faqData: Faq[] = [
  {
    id: 1,
    question: "What is CodeLumus?",
    answer:
      "CodeLumus is a professional website management service that provides custom-built solutions for businesses. We handle everything from core website maintenance to advanced features like payment processing, analytics, and content management.",
  },
  {
    id: 2,
    question: "How does the website management service work?",
    answer:
      "Our core plan includes essential website management services like analytics tracking, payment processing, status monitoring, and landing page updates. You can enhance your service with add-ons for specific needs like content management, user accounts, or booking systems.",
  },
  {
    id: 3,
    question: "What add-ons are available and how do they work?",
    answer:
      "We offer several add-ons to extend your website's capabilities: Content Manager for advanced CMS features and SEO tools, User Accounts for team management and access controls, Booking System for scheduling and calendar integration, and Extra Changes for additional customizations and priority support. Each add-on can be added to your core plan as needed.",
  },
  {
    id: 4,
    question: "Do you offer custom development services?",
    answer:
      "Yes, our Extra Changes add-on includes custom development services. This covers additional customizations, extended features, and custom integrations tailored to your specific needs. We work closely with you to understand your requirements and implement the right solutions.",
  },
  {
    id: 5,
    question: "How do your monthly and yearly billing options work?",
    answer:
      "You can choose between monthly or yearly billing for all our plans. Yearly billing includes a 20% discount, providing significant savings while ensuring long-term website management and support. You can switch between billing periods at any time.",
  },
  {
    id: 6,
    question: "What kind of support do you provide?",
    answer:
      "We provide comprehensive support including website status monitoring, problem reporting, and regular updates. With the Extra Changes add-on, you get priority support and direct access to our development team for custom requirements and urgent issues.",
  },
  {
    id: 7,
    question: "Can I upgrade or downgrade my plan?",
    answer:
      "Yes, you can modify your plan at any time. You can add or remove add-ons based on your needs, or upgrade to yearly billing to save 20%. All changes take effect from your next billing cycle.",
  },
  {
    id: 8,
    question: "How do you handle website monitoring and updates?",
    answer:
      "Our core plan includes continuous website status monitoring to ensure your site stays operational. We track analytics to identify potential improvements, handle all necessary updates, and maintain your website's performance and security.",
  },
];

export default faqData;
