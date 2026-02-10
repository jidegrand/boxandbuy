import { prisma } from '@/lib/prisma';

// ====== Dashboard Stats ======

export async function getDashboardStats() {
  const [orderStats, customerCount, recentOrders] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      _count: true,
      _avg: { total: true },
    }),
    prisma.user.count({ where: { role: 'user' } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  return {
    totalRevenue: orderStats._sum.total || 0,
    totalOrders: orderStats._count,
    totalCustomers: customerCount,
    avgOrderValue: orderStats._avg.total || 0,
    recentOrders,
  };
}

// ====== Revenue Chart Data ======

export async function getRevenueByPeriod(days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: startDate } },
    select: { total: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  const revenueMap = new Map<string, number>();
  orders.forEach((order) => {
    const dateKey = order.createdAt.toISOString().split('T')[0];
    revenueMap.set(dateKey, (revenueMap.get(dateKey) || 0) + order.total);
  });

  const result: Array<{ date: string; revenue: number }> = [];
  const current = new Date(startDate);
  const today = new Date();
  while (current <= today) {
    const dateKey = current.toISOString().split('T')[0];
    result.push({ date: dateKey, revenue: revenueMap.get(dateKey) || 0 });
    current.setDate(current.getDate() + 1);
  }

  return result;
}

// ====== Orders ======

export async function getAllOrders(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  const { page = 1, limit = 20, status, search } = params;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (status && status !== 'all') {
    where.status = status;
  }
  if (search) {
    where.OR = [
      { orderId: { contains: search, mode: 'insensitive' } },
      { user: { name: { contains: search, mode: 'insensitive' } } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total, pages: Math.ceil(total / limit) };
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}

export async function updateOrderStatus(id: string, status: string) {
  return prisma.order.update({
    where: { id },
    data: { status },
  });
}

// ====== Customers ======

export async function getAllCustomers(params: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const { page = 1, limit = 20, search } = params;
  const skip = (page - 1) * limit;

  const where: any = { role: 'user' };
  if (search) {
    where.AND = [
      {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      },
    ];
  }

  const [customers, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: { select: { orders: true } },
        orders: {
          select: { total: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    customers: customers.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      createdAt: c.createdAt,
      totalSpent: c.orders.reduce((sum, o) => sum + o.total, 0),
      orderCount: c._count.orders,
    })),
    total,
    pages: Math.ceil(total / limit),
  };
}

// ====== Top Products ======

export async function getTopProducts(limit: number = 10) {
  const orders = await prisma.order.findMany({
    select: { items: true },
  });

  const productMap = new Map<string, { name: string; quantity: number; revenue: number }>();

  orders.forEach((order) => {
    const items = order.items as Array<{
      productId: string;
      productName: string;
      quantity: number;
      price: number;
    }>;
    if (Array.isArray(items)) {
      items.forEach((item) => {
        const existing = productMap.get(item.productId) || {
          name: item.productName,
          quantity: 0,
          revenue: 0,
        };
        existing.quantity += item.quantity;
        existing.revenue += item.price * item.quantity;
        productMap.set(item.productId, existing);
      });
    }
  });

  return Array.from(productMap.entries())
    .map(([productId, data]) => ({ productId, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}
