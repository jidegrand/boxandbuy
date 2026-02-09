'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, User, Menu } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';

export function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-gray-900 text-white">
      {/* Top bar */}
      <div className="bg-gray-800 py-2">
        <div className="container mx-auto px-4 text-xs flex justify-between items-center">
          <span>Deliver to Toronto</span>
          <div className="flex gap-4">
            <span>Hello, Sign in</span>
            <span>Returns & Orders</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            <span className="text-orange-400">Box</span>
            <span className="text-white">&</span>
            <span className="text-orange-400">Buy</span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-3xl">
            <div className="flex">
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 px-4 py-2 rounded-l text-black"
              />
              <button className="bg-orange-400 px-6 py-2 rounded-r hover:bg-orange-500">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-6">
            <Link href="/account" className="flex flex-col items-center hover:text-orange-400">
              <User className="w-6 h-6" />
              <span className="text-xs">Account</span>
            </Link>

            <Link href="/cart" className="flex items-center gap-2 hover:text-orange-400">
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-sm">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Categories bar */}
      <div className="bg-gray-700">
        <div className="container mx-auto px-4 py-2">
          <div className="flex gap-6 text-sm">
            <button className="flex items-center gap-2 hover:text-orange-400">
              <Menu className="w-4 h-4" />
              All Categories
            </button>
            <Link href="/electronics" className="hover:text-orange-400">Electronics</Link>
            <Link href="/computers" className="hover:text-orange-400">Computers</Link>
            <Link href="/home" className="hover:text-orange-400">Home & Kitchen</Link>
            <Link href="/deals" className="hover:text-orange-400 text-orange-400 font-semibold">Today&apos;s Deals</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
