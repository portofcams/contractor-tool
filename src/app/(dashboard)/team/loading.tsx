export default function TeamLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-24 bg-secondary rounded" />
        <div className="h-10 w-32 bg-secondary rounded" />
      </div>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-secondary rounded-lg" />
        ))}
      </div>
    </div>
  );
}
