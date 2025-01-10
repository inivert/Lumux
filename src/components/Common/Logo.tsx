"use client";
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <span className="text-2xl font-bold tracking-tight drop-shadow-sm">
        <span className="text-white">Code</span>
        <span className="text-primary hover:text-primary/90 transition-colors">Lumus</span>
      </span>
      {/* Only show dev tag in development */}
      {process.env.NODE_ENV === 'development' && (
        <span className="rounded border border-white/20 bg-black/10 backdrop-blur-sm px-2 py-0.5 text-[10px] uppercase tracking-widest font-medium text-white/90">
          dev
        </span>
      )}
    </Link>
  );
};

export default Logo; 