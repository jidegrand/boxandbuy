import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold mb-3">Get to Know Us</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-orange-400">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-orange-400">Careers</Link></li>
              <li><Link href="/press" className="hover:text-orange-400">Press Releases</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3">Make Money with Us</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/sell" className="hover:text-orange-400">Sell on BoxandBuy</Link></li>
              <li><Link href="/affiliate" className="hover:text-orange-400">Become an Affiliate</Link></li>
              <li><Link href="/advertise" className="hover:text-orange-400">Advertise Your Products</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3">Let Us Help You</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/account" className="hover:text-orange-400">Your Account</Link></li>
              <li><Link href="/orders" className="hover:text-orange-400">Your Orders</Link></li>
              <li><Link href="/returns" className="hover:text-orange-400">Returns & Replacements</Link></li>
              <li><Link href="/help" className="hover:text-orange-400">Help</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>support@boxandbuy.com</li>
              <li>1-800-BOX-NBUY</li>
              <li>Toronto, ON, Canada</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} BoxandBuy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
