'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/store/cart';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { placeOrder } from './actions';
import { ShippingAddress, BillingAddress } from '@/types/checkout';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe/client';
import { PaymentForm } from '@/components/checkout/PaymentForm';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [currentStep, setCurrentStep] = useState<'info' | 'payment'>('info');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [shipping, setShipping] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Canada',
  });

  const [billing, setBilling] = useState<BillingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Canada',
    sameAsShipping: true,
  });

  const handleShippingChange = (field: keyof ShippingAddress, value: string) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
  };

  const handleBillingChange = (field: keyof BillingAddress, value: string) => {
    setBilling((prev) => ({ ...prev, [field]: value }));
  };

  const handleContinueToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const billingAddress: BillingAddress = sameAsShipping
        ? { ...shipping, sameAsShipping: true }
        : { ...billing, sameAsShipping: false };

      const orderData = {
        total: getTotalPrice(),
        status: 'pending',
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: parseFloat(item.product.price),
        })),
        shipping,
        billing: billingAddress,
      };

      const result = await placeOrder(orderData, session?.user?.id);

      if (result.success) {
        setOrderId(result.orderId || null);

        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: getTotalPrice(),
            orderId: result.orderId,
          }),
        });

        const data = await response.json();

        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
          setCurrentStep('payment');
        } else {
          alert('Failed to initialize payment: ' + (data.error || 'Unknown error'));
        }
      } else {
        alert('Order failed: ' + result.error);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    router.push(`/checkout/success?orderId=${orderId}`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg p-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Add some products to checkout!</p>
            <a
              href="/"
              className="inline-block bg-orange-400 hover:bg-orange-500 text-white px-8 py-3 rounded font-semibold"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = getTotalPrice();

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">Checkout</h1>

        {/* Progress Indicator */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className={`flex items-center gap-2 ${currentStep === 'info' ? 'text-orange-600 font-bold' : 'text-green-600'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${currentStep === 'info' ? 'bg-orange-500' : 'bg-green-500'}`}>
              {currentStep === 'info' ? '1' : '\u2713'}
            </span>
            <span className="text-gray-900">Shipping Info</span>
          </div>
          <div className="h-px w-12 bg-gray-300" />
          <div className={`flex items-center gap-2 ${currentStep === 'payment' ? 'text-orange-600 font-bold' : 'text-gray-400'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${currentStep === 'payment' ? 'bg-orange-500' : 'bg-gray-300'}`}>
              2
            </span>
            <span className={currentStep === 'payment' ? 'text-gray-900' : 'text-gray-400'}>Payment</span>
          </div>
        </div>

        {currentStep === 'info' ? (
          <form onSubmit={handleContinueToPayment}>
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Forms */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Information */}
                <div className="bg-white rounded-lg p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">Shipping Information</h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">First Name *</label>
                      <input
                        type="text"
                        required
                        value={shipping.firstName}
                        onChange={(e) => handleShippingChange('firstName', e.target.value)}
                        className="w-full border rounded px-3 py-2 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={shipping.lastName}
                        onChange={(e) => handleShippingChange('lastName', e.target.value)}
                        className="w-full border rounded px-3 py-2 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Email *</label>
                      <input
                        type="email"
                        required
                        value={shipping.email}
                        onChange={(e) => handleShippingChange('email', e.target.value)}
                        className="w-full border rounded px-3 py-2 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={shipping.phone}
                        onChange={(e) => handleShippingChange('phone', e.target.value)}
                        className="w-full border rounded px-3 py-2 text-gray-900"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-gray-700">Address *</label>
                      <input
                        type="text"
                        required
                        value={shipping.address}
                        onChange={(e) => handleShippingChange('address', e.target.value)}
                        className="w-full border rounded px-3 py-2 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">City *</label>
                      <input
                        type="text"
                        required
                        value={shipping.city}
                        onChange={(e) => handleShippingChange('city', e.target.value)}
                        className="w-full border rounded px-3 py-2 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">State/Province *</label>
                      <input
                        type="text"
                        required
                        value={shipping.state}
                        onChange={(e) => handleShippingChange('state', e.target.value)}
                        className="w-full border rounded px-3 py-2 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">ZIP/Postal Code *</label>
                      <input
                        type="text"
                        required
                        value={shipping.zipCode}
                        onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                        className="w-full border rounded px-3 py-2 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Country *</label>
                      <select
                        required
                        value={shipping.country}
                        onChange={(e) => handleShippingChange('country', e.target.value)}
                        className="w-full border rounded px-3 py-2 text-gray-900"
                      >
                        <option value="Canada">Canada</option>
                        <option value="United States">United States</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Billing Information */}
                <div className="bg-white rounded-lg p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Billing Information</h2>
                    <label className="flex items-center gap-2 text-gray-700">
                      <input
                        type="checkbox"
                        checked={sameAsShipping}
                        onChange={(e) => setSameAsShipping(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Same as shipping</span>
                    </label>
                  </div>

                  {!sameAsShipping && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">First Name *</label>
                        <input
                          type="text"
                          required
                          value={billing.firstName}
                          onChange={(e) => handleBillingChange('firstName', e.target.value)}
                          className="w-full border rounded px-3 py-2 text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Last Name *</label>
                        <input
                          type="text"
                          required
                          value={billing.lastName}
                          onChange={(e) => handleBillingChange('lastName', e.target.value)}
                          className="w-full border rounded px-3 py-2 text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Email *</label>
                        <input
                          type="email"
                          required
                          value={billing.email}
                          onChange={(e) => handleBillingChange('email', e.target.value)}
                          className="w-full border rounded px-3 py-2 text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Phone *</label>
                        <input
                          type="tel"
                          required
                          value={billing.phone}
                          onChange={(e) => handleBillingChange('phone', e.target.value)}
                          className="w-full border rounded px-3 py-2 text-gray-900"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1 text-gray-700">Address *</label>
                        <input
                          type="text"
                          required
                          value={billing.address}
                          onChange={(e) => handleBillingChange('address', e.target.value)}
                          className="w-full border rounded px-3 py-2 text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">City *</label>
                        <input
                          type="text"
                          required
                          value={billing.city}
                          onChange={(e) => handleBillingChange('city', e.target.value)}
                          className="w-full border rounded px-3 py-2 text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">State/Province *</label>
                        <input
                          type="text"
                          required
                          value={billing.state}
                          onChange={(e) => handleBillingChange('state', e.target.value)}
                          className="w-full border rounded px-3 py-2 text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">ZIP/Postal Code *</label>
                        <input
                          type="text"
                          required
                          value={billing.zipCode}
                          onChange={(e) => handleBillingChange('zipCode', e.target.value)}
                          className="w-full border rounded px-3 py-2 text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Country *</label>
                        <select
                          required
                          value={billing.country}
                          onChange={(e) => handleBillingChange('country', e.target.value)}
                          className="w-full border rounded px-3 py-2 text-gray-900"
                        >
                          <option value="Canada">Canada</option>
                          <option value="United States">United States</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg p-4 sm:p-6 sticky top-4">
                  <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">Order Summary</h2>

                  <div className="space-y-3 mb-4">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm text-gray-800">
                        <span className="flex-1">
                          {item.product.name} x {item.quantity}
                        </span>
                        <span className="font-semibold text-gray-900">
                          ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Subtotal</span>
                      <span className="font-semibold text-gray-900">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Shipping</span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span className="text-gray-900">Total</span>
                      <span className="text-orange-600">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={`w-full py-3 rounded font-semibold text-white ${
                      isProcessing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-orange-400 hover:bg-orange-500'
                    }`}
                  >
                    {isProcessing ? 'Processing...' : 'Continue to Payment'}
                  </button>

                  <p className="text-xs text-gray-500 mt-4 text-center">
                    By placing your order, you agree to our terms and conditions
                  </p>
                </div>
              </div>
            </div>
          </form>
        ) : (
          /* Step 2: Payment */
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">Payment Details</h2>

                {clientSecret && (
                  <Elements
                    stripe={getStripe()}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                        variables: {
                          colorPrimary: '#f97316',
                        },
                      },
                    }}
                  >
                    <PaymentForm
                      onSuccess={handlePaymentSuccess}
                      amount={totalPrice}
                    />
                  </Elements>
                )}

                <button
                  type="button"
                  onClick={() => setCurrentStep('info')}
                  className="mt-4 text-sm text-orange-600 hover:text-orange-700 underline"
                >
                  &larr; Back to shipping info
                </button>
              </div>
            </div>

            {/* Right Column - Order Summary (repeated for payment step) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-4 sm:p-6 sticky top-4">
                <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">Order Summary</h2>

                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm text-gray-800">
                      <span className="flex-1">
                        {item.product.name} x {item.quantity}
                      </span>
                      <span className="font-semibold text-gray-900">
                        ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="font-semibold text-gray-900">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span className="text-gray-900">Total</span>
                    <span className="text-orange-600">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {orderId && (
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Order ID: {orderId}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
