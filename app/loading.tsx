export default function Loading() {
  return (
    <div className="min-h-[50vh] w-full flex flex-col items-center justify-center gap-4 bg-background">
      <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-card p-1 shadow-lg ring-1 ring-border">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-6 rounded-full border-2 border-tejas-blue border-t-transparent animate-spin" />
        </div>
      </div>
      <div className="text-sm font-semibold text-muted-foreground animate-pulse tracking-widest uppercase">
        TEJAS Institute
      </div>
    </div>
  );
}
