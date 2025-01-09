import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="inline-flex items-center gap-2">
      <span className="text-2xl font-bold">
        <span className="text-black dark:text-white">Code</span>
        <span className="text-primary">Lumus</span>
      </span>
      <span className="rounded border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
        dev
      </span>
    </Link>
  );
};

export default Logo; 