'use client';

import Link from 'next/link';
import { ShoppingCart, Search, User, Menu, X } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setSearchQuery('');
    } else {
      router.push('/search');
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <header className="bg-gray-900 text-white">
      {/* Top bar - hidden on very small screens */}
      <div className="bg-gray-800 py-2 px-4 text-xs hidden sm:block">
        <div className="container mx-auto flex justify-between items-center">
          <span>Deliver to Toronto</span>
          <div className="flex gap-4">
            <span>Hello, {status === 'loading' ? '...' : session?.user?.name || 'Sign in'}</span>
            <span>Returns & Orders</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="py-3 px-4">
        <div className="container mx-auto flex items-center gap-3 sm:gap-6">
          {/* Mobile menu button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="sm:hidden"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link href="/" className="text-xl sm:text-2xl font-bold whitespace-nowrap">
            Box<span className="text-orange-400">&</span>Buy
          </Link>

          {/* Search - hidden on mobile, shown on sm+ */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 rounded-l bg-white text-gray-900"
            />
            <button type="submit" className="bg-orange-400 px-4 sm:px-6 py-2 rounded-r hover:bg-orange-500">
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Spacer on mobile */}
          <div className="flex-1 sm:hidden" />

          {/* User Account */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded hover:bg-gray-800"
            >
              <User className="w-5 h-5" />
              <div className="text-left text-xs hidden md:block">
                <div className="text-gray-300">Hello, {session?.user?.name || 'Guest'}</div>
                <div className="font-bold">Account</div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-60 sm:w-64 bg-white text-gray-900 rounded shadow-lg z-50">
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
          <Link href="/cart" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded relative hover:bg-gray-800">
            <ShoppingCart className="w-6 h-6" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
            <span className="font-bold hidden sm:inline">Cart</span>
          </Link>
        </div>

        {/* Mobile search bar */}
        <form onSubmit={handleSearch} className="sm:hidden mt-3 flex">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 rounded-l bg-white text-gray-900 text-sm"
          />
          <button type="submit" className="bg-orange-400 px-4 py-2 rounded-r hover:bg-orange-500">
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Navigation - horizontal scroll on mobile */}
      <nav className="bg-gray-700 py-2 px-4 overflow-x-auto">
        <div className="container mx-auto flex gap-4 sm:gap-6 text-sm whitespace-nowrap">
          <Link href="/search" className="hover:text-orange-400 flex items-center gap-1">
            ☰ All
          </Link>
          <Link href="/search?category=Electronics" className="hover:text-orange-400">Electronics</Link>
          <Link href="/search?category=Computers" className="hover:text-orange-400">Computers</Link>
          <Link href="/search?category=Home+%26+Kitchen" className="hover:text-orange-400">Home & Kitchen</Link>
          <Link href="/search?sort=price-asc" className="hover:text-orange-400 text-orange-400 font-bold">Today&apos;s Deals</Link>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {showMobileMenu && (
        <div className="sm:hidden bg-gray-800 px-4 py-4 space-y-3">
          <Link href="/" className="block py-2 hover:text-orange-400" onClick={() => setShowMobileMenu(false)}>Home</Link>
          <Link href="/account" className="block py-2 hover:text-orange-400" onClick={() => setShowMobileMenu(false)}>My Account</Link>
          <Link href="/orders" className="block py-2 hover:text-orange-400" onClick={() => setShowMobileMenu(false)}>My Orders</Link>
          <Link href="/cart" className="block py-2 hover:text-orange-400" onClick={() => setShowMobileMenu(false)}>Cart</Link>
          {session ? (
            <button onClick={handleSignOut} className="block py-2 text-red-400">Sign Out</button>
          ) : (
            <Link href="/auth/login" className="block py-2 text-orange-400 font-semibold" onClick={() => setShowMobileMenu(false)}>Sign In</Link>
          )}
        </div>
      )}
    </header>
  );
}
