export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-secondary rounded" />
          <div className="h-4 w-32 bg-secondary rounded mt-2" />
        </div>
        <div className="h-10 w-28 bg-secondary rounded" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-secondary rounded-lg" />
        ))}
      </div>

      <div className="h-64 bg-secondary rounded-lg" />

      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-secondary rounded-lg" />
        ))}
      </div>
    </div>
  );
}
