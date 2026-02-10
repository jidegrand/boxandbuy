'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart';
import { Star, Lock } from 'lucide-react';
import Link from 'next/link';

interface ProductDetailClientProps {
  initialProduct: any;
}

export default function ProductDetailClient({ initialProduct }: ProductDetailClientProps) {
  const router = useRouter();
  const product = initialProduct;
  const price = parseFloat(product.price);
  const originalPrice = price * 1.25;
  const savePercent = 20;
  const saveAmount = originalPrice - price;

  // Image state — use real image + placeholder angles
  const images = product.imageUrl
    ? [product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl]
    : [];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const mainImage = images[selectedImageIndex] || '';

  // Zoom state
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Cart state
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // Placeholder data
  const rating = 4.3;
  const reviewCount = 337;
  const inStock = true;

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    setIsAdding(true);
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setTimeout(() => setIsAdding(false), 1500);
  }, [product, quantity, addItem]);

  const handleBuyNow = useCallback(() => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    router.push('/checkout');
  }, [product, quantity, addItem, router]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  }, []);

  // Delivery date (5 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const deliveryDateStr = deliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Fast delivery date (tomorrow)
  const fastDate = new Date();
  fastDate.setDate(fastDate.getDate() + 1);
  const fastDateStr = fastDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="max-w-[1500px] mx-auto px-4 py-2">
          <div className="text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-600 hover:underline">
              Home
            </Link>
            <span className="mx-1">›</span>
            <Link href={`/search?category=${product.category || ''}`} className="hover:text-orange-600 hover:underline">
              {product.category || 'Electronics'}
            </Link>
            <span className="mx-1">›</span>
            <span className="text-gray-500 line-clamp-1 inline">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-[1500px] mx-auto px-4 py-4 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_300px] xl:grid-cols-[auto_1fr_340px] gap-4 lg:gap-6">

          {/* ==================== COLUMN 1: Image Gallery ==================== */}
          <div className="lg:flex lg:gap-3">
            {/* Vertical thumbnails — desktop only */}
            {images.length > 0 && (
              <div className="hidden lg:flex flex-col gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onMouseEnter={() => setSelectedImageIndex(index)}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-[50px] h-[50px] border rounded p-0.5 flex-shrink-0 transition ${
                      selectedImageIndex === index
                        ? 'border-orange-500 shadow-sm'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image with zoom */}
            <div className="relative">
              <div
                ref={imageContainerRef}
                className="relative bg-white border border-gray-200 rounded-lg overflow-hidden cursor-crosshair"
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMove}
                style={{ width: '100%', maxWidth: '480px' }}
              >
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full aspect-square object-contain p-4"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full aspect-square bg-gray-50 flex items-center justify-center">
                    <span className="text-gray-300 text-7xl">📦</span>
                  </div>
                )}
              </div>

              {/* Zoom overlay — desktop only */}
              {isZooming && mainImage && (
                <div
                  className="hidden lg:block absolute top-0 left-[calc(100%+12px)] w-[400px] h-[400px] border border-gray-200 rounded-lg overflow-hidden bg-white z-30 shadow-xl"
                >
                  <img
                    src={mainImage}
                    alt="Zoomed view"
                    className="absolute"
                    style={{
                      width: '200%',
                      height: '200%',
                      objectFit: 'contain',
                      left: `${-zoomPosition.x * 2 + 100}%`,
                      top: `${-zoomPosition.y * 2 + 100}%`,
                    }}
                    draggable={false}
                  />
                </div>
              )}

              {/* Mobile horizontal thumbnails */}
              {images.length > 0 && (
                <div className="flex lg:hidden gap-2 mt-3 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-[52px] h-[52px] border rounded p-0.5 flex-shrink-0 ${
                        selectedImageIndex === index
                          ? 'border-orange-500'
                          : 'border-gray-200'
                      }`}
                    >
                      <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ==================== COLUMN 2: Product Info ==================== */}
          <div className="min-w-0">
            {/* Title */}
            <h1 className="text-lg sm:text-xl lg:text-2xl text-gray-900 leading-tight mb-1">
              {product.name}
            </h1>

            {/* Brand / Store link */}
            <p className="text-sm mb-2">
              <span className="text-gray-600">Visit the </span>
              <Link href="/" className="text-blue-600 hover:text-orange-600 hover:underline">
                Box&Buy Store
              </Link>
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-sm text-blue-600">{rating}</span>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.floor(rating)
                        ? 'fill-orange-400 text-orange-400'
                        : star <= rating + 0.5
                        ? 'fill-orange-400 text-orange-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <Link href="#reviews" className="text-sm text-blue-600 hover:text-orange-600 hover:underline">
                ({reviewCount})
              </Link>
              <span className="text-sm text-gray-400">|</span>
              <span className="text-sm text-blue-600">100+ bought in past month</span>
            </div>

            <hr className="my-3 border-gray-200" />

            {/* Price section */}
            <div className="mb-3">
              <div className="flex items-baseline gap-1">
                <span className="text-[13px] text-gray-900 relative -top-[8px]">$</span>
                <span className="text-[28px] font-medium text-gray-900 leading-none">
                  {Math.floor(price)}
                </span>
                <span className="text-[13px] text-gray-900 relative -top-[8px]">
                  {(price % 1).toFixed(2).substring(1)}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm">
                <span className="text-gray-500">List Price:</span>
                <span className="text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
              </div>
              <div className="text-sm mt-1">
                <span className="text-gray-600">Save: </span>
                <span className="text-red-700">${saveAmount.toFixed(2)} ({savePercent}%)</span>
              </div>
            </div>

            {/* FREE Returns */}
            <p className="text-sm mb-1">
              <span className="text-blue-600 hover:text-orange-600 cursor-pointer hover:underline">
                FREE Returns
              </span>
            </p>

            {/* Coupon */}
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-green-700 text-white text-xs font-bold px-2 py-0.5 rounded-sm">
                Coupon:
              </span>
              <span className="text-sm text-gray-900">
                Apply 10% coupon
              </span>
            </div>

            <hr className="my-3 border-gray-200" />

            {/* Product details table */}
            <div className="mb-4">
              <h2 className="font-bold text-gray-900 mb-2">Product details</h2>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-1.5 pr-4 text-gray-600 font-medium w-[140px]">Brand</td>
                    <td className="py-1.5 text-gray-900">Box&Buy</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-1.5 pr-4 text-gray-600 font-medium">SKU</td>
                    <td className="py-1.5 text-gray-900">{product.reference || 'N/A'}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-1.5 pr-4 text-gray-600 font-medium">Category</td>
                    <td className="py-1.5 text-gray-900">{product.category || 'General'}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-1.5 pr-4 text-gray-600 font-medium">Item ID</td>
                    <td className="py-1.5 text-gray-900">{product.id}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 pr-4 text-gray-600 font-medium">Condition</td>
                    <td className="py-1.5 text-gray-900">New</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <hr className="my-3 border-gray-200" />

            {/* About this item */}
            <div className="mb-4">
              <h2 className="font-bold text-gray-900 mb-2">About this item</h2>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
                <li>High-quality product sourced from trusted and verified suppliers</li>
                <li>Designed for durability and long-lasting performance</li>
                <li>Fast and reliable shipping with tracking available on all orders</li>
                <li>30-day hassle-free money-back guarantee for complete peace of mind</li>
                <li>Excellent customer support available 7 days a week</li>
              </ul>
            </div>
          </div>

          {/* ==================== COLUMN 3: Buy Box ==================== */}
          <div className="lg:self-start">
            <div className="border border-gray-300 rounded-lg p-5 lg:sticky lg:top-4">
              {/* Price in buy box */}
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-[13px] text-gray-900 relative -top-[8px]">$</span>
                <span className="text-[28px] font-medium text-gray-900 leading-none">
                  {Math.floor(price)}
                </span>
                <span className="text-[13px] text-gray-900 relative -top-[8px]">
                  {(price % 1).toFixed(2).substring(1)}
                </span>
              </div>

              {/* Delivery info */}
              <p className="text-sm text-gray-900 mb-1">
                FREE delivery{' '}
                <span className="font-bold">{deliveryDateStr}</span>
              </p>
              <p className="text-sm text-gray-600 mb-3">
                Or fastest delivery{' '}
                <span className="font-bold text-gray-900">{fastDateStr}</span>
              </p>

              {/* Stock status */}
              <p className={`text-lg font-medium mb-4 ${inStock ? 'text-green-700' : 'text-red-600'}`}>
                {inStock ? 'In Stock' : 'Out of Stock'}
              </p>

              {/* Quantity */}
              <div className="mb-4">
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full py-1.5 px-3 border border-gray-300 rounded-lg text-sm bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((q) => (
                    <option key={q} value={q}>
                      Qty: {q}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                disabled={isAdding || !inStock}
                className={`w-full py-2 rounded-full font-medium text-sm mb-2 transition ${
                  isAdding
                    ? 'bg-green-500 text-white'
                    : !inStock
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 border border-[#FCD200]'
                }`}
              >
                {isAdding ? '✓ Added to Cart' : 'Add to Cart'}
              </button>

              {/* Buy Now button */}
              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                className={`w-full py-2 rounded-full font-medium text-sm mb-4 transition ${
                  !inStock
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#FFA41C] hover:bg-[#FA8900] text-gray-900 border border-[#FF8F00]'
                }`}
              >
                Buy Now
              </button>

              <hr className="border-gray-200 mb-3" />

              {/* Seller info */}
              <div className="text-xs text-gray-600 space-y-1 mb-3">
                <div className="flex justify-between">
                  <span>Ships from</span>
                  <span className="text-gray-900">Box&Buy</span>
                </div>
                <div className="flex justify-between">
                  <span>Sold by</span>
                  <span className="text-blue-600 hover:text-orange-600 cursor-pointer hover:underline">
                    Box&Buy
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Returns</span>
                  <span className="text-blue-600 hover:text-orange-600 cursor-pointer hover:underline">
                    30-day refund/replacement
                  </span>
                </div>
              </div>

              <hr className="border-gray-200 mb-3" />

              {/* Secure transaction */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Lock className="w-3.5 h-3.5" />
                <span>Secure transaction</span>
              </div>

              {/* Gift option */}
              <label className="flex items-center gap-2 mt-3 text-sm text-gray-900 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-orange-500" />
                Add a gift receipt
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
