'use client';

import { X } from 'lucide-react';

interface OrderDetailModalProps {
  order: {
    id: string;
    orderId: string;
    total: number;
    status: string;
    items: any;
    shipping: any;
    billing: any;
    createdAt: string;
    user: { name: string | null; email: string };
  };
  onClose: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const items = Array.isArray(order.items) ? order.items : [];
  const shipping = order.shipping as any;
  const billing = order.billing as any;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{order.orderId}</h2>
            <p className="text-sm text-gray-600">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status + Customer */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-800'
                }`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Customer</p>
              <p className="font-medium text-gray-900">{order.user.name || 'N/A'}</p>
              <p className="text-sm text-gray-600">{order.user.email}</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Items</h3>
            <div className="border rounded">
              {items.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center px-4 py-3 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {item.productName || item.name || `Product #${item.productId}`}
                    </p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              <div className="flex justify-between items-center px-4 py-3 bg-gray-50 font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-orange-600">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {shipping && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
                <div className="text-sm text-gray-700 bg-gray-50 rounded p-3">
                  <p>{shipping.firstName} {shipping.lastName}</p>
                  <p>{shipping.address}</p>
                  <p>
                    {shipping.city}, {shipping.state} {shipping.zipCode}
                  </p>
                  <p>{shipping.country}</p>
                </div>
              </div>
            )}
            {billing && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Billing Address</h3>
                <div className="text-sm text-gray-700 bg-gray-50 rounded p-3">
                  <p>{billing.firstName} {billing.lastName}</p>
                  <p>{billing.address}</p>
                  <p>
                    {billing.city}, {billing.state} {billing.zipCode}
                  </p>
                  <p>{billing.country}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
