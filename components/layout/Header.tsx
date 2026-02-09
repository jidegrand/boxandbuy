'use client';

import Link from 'next/link';
import { ShoppingCart, Search, User } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

export function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { data: session, status } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <header className="bg-gray-900 text-white">
      {/* Top bar */}
      <div className="bg-gray-800 py-2 px-4 text-xs">
        <div className="container mx-auto flex justify-between items-center">
          <span>Deliver to Toronto</span>
          <div className="flex gap-4">
            <span>Hello, {status === 'loading' ? '...' : session?.user?.name || 'Sign in'}</span>
            <span>Returns & Orders</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="py-4 px-4">
        <div className="container mx-auto flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            Box<span className="text-orange-400">&</span>Buy
          </Link>

          {/* Search */}
          <div className="flex-1 flex">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 px-4 py-2 rounded-l bg-white text-gray-900"
            />
            <button className="bg-orange-400 px-6 py-2 rounded-r hover:bg-orange-500">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* User Account */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 hover:border border-white px-3 py-2 rounded"
            >
              <User className="w-5 h-5" />
              <div className="text-left text-xs">
                <div className="text-gray-300">Hello, {session?.user?.name || 'Guest'}</div>
                <div className="font-bold">Account</div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-gray-900 rounded shadow-lg z-50">
                {session ? (
                  <div className="p-4">
                    <div className="pb-3 mb-3 border-b">
                      <p className="font-semibold">{session.user.name}</p>
                      <p className="text-sm text-gray-600">{session.user.email}</p>
                    </div>
                    <Link
                      href="/account"
                      className="block py-2 px-3 hover:bg-gray-100 rounded"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Account
                    </Link>
                    <Link
                      href="/orders"
                      className="block py-2 px-3 hover:bg-gray-100 rounded"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left py-2 px-3 hover:bg-gray-100 rounded text-red-600"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="p-4">
                    <Link
                      href="/auth/login"
                      className="block w-full bg-orange-400 hover:bg-orange-500 text-white text-center py-2 rounded mb-2"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Sign In
                    </Link>
                    <p className="text-sm text-center text-gray-600">
                      New customer?{' '}
                      <Link
                        href="/auth/register"
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Start here
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link href="/cart" className="flex items-center gap-2 hover:border border-white px-3 py-2 rounded relative">
            <ShoppingCart className="w-6 h-6" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
            <span className="font-bold">Cart</span>
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-gray-700 py-2 px-4">
        <div className="container mx-auto flex gap-6 text-sm">
          <button className="hover:text-orange-400 flex items-center gap-1">
            ☰ All Categories
          </button>
          <Link href="#" className="hover:text-orange-400">Electronics</Link>
          <Link href="#" className="hover:text-orange-400">Computers</Link>
          <Link href="#" className="hover:text-orange-400">Home & Kitchen</Link>
          <Link href="#" className="hover:text-orange-400 text-orange-400 font-bold">Today&apos;s Deals</Link>
        </div>
      </nav>
    </header>
  );
}
