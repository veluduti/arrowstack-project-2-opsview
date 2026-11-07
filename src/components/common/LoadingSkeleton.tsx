import React from "react";

export function Skeleton({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return <div style={style} className={`animate-pulse bg-slate-200 rounded-md ${className}`} />;
}

export function MetricCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-36">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
      <div>
        <Skeleton className="h-8 w-36 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  );
}

export function ChartSkeleton({ height = "h-80" }: { height?: string }) {
  return (
    <div className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm ${height} flex flex-col`}>
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      <div className="flex-1 flex items-end gap-3 pt-4">
        {[40, 65, 55, 80, 95, 70, 85, 60, 75, 90].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end h-full">
            <Skeleton className="w-full rounded-t-md" style={{ height: `${h}%` } as React.CSSProperties} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-9 w-64 rounded-lg" />
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="py-4 flex items-center justify-between gap-4">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <Skeleton key={cIdx} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
