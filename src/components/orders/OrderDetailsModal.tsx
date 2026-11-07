"use client";

import React, { useState } from "react";
import { Order, FulfillmentStatus, PaymentStatus } from "@/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useOps } from "@/context/OpsContext";
import { updateOrderStatus } from "@/lib/api";
import {
  X,
  Package,
  CreditCard,
  Truck,
  MapPin,
  Calendar,
  AlertTriangle,
  Save,
  CheckCircle2,
} from "lucide-react";

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
  onOrderUpdated?: (updatedOrder: Order) => void;
}

export function OrderDetailsModal({ order, onClose, onOrderUpdated }: OrderDetailsModalProps) {
  const { addToast, triggerRefresh, requestConfirm } = useOps();
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedFulfillment, setSelectedFulfillment] = useState<FulfillmentStatus>(
    order ? order.fulfillmentStatus : "Processing"
  );
  const [selectedPayment, setSelectedPayment] = useState<PaymentStatus>(
    order ? order.paymentStatus : "Pending"
  );
  const [notes, setNotes] = useState<string>(order?.notes || "");

  if (!order) return null;

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const applyUpdate = async () => {
      try {
        setIsUpdating(true);
        const updated = await updateOrderStatus(order.id, {
          fulfillmentStatus: selectedFulfillment,
          paymentStatus: selectedPayment,
          notes: notes.trim(),
        });

        triggerRefresh();
        if (onOrderUpdated) {
          onOrderUpdated(updated);
        }

        addToast({
          type: "success",
          title: "Order Status Synchronized",
          message: `Order ${order.id} updated: Fulfillment is now "${selectedFulfillment}" and Payment is "${selectedPayment}".`,
        });
        onClose();
      } catch (err: any) {
        addToast({
          type: "error",
          title: "Update Failed",
          message: err?.message || "Could not persist order modifications.",
        });
      } finally {
        setIsUpdating(false);
      }
    };

    if (selectedFulfillment === "Cancelled") {
      requestConfirm({
        title: "Confirm Order Cancellation",
        message: `Are you sure you want to cancel order ${order.id}? This will flag the order as cancelled across the operations pipeline.`,
        confirmLabel: "Yes, Cancel Order",
        destructive: true,
        onConfirm: applyUpdate,
      });
    } else {
      await applyUpdate();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-details-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-3">
              <h2 id="order-details-title" className="text-xl font-bold text-slate-900">
                {order.id}
              </h2>
              <StatusBadge status={order.fulfillmentStatus} />
              <StatusBadge status={order.paymentStatus} />
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Placed on {formatDate(order.date, true)}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Customer Information
              </span>
              <p className="font-semibold text-slate-900">{order.customerName}</p>
              <p className="text-slate-600 text-xs mt-0.5">{order.customerEmail}</p>
              <span className="inline-block mt-2 text-[11px] font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                Priority: {order.priority}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Fulfillment Destination
              </span>
              <div className="flex items-start gap-1.5 text-xs text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                <span>{order.shippingAddress}</span>
              </div>
              {order.trackingNumber && (
                <div className="mt-2 text-xs flex items-center gap-1.5 text-slate-600">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Tracking: <strong className="text-slate-800">{order.trackingNumber}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Line items list */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-slate-500" />
              Order Items ({order.items.length})
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              {order.items.map((item) => (
                <div key={item.id} className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-[11px] text-slate-500">Category: {item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">{formatCurrency(item.totalPrice)}</p>
                    <p className="text-[11px] text-slate-500">
                      {item.quantity} &times; {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                </div>
              ))}
              <div className="p-3 bg-slate-50 flex items-center justify-between font-bold text-sm">
                <span>Total Order Amount</span>
                <span className="text-brand-700">{formatCurrency(order.amount)}</span>
              </div>
            </div>
          </div>

          {/* Interactive Status & Notes Form */}
          <form id="order-update-form" onSubmit={handleStatusUpdate} className="space-y-4 pt-2 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Update Operational Status
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fulfillment-select" className="block text-xs font-semibold text-slate-700 mb-1">
                  Fulfillment Status
                </label>
                <select
                  id="fulfillment-select"
                  value={selectedFulfillment}
                  onChange={(e) => setSelectedFulfillment(e.target.value as FulfillmentStatus)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label htmlFor="payment-select" className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Status
                </label>
                <select
                  id="payment-select"
                  value={selectedPayment}
                  onChange={(e) => setSelectedPayment(e.target.value as PaymentStatus)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="order-notes" className="block text-xs font-semibold text-slate-700 mb-1">
                Internal Operational Notes
              </label>
              <textarea
                id="order-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add special handling instructions, dispatcher notes, or audit memos..."
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
          >
            Close
          </button>
          <button
            type="submit"
            form="order-update-form"
            disabled={isUpdating}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isUpdating ? "Saving..." : "Save Order Status"}
          </button>
        </div>
      </div>
    </div>
  );
}

