import { getProduct, getProducts } from '@/lib/prestashop/products';
import { notFound } from 'next/navigation';

// ISR: Regenerate every 5 minutes
export const revalidate = 300;

export async function generateStaticParams() {
  const products = await getProducts();
  
  return products.slice(0, 10).map((product: any) => ({
    id: String(product.id || product.id_product)
  }));
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

  const productName = product.name || product.name?.[0]?.value || 'Unnamed Product';
  const productPrice = product.price || product.wholesale_price || 'N/A';
  const productDesc = product.description || product.description_short || 'No description available';

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
            <div className="aspect-square bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-400">Product Image</span>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h2 className="text-3xl font-bold mb-4">{productName}</h2>
            
            <div className="mb-6">
              <p className="text-4xl font-bold text-blue-600">${productPrice}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {typeof productDesc === 'string' 
                  ? productDesc 
                  : productDesc?.[0]?.value || 'No description'}
              </p>
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
                  <strong>ID:</strong> {product.id || product.id_product}
                </li>
                <li>
                  <strong>SKU:</strong> {product.reference || 'N/A'}
                </li>
                <li>
                  <strong>Status:</strong> {product.active ? '✅ Active' : '❌ Inactive'}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <details className="mt-8 bg-gray-50 p-4 rounded">
          <summary className="font-bold cursor-pointer">
            📋 Raw Product Data
          </summary>
          <pre className="mt-4 bg-gray-100 p-4 rounded overflow-auto text-xs">
            {JSON.stringify(product, null, 2)}
          </pre>
        </details>
      </main>
    </div>
  );
}
