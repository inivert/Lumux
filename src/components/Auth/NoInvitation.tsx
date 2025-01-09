"use client";
import React from "react";
import Card from "@/components/Common/Dashboard/Card";
import { signOut } from "next-auth/react";
import FormButton from "@/components/Common/Dashboard/FormButton";

export default function NoInvitation() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-[600px] text-center">
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-dark dark:text-white mb-3">
            No Invitation Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            This is a private application that requires an invitation to access. Please contact the administrator to request an invitation.
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg mb-6">
            <p>If you believe this is a mistake and you should have access:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Check your email for an invitation link</li>
              <li>Make sure you're using the correct email address</li>
              <li>Contact the administrator for assistance</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <FormButton onClick={() => window.location.href = "/"}>
            Return to Home
          </FormButton>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
          >
            Sign out
          </button>
        </div>
      </Card>
    </div>
  );
} 