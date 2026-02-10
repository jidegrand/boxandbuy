import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getUserOrders } from '@/lib/prestashop/orders';

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login?callbackUrl=/orders');
  }

  const orders = await getUserOrders(session.user.id);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">You haven&apos;t placed any orders yet.</p>
            <Link
              href="/"
              className="inline-block bg-orange-400 hover:bg-orange-500 text-white px-6 py-3 rounded font-semibold"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const items = order.items as any[];
              const shipping = order.shipping as any;

              return (
                <div key={order.id} className="bg-white rounded-lg p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Order Number</p>
                      <p className="font-bold text-base sm:text-lg text-gray-900">{order.orderId}</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-semibold mb-1 text-gray-900">Shipping Address</p>
                        <p className="text-sm text-gray-700">
                          {shipping.firstName} {shipping.lastName}
                        </p>
                        <p className="text-sm text-gray-700">{shipping.address}</p>
                        <p className="text-sm text-gray-700">
                          {shipping.city}, {shipping.state} {shipping.zipCode}
                        </p>
                        <p className="text-sm text-gray-700">{shipping.country}</p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold mb-1 text-gray-900">Order Status</p>
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm font-semibold mb-2 text-gray-900">Items Ordered</p>
                      <div className="space-y-2">
                        {items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.productName} x {item.quantity}
                            </span>
                            <span className="font-semibold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-xl sm:text-2xl font-bold text-orange-600">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                    <button className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 font-semibold text-gray-900">
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
