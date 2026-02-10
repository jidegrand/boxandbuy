import { getAllOrders } from '@/lib/admin/queries';
import { OrdersTable } from '@/components/admin/OrdersTable';

interface Props {
  searchParams: Promise<{ page?: string; status?: string; search?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const status = params.status || 'all';
  const search = params.search || '';

  const { orders, total, pages } = await getAllOrders({ page, status, search });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order Management</h1>
      <OrdersTable
        orders={JSON.parse(JSON.stringify(orders))}
        total={total}
        pages={pages}
        currentPage={page}
        currentStatus={status}
        currentSearch={search}
      />
    </div>
  );
}
