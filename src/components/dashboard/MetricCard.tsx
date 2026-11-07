import React from "react";
import { MetricCardData } from "@/types";
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Users,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

interface MetricCardProps {
  metric: MetricCardData;
}

export function MetricCard({ metric }: MetricCardProps) {
  const isPositive = metric.changePercentage > 0;
  const isNeutral = metric.changePercentage === 0;

  // Icon mapping
  const renderIcon = () => {
    switch (metric.icon) {
      case "TrendingUp":
        return <TrendingUp className="w-5 h-5 text-brand-600" />;
      case "ShoppingBag":
        return <ShoppingBag className="w-5 h-5 text-emerald-600" />;
      case "Users":
        return <Users className="w-5 h-5 text-indigo-600" />;
      case "Clock":
        return <Clock className="w-5 h-5 text-amber-600" />;
      default:
        return <TrendingUp className="w-5 h-5 text-brand-600" />;
    }
  };

  const getIconBg = () => {
    switch (metric.icon) {
      case "TrendingUp":
        return "bg-brand-50 border-brand-100";
      case "ShoppingBag":
        return "bg-emerald-50 border-emerald-100";
      case "Users":
        return "bg-indigo-50 border-indigo-100";
      case "Clock":
        return "bg-amber-50 border-amber-100";
      default:
        return "bg-slate-50 border-slate-100";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {metric.title}
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {metric.formattedValue}
            </span>
          </div>
        </div>

        <div className={`p-2.5 rounded-xl border ${getIconBg()}`}>
          {renderIcon()}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md font-semibold text-[11px] ${
              metric.trend === "positive"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : metric.trend === "negative"
                ? "bg-rose-50 text-rose-700 border border-rose-200"
                : "bg-slate-50 text-slate-600 border border-slate-200"
            }`}
          >
            {metric.trend === "positive" ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : metric.trend === "negative" ? (
              <ArrowDownRight className="w-3.5 h-3.5" />
            ) : (
              <Minus className="w-3.5 h-3.5" />
            )}
            {Math.abs(metric.changePercentage)}%
          </span>
          <span className="text-slate-500 font-medium truncate max-w-[140px] sm:max-w-none">
            {metric.description}
          </span>
        </div>

        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          {metric.timeframe}
        </span>
      </div>
    </div>
  );
}

