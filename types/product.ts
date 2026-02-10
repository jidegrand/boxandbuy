export interface Product {
  id: string;
  name: string;
  price: string;
  reference: string;
  id_default_image: string;
  imageUrl: string | null;
  category?: string;
}

export interface ProductListResponse {
  prestashop: {
    products: {
      product: Array<{
        id: string;
        'xlink:href': string;
      }>;
    };
  };
}

export interface ProductDetailResponse {
  prestashop: {
    product: {
      id: string;
      name: any;
      price: string;
      reference: string;
      id_default_image: string;
    };
  };
}
