'use client';

import { useState, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/products/ProductCard';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface SearchResultsProps {
  products: Product[];
}

// Derive consistent attributes from product ID
function getProductRating(id: string): number {
  return 3 + (parseInt(id) % 3); // 3, 4, or 5
}

function getProductInStock(id: string): boolean {
  return parseInt(id) % 7 !== 0;
}

const PRICE_RANGES = [
  { label: 'Under $25', min: 0, max: 25 },
  { label: '$25 to $50', min: 25, max: 50 },
  { label: '$50 to $100', min: 50, max: 100 },
  { label: '$100 & Above', min: 100, max: Infinity },
];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Avg. Customer Review' },
  { value: 'newest', label: 'Newest Arrivals' },
];

export default function SearchResults({ products }: SearchResultsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Read filters from URL params
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || 'relevance';
  const inStockOnly = searchParams.get('inStock') === 'true';
  const minRating = searchParams.get('rating') || '';

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats).sort();
  }, [products]);

  // Update URL params helper
  const updateParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`/search?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let results = [...products];

    // Text search
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.reference.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (categoryParam) {
      results = results.filter(p => p.category === categoryParam);
    }

    // Price range filter
    if (minPrice) {
      results = results.filter(p => parseFloat(p.price) >= parseFloat(minPrice));
    }
    if (maxPrice) {
      results = results.filter(p => parseFloat(p.price) <= parseFloat(maxPrice));
    }

    // Stock filter
    if (inStockOnly) {
      results = results.filter(p => getProductInStock(p.id));
    }

    // Rating filter
    if (minRating) {
      const minR = parseInt(minRating);
      results = results.filter(p => getProductRating(p.id) >= minR);
    }

    // Sort
    switch (sort) {
      case 'price-asc':
        results.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-desc':
        results.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'rating':
        results.sort((a, b) => getProductRating(b.id) - getProductRating(a.id));
        break;
      case 'newest':
        results.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
    }

    return results;
  }, [products, query, categoryParam, minPrice, maxPrice, sort, inStockOnly, minRating]);

  // Count active filters
  const activeFilterCount = [categoryParam, minPrice || maxPrice, inStockOnly, minRating].filter(Boolean).length;

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    router.push(`/search?${params.toString()}`);
  };

  // Sidebar filter content (shared between desktop and mobile)
  const filterContent = (
    <div className="space-y-6">
      {/* Category filter */}
      <div>
        <h4 className="font-semibold mb-2 text-gray-900">Category</h4>
        <div className="space-y-2 text-sm">
          {categories.map(cat => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer hover:text-orange-600">
              <input
                type="checkbox"
                className="rounded"
                checked={categoryParam === cat}
                onChange={() => updateParams({ category: categoryParam === cat ? null : cat })}
              />
              <span className="text-gray-700">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price filter */}
      <div>
        <h4 className="font-semibold mb-2 text-gray-900">Price</h4>
        <div className="space-y-2 text-sm">
          {PRICE_RANGES.map(range => {
            const isActive = minPrice === String(range.min) && (range.max === Infinity ? !maxPrice : maxPrice === String(range.max));
            return (
              <label key={range.label} className="flex items-center gap-2 cursor-pointer hover:text-orange-600">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={isActive}
                  onChange={() => {
                    if (isActive) {
                      updateParams({ minPrice: null, maxPrice: null });
                    } else {
                      updateParams({
                        minPrice: String(range.min),
                        maxPrice: range.max === Infinity ? null : String(range.max),
                      });
                    }
                  }}
                />
                <span className="text-gray-700">{range.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Rating filter */}
      <div>
        <h4 className="font-semibold mb-2 text-gray-900">Customer Review</h4>
        <div className="space-y-2 text-sm">
          {[4, 3, 2, 1].map(stars => (
            <button
              key={stars}
              onClick={() => updateParams({ rating: minRating === String(stars) ? null : String(stars) })}
              className={`flex items-center gap-2 hover:text-orange-600 ${minRating === String(stars) ? 'text-orange-600 font-semibold' : 'text-gray-700'}`}
            >
              <span className="text-orange-400">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
              & Up
            </button>
          ))}
        </div>
      </div>

      {/* Stock filter */}
      <div>
        <h4 className="font-semibold mb-2 text-gray-900">Availability</h4>
        <label className="flex items-center gap-2 cursor-pointer hover:text-orange-600 text-sm">
          <input
            type="checkbox"
            className="rounded"
            checked={inStockOnly}
            onChange={() => updateParams({ inStock: inStockOnly ? null : 'true' })}
          />
          <span className="text-gray-700">In Stock Only</span>
        </label>
      </div>

      {/* Clear filters */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="w-full py-2 text-sm text-orange-600 hover:text-orange-700 font-semibold border border-orange-300 rounded hover:bg-orange-50"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6">
      {/* Breadcrumb */}
      <div className="text-xs sm:text-sm text-gray-600 mb-4">
        <Link href="/" className="hover:text-orange-600">Home</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900">
          {query ? `Search: "${query}"` : categoryParam ? categoryParam : 'All Products'}
        </span>
      </div>

      {/* Results header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
            {query ? `Results for "${query}"` : categoryParam ? categoryParam : 'All Products'}
          </h1>
          <p className="text-sm text-gray-600">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile filter button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-orange-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value === 'relevance' ? null : e.target.value })}
              className="appearance-none bg-white border rounded px-3 py-2 pr-8 text-sm text-gray-700 cursor-pointer hover:bg-gray-50"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Active filters pills */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {categoryParam && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
              {categoryParam}
              <button onClick={() => updateParams({ category: null })} className="hover:text-orange-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
              ${minPrice || '0'} - {maxPrice ? `$${maxPrice}` : 'Any'}
              <button onClick={() => updateParams({ minPrice: null, maxPrice: null })} className="hover:text-orange-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {minRating && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
              {minRating}★ & Up
              <button onClick={() => updateParams({ rating: null })} className="hover:text-orange-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {inStockOnly && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
              In Stock
              <button onClick={() => updateParams({ inStock: null })} className="hover:text-orange-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs text-orange-600 hover:text-orange-700 font-semibold px-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main content: sidebar + grid */}
      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="bg-white rounded-lg p-4 sticky top-4">
            <h3 className="font-bold text-base mb-4 text-gray-900">Filters</h3>
            {filterContent}
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-lg p-8 sm:p-12 text-center">
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No results found</p>
              <p className="text-gray-600 mb-6">
                {query
                  ? `We couldn't find any products matching "${query}".`
                  : 'No products match your current filters.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-2 border border-orange-400 text-orange-600 rounded font-semibold hover:bg-orange-50"
                  >
                    Clear Filters
                  </button>
                )}
                <Link
                  href="/"
                  className="px-6 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded font-semibold"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />
          {/* Drawer */}
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {filterContent}
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full mt-6 py-3 bg-orange-400 hover:bg-orange-500 text-white rounded font-semibold"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
