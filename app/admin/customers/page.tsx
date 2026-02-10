import { getAllCustomers } from '@/lib/admin/queries';
import { CustomersTable } from '@/components/admin/CustomersTable';
import { Users } from 'lucide-react';

interface Props {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function AdminCustomersPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const search = params.search || '';

  const { customers, total, pages } = await getAllCustomers({ page, search });

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
        <span className="bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full">
          {total} total
        </span>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-purple-600" />
            <p className="text-sm text-gray-600">Total Customers</p>
          </div>
          <p className="text-xl font-bold text-gray-900">{total}</p>
        </div>
        <div className="bg-white rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">With Orders</p>
          <p className="text-xl font-bold text-gray-900">
            {customers.filter((c) => c.orderCount > 0).length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 hidden sm:block">
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-xl font-bold text-green-600">
            ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}
          </p>
        </div>
      </div>

      <CustomersTable
        customers={JSON.parse(JSON.stringify(customers))}
        total={total}
        pages={pages}
        currentPage={page}
        currentSearch={search}
      />
    </div>
  );
}
