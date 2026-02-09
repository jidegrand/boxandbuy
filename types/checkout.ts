export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface BillingAddress extends ShippingAddress {
  sameAsShipping?: boolean;
}

export interface CheckoutData {
  shipping: ShippingAddress;
  billing: BillingAddress;
}

export interface Order {
  id?: string;
  orderNumber?: string;
  total: number;
  status: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  shipping: ShippingAddress;
  billing: BillingAddress;
  createdAt?: Date;
}