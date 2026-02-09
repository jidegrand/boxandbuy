'use client';

import { useCartStore } from '@/lib/store/cart';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg p-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <Link
              href="/"
              className="inline-block bg-orange-400 hover:bg-orange-500 text-white px-8 py-3 rounded font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="bg-white rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Product Image */}
                <div className="w-20 h-20 sm:w-32 sm:h-32 flex-shrink-0 mx-auto sm:mx-0">
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-3xl sm:text-4xl">📦</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 text-gray-900">{item.product.name}</h3>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900 sm:hidden">
                      ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Ref: {item.product.reference}</p>
                  <p className="text-green-700 text-xs sm:text-sm mb-2 sm:mb-4">In Stock</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 sm:p-2 hover:bg-gray-100"
                      >
                        <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <span className="px-3 py-1.5 sm:px-4 sm:py-2 border-x text-sm sm:text-base text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 sm:p-2 hover:bg-gray-100"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-600 hover:text-red-700 flex items-center gap-1 sm:gap-2 text-sm"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      Remove
                    </button>
                  </div>
                </div>

                {/* Price - hidden on mobile, shown inline above */}
                <div className="text-right hidden sm:block">
                  <p className="text-2xl font-bold text-gray-900">
                    ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    ${item.product.price} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-4 sm:p-6 sticky top-4">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)
                  </span>
                  <span className="font-semibold text-gray-900">${totalPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>

                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-orange-600">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded font-semibold mb-3 text-center"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/"
                className="block text-center text-blue-600 hover:text-orange-600"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
