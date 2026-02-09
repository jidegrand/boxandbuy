'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg p-8 text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />

          <h1 className="text-3xl font-bold mb-2 text-gray-900">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We&apos;ve received it and will process it soon.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-1">Order Number</p>
            <p className="text-2xl font-bold text-orange-600">{orderId}</p>
          </div>

          <div className="space-y-3 text-sm text-gray-600 mb-8">
            <p>A confirmation email has been sent to your email address</p>
            <p>You can track your order status in your account</p>
            <p>Estimated delivery: 3-5 business days</p>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-orange-400 hover:bg-orange-500 text-white rounded font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
