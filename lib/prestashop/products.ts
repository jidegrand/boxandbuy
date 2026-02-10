import { api, parseXML, extractProductName, buildImageUrl } from './client';
import { Product } from '@/types/product';

// Map PrestaShop category IDs to readable names
const CATEGORY_MAP: Record<string, string> = {
  '1': 'Home',
  '2': 'Electronics',
  '3': 'Computers',
  '4': 'Home & Kitchen',
  '5': 'Gaming',
  '6': 'Fashion',
  '7': 'Sports',
  '8': 'Books',
};

function getCategoryName(categoryId: any): string {
  if (!categoryId) return 'Electronics';
  const id = typeof categoryId === 'object' && categoryId._ ? categoryId._ : String(categoryId);
  return CATEGORY_MAP[id] || 'Electronics';
}

export async function getProducts(limit: number = 10): Promise<Product[]> {
  try {
    console.log('=== FETCHING PRODUCTS ===');

    // Step 1: Get list of product IDs
    const listResponse = await api.get('/products', {
      params: { limit }
    });

    const parsed = await parseXML(listResponse.data);

    // Extract product references
    let productRefs = parsed.prestashop?.products?.product || [];
    if (!Array.isArray(productRefs)) {
      productRefs = [productRefs];
    }

    console.log('Product IDs:', productRefs.map((p: any) => p.id));

    // Step 2: Fetch details for each product
    const products: Product[] = [];

    for (const ref of productRefs) {
      try {
        const product = await getProduct(ref.id);
        if (product) {
          products.push(product);
        }
      } catch (err) {
        console.error(`Error loading product ${ref.id}`);
      }
    }

    console.log('Products loaded:', products.length);
    return products;

  } catch (error: any) {
    console.error('ERROR:', error.message);
    return [];
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const detailResponse = await api.get(`/products/${id}`);
    const productData = await parseXML(detailResponse.data);

    const product = productData.prestashop?.product;
    if (!product) return null;

    return {
      id: product.id,
      name: extractProductName(product.name),
      price: product.price || '0',
      reference: product.reference || '',
      id_default_image: product.id_default_image || '',
      imageUrl: buildImageUrl(product.id, product.id_default_image),
      category: getCategoryName(product.id_category_default),
    };

  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}
