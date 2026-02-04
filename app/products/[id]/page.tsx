import { getProduct, getProducts } from '@/lib/prestashop/products';
import { notFound } from 'next/navigation';

// ISR: Regenerate every 5 minutes
export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const products = await getProducts();

    return products
      .filter((product) => product.id)
      .slice(0, 10)
      .map((product) => ({
        id: String(product.id)
      }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function ProductPage({
  params
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-blue-600 text-white p-8">
        <h1 className="text-4xl font-bold">Product Details</h1>
      </header>

      {/* Product Content */}
      <main className="p-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-gray-100 rounded-lg p-8">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="aspect-square bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-400 text-6xl">📦</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h2 className="text-3xl font-bold mb-4">{product.name}</h2>

            <div className="mb-6">
              <p className="text-4xl font-bold text-blue-600">${parseFloat(product.price).toFixed(2)}</p>
            </div>

            <div className="mb-6">
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition">
                Add to Cart
              </button>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-bold mb-2">Product Details</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  <strong>ID:</strong> {product.id}
                </li>
                <li>
                  <strong>SKU:</strong> {product.reference || 'N/A'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
