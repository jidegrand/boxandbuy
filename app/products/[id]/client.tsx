'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/store/cart';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import Link from 'next/link';

interface ProductDetailClientProps {
  initialProduct: any;
}

export default function ProductDetailClient({ initialProduct }: ProductDetailClientProps) {
  const [mainImage, setMainImage] = useState<string>(initialProduct.imageUrl || '');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const product = initialProduct;
  const rating = 4.5;
  const reviewCount = Math.floor(Math.random() * 500) + 100;
  const inStock = true;

  const handleAddToCart = () => {
    if (!product) return;
    setIsAdding(true);
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-600">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/products" className="hover:text-orange-600">Products</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Images */}
          <div className="lg:col-span-1">
            {/* Main Image */}
            <div className="bg-white rounded-lg p-4 mb-4 border">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full aspect-square object-contain"
                />
              ) : (
                <div className="w-full aspect-square bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-gray-400 text-6xl">📦</span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {mainImage && (
              <div className="flex gap-2">
                <div 
                  className="w-16 h-16 bg-white rounded border-2 border-orange-600 p-1 cursor-pointer"
                  onClick={() => setMainImage(mainImage)}
                >
                  <img src={mainImage} alt="main" className="w-full h-full object-contain" />
                </div>
              </div>
            )}
          </div>

          {/* Middle: Product Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 border">
              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= rating 
                          ? 'fill-orange-400 text-orange-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-blue-600 cursor-pointer hover:text-orange-600">
                  {reviewCount} reviews
                </span>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ${parseFloat(product.price).toFixed(2)}
                </div>
                <p className="text-sm text-gray-600">
                  Get it{' '}
                  <span className="text-green-600 font-semibold">
                    FREE delivery Friday, February 14
                  </span>
                </p>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <p className={`font-semibold ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {inStock ? '✓ In Stock' : '✗ Out of Stock'}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Quantity:
                </label>
                <select 
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full p-2 border rounded bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(q => (
                    <option key={q} value={q}>Qty: {q}</option>
                  ))}
                </select>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isAdding || !inStock}
                className={`w-full py-3 rounded-lg font-bold text-lg mb-3 transition flex items-center justify-center gap-2 ${
                  isAdding || !inStock
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                <ShoppingCart size={20} />
                {isAdding ? 'Adding to Cart...' : 'Add to Cart'}
              </button>

              {/* Buy Now Button */}
              <button className="w-full py-3 rounded-lg font-bold text-lg bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition">
                Buy Now
              </button>

              {/* Wishlist */}
              <button className="w-full py-3 rounded-lg font-bold text-lg border border-gray-300 text-gray-900 hover:bg-gray-50 transition flex items-center justify-center gap-2 mt-3">
                <Heart size={20} />
                Add to Wishlist
              </button>
            </div>
          </div>

          {/* Right: Additional Info */}
          <div className="lg:col-span-1 space-y-4">
            {/* About this item */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-lg font-bold text-gray-900 mb-4">About this item</h3>
              <ul className="text-sm text-gray-600 space-y-3">
                <li className="flex gap-3">
                  <span className="text-green-600">✓</span>
                  <span>High-quality product sourced from trusted suppliers</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Fast and reliable shipping</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600">✓</span>
                  <span>30-day money-back guarantee</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Excellent customer support</span>
                </li>
              </ul>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Product Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product ID:</span>
                  <span className="font-semibold text-gray-900">{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-semibold text-gray-900">{product.reference || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">In Stock:</span>
                  <span className="font-semibold text-green-600">Yes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
