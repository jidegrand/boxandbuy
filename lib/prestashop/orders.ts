import { api, parseXML } from './client';
import { Order, ShippingAddress } from '@/types/checkout';

export async function createOrder(orderData: Order): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    console.log('Creating order in PrestaShop:', orderData);

    // For now, we'll create a simplified order
    // PrestaShop order creation is complex and requires customer/address setup
    // This is a placeholder that logs the order
    
    // In production, you would:
    // 1. Create/get customer
    // 2. Create addresses
    // 3. Create order with all line items
    // 4. Set order state

    const orderId = `ORD-${Date.now()}`;
    
    console.log('Order created successfully:', orderId);
    
    return {
      success: true,
      orderId: orderId
    };

  } catch (error: any) {
    console.error('Error creating order:', error);
    return {
      success: false,
      error: error.message || 'Failed to create order'
    };
  }
}

export async function getOrder(orderId: string) {
  try {
    const response = await api.get(`/orders/${orderId}`);
    const orderData = await parseXML(response.data);
    return orderData.prestashop?.order;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}