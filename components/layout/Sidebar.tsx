export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r p-4">
      <h3 className="font-bold text-lg mb-4">Filters</h3>

      {/* Price filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Price</h4>
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2 cursor-pointer hover:text-orange-600">
            <input type="checkbox" className="rounded" />
            Under $25
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-orange-600">
            <input type="checkbox" className="rounded" />
            $25 to $50
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-orange-600">
            <input type="checkbox" className="rounded" />
            $50 to $100
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-orange-600">
            <input type="checkbox" className="rounded" />
            $100 & Above
          </label>
        </div>
      </div>

      {/* Category filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Category</h4>
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2 cursor-pointer hover:text-orange-600">
            <input type="checkbox" className="rounded" />
            Electronics
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-orange-600">
            <input type="checkbox" className="rounded" />
            Computers
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-orange-600">
            <input type="checkbox" className="rounded" />
            Home & Kitchen
          </label>
        </div>
      </div>

      {/* Prime filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Shipping</h4>
        <label className="flex items-center gap-2 cursor-pointer hover:text-orange-600 text-sm">
          <input type="checkbox" className="rounded" />
          <span className="text-blue-600 font-bold">prime</span> FREE Delivery
        </label>
      </div>

      {/* Rating filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Customer Review</h4>
        <div className="space-y-2 text-sm">
          {[4, 3, 2, 1].map(stars => (
            <button key={stars} className="flex items-center gap-2 hover:text-orange-600">
              <span className="text-orange-400">{'★'.repeat(stars)}{'☆'.repeat(5-stars)}</span>
              & Up
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
