'use client';

import { Product } from '@/types/product';
import { Star } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { useState } from 'react';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);
  const rating = 4.5;
  const reviewCount = Math.floor(Math.random() * 1000) + 100;

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product);
    setTimeout(() => setIsAdding(false), 1000);
  };

  if (compact) {
    return (
      <Link href={`/products/${product.id}`}>
        <div className="bg-white border rounded p-3 hover:shadow-lg transition cursor-pointer group">
          <div className="relative h-32 mb-2">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-105 transition"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400 text-3xl">📦</span>
              </div>
            )}
          </div>
          <h3 className="text-sm mb-1 line-clamp-2 hover:text-orange-600 text-gray-900 font-medium">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-1">
            {[1,2,3,4,5].map(star => (
              <Star
                key={star}
                className={`w-3 h-3 ${star <= rating ? 'fill-orange-400 text-orange-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <p className="text-lg font-bold text-gray-900">${parseFloat(product.price).toFixed(2)}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white border rounded p-4 hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="relative h-48 mb-3 overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-4xl">📦</span>
            </div>
          )}
          
          {Math.random() > 0.5 && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded font-bold">
              prime
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm mb-2 line-clamp-2 hover:text-orange-600 text-gray-900">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mb-2">
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
            <span className="text-sm text-blue-600 hover:text-orange-600">
              {reviewCount}
            </span>
          </div>

          <div className="mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-medium text-gray-900">
                ${parseFloat(product.price).toFixed(2)}
              </span>
              {Math.random() > 0.5 && (
                <span className="text-sm text-gray-500 line-through">
                  ${(parseFloat(product.price) * 1.2).toFixed(2)}
                </span>
              )}
            </div>
            {Math.random() > 0.5 && (
              <p className="text-xs text-green-700">
                Save ${(parseFloat(product.price) * 0.2).toFixed(2)} (20%)
              </p>
            )}
          </div>

          <p className="text-xs text-gray-600 mb-3">
            FREE delivery <span className="font-semibold">Tomorrow</span>
          </p>

          {Math.random() > 0.7 ? (
            <p className="text-xs text-red-600 mb-2">Only 3 left in stock</p>
          ) : (
            <p className="text-xs text-green-700 mb-2">In Stock</p>
          )}

          <button 
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart();
            }}
            disabled={isAdding}
            className={`w-full py-2 rounded text-sm font-medium transition ${
              isAdding 
                ? 'bg-green-500 text-white cursor-not-allowed' 
                : 'bg-orange-400 hover:bg-orange-500 text-white'
            }`}
          >
            {isAdding ? '✓ Added!' : 'Add to Cart'}
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-2">Ref: {product.reference}</p>
      </div>
    </Link>
  );
}