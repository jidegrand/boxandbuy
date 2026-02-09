'use server';

import { createOrder } from '@/lib/prestashop/orders';
import { Order } from '@/types/checkout';

export async function placeOrder(orderData: Order) {
  return await createOrder(orderData);
}
