import { getProducts } from '@/lib/prestashop/products';
import { HeroBanner } from '@/components/layout/HeroBanner';
import { CategoryCards } from '@/components/layout/CategoryCards';
import { ProductRow } from '@/components/products/ProductRow';
import { ProductCard } from '@/components/products/ProductCard';

export default async function Home() {
  const products = await getProducts(10);

  return (
    <div className="bg-gray-100">
      {/* Hero Banner */}
      <HeroBanner />

      <div className="container mx-auto px-4 py-6">
        {/* Category Cards */}
        <CategoryCards />

        {/* Today's Deals */}
        <ProductRow
          title="Today's Deals"
          products={products}
          viewAllLink="/deals"
        />

        {/* Top Rated Products */}
        <ProductRow
          title="Top rated in Electronics"
          products={products}
          viewAllLink="/electronics"
        />

        {/* Inspired by your browsing history */}
        <div className="bg-white p-6 rounded mb-6">
          <h2 className="text-2xl font-bold mb-4">Inspired by your browsing history</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </div>

        {/* Main Product Grid */}
        <div className="bg-white p-6 rounded">
          <h2 className="text-2xl font-bold mb-4">Results for &quot;electronics&quot;</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
