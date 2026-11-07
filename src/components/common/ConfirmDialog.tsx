"use client";

import React, { useEffect, useRef } from "react";
import { useOps } from "@/context/OpsContext";
import { AlertCircle, HelpCircle } from "lucide-react";

export function ConfirmDialog() {
  const { confirmDialog, closeConfirm } = useOps();
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (confirmDialog) {
      confirmButtonRef.current?.focus();
    }
  }, [confirmDialog]);

  if (!confirmDialog) return null;

  const { title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", destructive, onConfirm } = confirmDialog;

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } finally {
      closeConfirm();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-full flex-shrink-0 ${
              destructive ? "bg-rose-100 text-rose-600" : "bg-brand-100 text-brand-700"
            }`}
          >
            {destructive ? <AlertCircle className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
          </div>
          <div className="flex-1">
            <h3 id="confirm-dialog-title" className="text-lg font-bold text-slate-900">
              {title}
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={closeConfirm}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={handleConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
              destructive
                ? "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500"
                : "bg-brand-600 hover:bg-brand-700 focus:ring-brand-500"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

