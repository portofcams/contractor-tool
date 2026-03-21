export default function JobsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-24 bg-secondary rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-secondary rounded" />
          <div className="h-8 w-8 bg-secondary rounded" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {[...Array(35)].map((_, i) => (
          <div key={i} className="h-20 bg-secondary rounded" />
        ))}
      </div>
    </div>
  );
}
