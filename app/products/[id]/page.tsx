import { getProduct, getProducts } from '@/lib/prestashop/products';
import { notFound } from 'next/navigation';
import ProductDetailClient from './client';

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

  return <ProductDetailClient initialProduct={product} />;
}
