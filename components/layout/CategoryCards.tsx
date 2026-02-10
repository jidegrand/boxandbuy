import Link from 'next/link';

export function CategoryCards() {
  const categories = [
    {
      title: 'Gaming accessories',
      image: '🎮',
      link: '/search?category=Gaming',
      subcategories: [
        { name: 'Headsets', link: '/search?q=headset&category=Gaming' },
        { name: 'Keyboards', link: '/search?q=keyboard&category=Gaming' },
        { name: 'Computer mice', link: '/search?q=mouse&category=Gaming' },
        { name: 'Chairs', link: '/search?q=chair&category=Gaming' }
      ]
    },
    {
      title: 'Shop Laptops & Tablets',
      image: '💻',
      link: '/search?category=Computers',
      subcategories: [
        { name: 'Laptops', link: '/search?q=laptop&category=Computers' },
        { name: 'Tablets', link: '/search?q=tablet&category=Computers' },
        { name: 'Accessories', link: '/search?q=accessories&category=Computers' }
      ]
    },
    {
      title: 'Electronics',
      image: '📱',
      link: '/search?category=Electronics',
      subcategories: [
        { name: 'Smartphones', link: '/search?q=phone&category=Electronics' },
        { name: 'Headphones', link: '/search?q=headphones&category=Electronics' },
        { name: 'Cameras', link: '/search?q=camera&category=Electronics' }
      ]
    },
    {
      title: 'Fashion',
      image: '👕',
      link: '/search?category=Fashion',
      subcategories: [
        { name: 'Dresses', link: '/search?q=dress&category=Fashion' },
        { name: 'Shoes', link: '/search?q=shoes&category=Fashion' },
        { name: 'Jewelry', link: '/search?q=jewelry&category=Fashion' }
      ]
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
      {categories.map((category) => (
        <div key={category.title} className="bg-white p-3 sm:p-6 rounded">
          <h3 className="font-bold text-sm sm:text-xl mb-2 sm:mb-4 text-gray-900">{category.title}</h3>
          <div className="bg-gray-100 h-24 sm:h-40 rounded mb-2 sm:mb-4 flex items-center justify-center text-4xl sm:text-6xl">
            {category.image}
          </div>
          <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm mb-2 sm:mb-4 text-gray-700">
            {category.subcategories.map((sub) => (
              <Link
                key={sub.name}
                href={sub.link}
                className="block hover:text-orange-600"
              >
                {sub.name}
              </Link>
            ))}
          </div>
          <Link
            href={category.link}
            className="text-blue-600 hover:text-orange-600 text-xs sm:text-sm"
          >
            See more →
          </Link>
        </div>
      ))}
    </div>
  );
}
