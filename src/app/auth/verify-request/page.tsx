"use client";

import Link from "next/link";

export default function VerifyRequest() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
            Check your email
          </h2>
          <div className="mt-4">
            <p className="text-center text-gray-600 dark:text-gray-400">
              A sign in link has been sent to your email address.
              Please check your inbox and click the link to continue.
            </p>
          </div>
          <div className="mt-4">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              If you don't see the email, check your spam folder.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <Link
            href="/auth/signin"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
} 