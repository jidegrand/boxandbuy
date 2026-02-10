import { Suspense } from 'react';
import { getProducts } from '@/lib/prestashop/products';
import SearchResults from './SearchResults';

export default async function SearchPage() {
  const products = await getProducts(50);

  return (
    <div className="min-h-screen bg-gray-100">
      <Suspense fallback={
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">Loading products...</p>
        </div>
      }>
        <SearchResults products={products} />
      </Suspense>
    </div>
  );
}
