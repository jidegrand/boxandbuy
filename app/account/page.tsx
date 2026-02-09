import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login?callbackUrl=/account');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl sm:text-4xl font-bold text-white">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-1">Member since</p>
                <p className="font-semibold text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </p>
              </div>

              <div className="border-t mt-4 pt-4">
                <button className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2 rounded font-semibold mb-2">
                  Edit Profile
                </button>
                <button className="w-full border border-gray-300 hover:bg-gray-50 py-2 rounded font-semibold text-gray-900">
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
                <p className="text-xl sm:text-3xl font-bold text-orange-600">{user.orders.length}</p>
                <p className="text-xs sm:text-sm text-gray-600">Total Orders</p>
              </div>
              <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
                <p className="text-xl sm:text-3xl font-bold text-green-600">
                  ${user.orders.reduce((sum, order) => sum + order.total, 0).toFixed(0)}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">Total Spent</p>
              </div>
              <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
                <p className="text-xl sm:text-3xl font-bold text-blue-600">0</p>
                <p className="text-xs sm:text-sm text-gray-600">Wishlist Items</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Recent Orders</h3>
                <Link href="/orders" className="text-orange-600 hover:text-orange-700 text-sm font-semibold">
                  View All
                </Link>
              </div>

              {user.orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No orders yet</p>
                  <Link
                    href="/"
                    className="inline-block bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded font-semibold"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {user.orders.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded p-3 sm:p-4 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-sm sm:text-base text-gray-900">{order.orderId}</p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orange-600 text-sm sm:text-base">
                            ${order.total.toFixed(2)}
                          </p>
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <Link
                  href="/orders"
                  className="border rounded p-3 sm:p-4 hover:bg-gray-50 text-center"
                >
                  <p className="font-semibold text-sm sm:text-base text-gray-900">My Orders</p>
                  <p className="text-xs sm:text-sm text-gray-600">Track & manage orders</p>
                </Link>
                <Link
                  href="/cart"
                  className="border rounded p-3 sm:p-4 hover:bg-gray-50 text-center"
                >
                  <p className="font-semibold text-sm sm:text-base text-gray-900">Shopping Cart</p>
                  <p className="text-xs sm:text-sm text-gray-600">View your cart</p>
                </Link>
                <Link
                  href="#"
                  className="border rounded p-3 sm:p-4 hover:bg-gray-50 text-center"
                >
                  <p className="font-semibold text-sm sm:text-base text-gray-900">Wishlist</p>
                  <p className="text-xs sm:text-sm text-gray-600">Saved items</p>
                </Link>
                <Link
                  href="#"
                  className="border rounded p-3 sm:p-4 hover:bg-gray-50 text-center"
                >
                  <p className="font-semibold text-sm sm:text-base text-gray-900">Settings</p>
                  <p className="text-xs sm:text-sm text-gray-600">Manage preferences</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
