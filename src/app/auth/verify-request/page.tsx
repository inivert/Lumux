export default function VerifyRequest() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Check your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            A sign in link has been sent to your email address.
            Click the link to sign in.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="text-sm text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Didn't receive the email? Check your spam folder or
            </p>
            <a
              href="/auth/signin"
              className="font-medium text-primary hover:text-primary-dark"
            >
              Try another method
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 