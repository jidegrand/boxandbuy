'use client';

import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import type { StripePaymentElementOptions } from '@stripe/stripe-js';

interface PaymentFormProps {
  onSuccess: () => void;
  amount: number;
}

export function PaymentForm({ onSuccess, amount }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
        setIsProcessing(false);
      } else {
        onSuccess();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Payment failed';
      setErrorMessage(message);
      setIsProcessing(false);
    }
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: 'tabs',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded">
        <p className="text-sm text-gray-600 mb-1">Amount to pay</p>
        <p className="text-2xl font-bold text-gray-900">${amount.toFixed(2)}</p>
      </div>

      <PaymentElement options={paymentElementOptions} />

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`w-full py-3 rounded font-semibold text-white ${
          !stripe || isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Test card: 4242 4242 4242 4242 | Any future date | Any 3 digits
      </p>
    </form>
  );
}
