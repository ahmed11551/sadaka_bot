"use client";

import ProductCard from "./ProductCard";

interface ProductRecommendationsProps {
  productId: string;
}

export default function ProductRecommendations({ productId }: ProductRecommendationsProps) {
  // Mock data - will be replaced with API call
  const recommendations = [
    {
      id: "rec-1",
      name: "Рекомендуемый товар 1",
      price: 1200,
      oldPrice: null,
      image: "/images/placeholders/placeholder.svg",
      secondImage: "/images/placeholders/placeholder2.svg",
    },
    {
      id: "rec-2",
      name: "Рекомендуемый товар 2",
      price: 1300,
      oldPrice: 1500,
      image: "/images/placeholders/placeholder.svg",
      secondImage: "/images/placeholders/placeholder2.svg",
    },
    {
      id: "rec-3",
      name: "Рекомендуемый товар 3",
      price: 1400,
      oldPrice: null,
      image: "/images/placeholders/placeholder.svg",
      secondImage: "/images/placeholders/placeholder2.svg",
    },
    {
      id: "rec-4",
      name: "Рекомендуемый товар 4",
      price: 1100,
      oldPrice: null,
      image: "/images/placeholders/placeholder.svg",
      secondImage: "/images/placeholders/placeholder2.svg",
    },
  ];

  const combinations = [
    {
      id: "comb-1",
      name: "Комбинация 1",
      price: 2500,
      oldPrice: 3000,
      image: "/images/product-1.jpg",
      secondImage: "/images/product-1-alt.jpg",
    },
    {
      id: "comb-2",
      name: "Комбинация 2",
      price: 2700,
      oldPrice: null,
      image: "/images/product-2.jpg",
      secondImage: "/images/product-2-alt.jpg",
    },
  ];

  return (
    <div className="mt-16 space-y-12">
      {/* Combinations */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Комбинации</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {combinations.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Recommended products */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Рекомендуемые товары</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recommendations.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

