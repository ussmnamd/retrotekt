import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-background min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="font-body text-[10px] tracking-[0.3em] uppercase text-secondary mb-6">
        404 · Not Found
      </p>
      <h1
        className="font-heading text-primary leading-[0.9] tracking-[-0.03em] mb-6"
        style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
      >
        Nothing here.
      </h1>
      <p className="font-body text-[14px] text-primary/50 max-w-sm mb-10 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or was moved.
      </p>
      <Link
        href="/"
        className="font-body text-[11px] tracking-[0.2em] uppercase text-primary border-b border-primary/30 pb-0.5 hover:border-primary transition-colors duration-200"
      >
        Back to home
      </Link>
    </div>
  );
}
