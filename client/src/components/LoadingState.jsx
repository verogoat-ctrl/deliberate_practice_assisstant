function Pulse({ className = "" }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

export default function LoadingState() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
          <Pulse className="h-5 w-48 mb-4" />
          <Pulse className="h-3 w-full mb-2" />
          <Pulse className="h-3 w-5/6 mb-2" />
          <Pulse className="h-3 w-4/6 mb-4" />
          <Pulse className="h-3 w-full mb-2" />
          <Pulse className="h-3 w-3/4" />
        </div>
      ))}
    </div>
  );
}
