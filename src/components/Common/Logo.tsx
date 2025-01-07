import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <span className="text-3xl font-bold">
        <span className="text-white">Code</span>
        <span className="text-primary">Lumus</span>
      </span>
      <span className="rounded border border-primary/30 bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary">
        dev
      </span>
    </Link>
  );
};

export default Logo; 