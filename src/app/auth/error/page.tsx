"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string) => {
    switch (error) {
      case "Verification":
        return "The verification link is invalid or has expired. Please try signing in again to get a new verification link.";
      case "Configuration":
        return "There is a problem with the server configuration. Please try again later.";
      case "AccessDenied":
        return "Access denied. Only registered users can sign in. Please contact your administrator for access.";
      default:
        return "An error occurred during authentication. Please try again.";
    }
  };

  return (
    <div className="flex flex-col items-center text-center p-7.5">
      <div className="mb-4">
        <div className="inline-flex items-center justify-center w-[60px] h-[60px] rounded-full bg-red-50 dark:bg-red-900/20">
          <svg className="w-8 h-8 text-red-500 dark:text-red-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <h1 className="font-satoshi text-2xl font-bold text-black dark:text-white mb-4">
        Authentication Error
      </h1>
      
      <p className="font-satoshi text-base text-body dark:text-gray-5 mb-7.5 max-w-[400px]">
        {getErrorMessage(error || "")}
      </p>

      <Link
        href="/auth/signin"
        className="inline-flex items-center justify-center rounded-full bg-primary py-3 px-8 font-medium text-white transition duration-300 hover:bg-primary-dark hover:shadow-button"
      >
        Back to Sign In
      </Link>
    </div>
  );
} 