export function HeroBanner() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-6">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              Winter Sale - Up to 50% Off
            </h1>
            <p className="text-xl mb-6">
              Shop thousands of products at amazing prices
            </p>
            <button className="bg-orange-400 hover:bg-orange-500 text-white px-8 py-3 rounded text-lg font-semibold">
              Shop Now
            </button>
          </div>
          <div className="text-6xl text-center">
            🛍️
          </div>
        </div>
      </div>
    </div>
  );
}
