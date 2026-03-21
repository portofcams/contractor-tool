export default function InvoicesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-32 bg-secondary rounded" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-20 bg-secondary rounded-lg" />
        <div className="h-20 bg-secondary rounded-lg" />
      </div>
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-secondary rounded-lg" />
        ))}
      </div>
    </div>
  );
}
