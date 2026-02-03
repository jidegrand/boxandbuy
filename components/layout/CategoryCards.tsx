import Link from 'next/link';

export function CategoryCards() {
  const categories = [
    {
      title: 'Gaming accessories',
      image: '🎮',
      link: '/gaming',
      subcategories: [
        { name: 'Headsets', link: '/gaming/headsets' },
        { name: 'Keyboards', link: '/gaming/keyboards' },
        { name: 'Computer mice', link: '/gaming/mice' },
        { name: 'Chairs', link: '/gaming/chairs' }
      ]
    },
    {
      title: 'Shop Laptops & Tablets',
      image: '💻',
      link: '/computers',
      subcategories: [
        { name: 'Laptops', link: '/computers/laptops' },
        { name: 'Tablets', link: '/computers/tablets' },
        { name: 'Accessories', link: '/computers/accessories' }
      ]
    },
    {
      title: 'Electronics',
      image: '📱',
      link: '/electronics',
      subcategories: [
        { name: 'Smartphones', link: '/electronics/phones' },
        { name: 'Headphones', link: '/electronics/headphones' },
        { name: 'Cameras', link: '/electronics/cameras' }
      ]
    },
    {
      title: 'Fashion',
      image: '👕',
      link: '/fashion',
      subcategories: [
        { name: 'Dresses', link: '/fashion/dresses' },
        { name: 'Shoes', link: '/fashion/shoes' },
        { name: 'Jewelry', link: '/fashion/jewelry' }
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {categories.map((category) => (
        <div key={category.title} className="bg-white p-6 rounded">
          <h3 className="font-bold text-xl mb-4">{category.title}</h3>
          <div className="bg-gray-100 h-40 rounded mb-4 flex items-center justify-center text-6xl">
            {category.image}
          </div>
          <div className="space-y-2 text-sm mb-4">
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
            className="text-blue-600 hover:text-orange-600 text-sm"
          >
            See more →
          </Link>
        </div>
      ))}
    </div>
  );
}
