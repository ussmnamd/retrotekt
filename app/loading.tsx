export default function Loading() {
  return (
    <div className="bg-background min-h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-px h-12 bg-secondary/40 animate-pulse" />
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/30">
          Loading
        </p>
      </div>
    </div>
  );
}
