import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Failed to load operational data",
  message = "A simulated network anomaly or unexpected service error occurred. You can retry immediately.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-rose-50/70 border border-rose-200 rounded-2xl text-center">
      <div className="p-3 bg-rose-100 rounded-full text-rose-600 mb-3">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-rose-950">{title}</h3>
      <p className="mt-1 text-sm text-rose-700 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <RotateCcw className="w-4 h-4" />
          Retry Operation
        </button>
      )}
    </div>
  );
}

