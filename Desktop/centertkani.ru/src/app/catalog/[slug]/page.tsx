"use client";

import ProductCard from "@/components/products/ProductCard";

// Mock data - will be replaced with API call
const mockProducts = Array.from({ length: 12 }, (_, i) => ({
  id: `product-${i + 1}`,
  name: `Ткань ${i + 1}`,
  price: 1000 + i * 200,
  oldPrice: i % 3 === 0 ? 1500 + i * 200 : null,
  image: `/images/placeholders/product-${(i % 4) + 1}.jpg`,
  secondImage: `/images/placeholders/product-${(i % 4) + 1}-alt.jpg`,
}));

interface PageProps {
  params: { slug: string };
}

export default function CatalogPage({ params }: PageProps) {
  const { slug } = params;
  
  const categoryName = slug === "odezhda" 
    ? "Ткани для одежды" 
    : slug === "dom"
    ? "Ткани для дома"
    : "Каталог";

  return (
    <div className="container-custom py-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
        <p className="mt-2 text-gray-600">
          Доступно товаров: {mockProducts.length}
        </p>
      </div>

      {/* Filters - will be implemented with backend */}
      <div className="mb-8 flex flex-wrap gap-4">
        <select className="input-field w-full sm:w-auto">
          <option>Сортировка по цене</option>
          <option>По возрастанию</option>
          <option>По убыванию</option>
          <option>Новинки</option>
        </select>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-12 flex justify-center">
        <div className="flex gap-2">
          <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Назад
          </button>
          <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white">
            1
          </button>
          <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            2
          </button>
          <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Далее
          </button>
        </div>
      </div>
    </div>
  );
}

