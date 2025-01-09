export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
      <div className="w-full max-w-[500px] px-4">
        {children}
      </div>
    </div>
  );
} 