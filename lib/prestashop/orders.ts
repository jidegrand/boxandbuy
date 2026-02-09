import { api, parseXML } from './client';
import { Order } from '@/types/checkout';
import { prisma } from '@/lib/prisma';

export async function createOrder(
  orderData: Order,
  userId?: string
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const orderId = `ORD-${Date.now()}`;

    // Save to database if user is logged in
    if (userId) {
      await prisma.order.create({
        data: {
          userId: userId,
          orderId: orderId,
          total: orderData.total,
          status: orderData.status,
          items: orderData.items as any,
          shipping: orderData.shipping as any,
          billing: orderData.billing as any,
        },
      });
    }

    console.log('Order created:', orderId);

    return {
      success: true,
      orderId: orderId,
    };
  } catch (error: any) {
    console.error('Error creating order:', error);
    return {
      success: false,
      error: error.message || 'Failed to create order',
    };
  }
}

export async function getUserOrders(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
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
