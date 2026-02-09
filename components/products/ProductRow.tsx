import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductRowProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
}

export function ProductRow({ title, products, viewAllLink }: ProductRowProps) {
  return (
    <div className="bg-white p-6 rounded mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {viewAllLink && (
          <a href={viewAllLink} className="text-blue-600 hover:text-orange-600">
            See more →
          </a>
        )}
      </div>

      <div className="relative">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>

        {/* Scroll buttons */}
        <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg p-2 rounded-r hover:bg-gray-50 text-gray-700">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg p-2 rounded-l hover:bg-gray-50 text-gray-700">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
