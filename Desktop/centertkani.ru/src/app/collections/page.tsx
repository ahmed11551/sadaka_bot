"use client";

import ProductCard from "@/components/products/ProductCard";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

// Mock data - will be replaced with API call
const collections = [
  {
    id: "combinations",
    title: "Комбинации",
    description: "Ткани, которые идеально сочетаются друг с другом",
    products: [
      {
        id: "combo-1",
        name: "Серый комбинат",
        price: 690,
        oldPrice: 990,
        image: "/images/placeholders/product-1.jpg",
        secondImage: "/images/placeholders/product-1-alt.jpg",
      },
      {
        id: "combo-2",
        name: "Зеленый оливковый",
        price: 690,
        oldPrice: 990,
        image: "/images/placeholders/product-2.jpg",
        secondImage: "/images/placeholders/product-2-alt.jpg",
      },
      {
        id: "combo-3",
        name: "Бежевый ткань",
        price: 690,
        oldPrice: 990,
        image: "/images/placeholders/product-3.jpg",
        secondImage: "/images/placeholders/product-3-alt.jpg",
      },
      {
        id: "combo-4",
        name: "Синий периклаз",
        price: 690,
        oldPrice: 990,
        image: "/images/placeholders/product-4.jpg",
        secondImage: "/images/placeholders/product-4-alt.jpg",
      },
    ],
  },
  {
    id: "premium",
    title: "Премиум коллекция",
    description: "Эксклюзивные ткани высочайшего качества",
    products: [
      {
        id: "premium-1",
        name: "Шелк премиум",
        price: 2900,
        oldPrice: null,
        image: "/images/placeholders/product-1.jpg",
        secondImage: "/images/placeholders/product-1-alt.jpg",
      },
      {
        id: "premium-2",
        name: "Лен люкс",
        price: 1900,
        oldPrice: null,
        image: "/images/placeholders/product-2.jpg",
        secondImage: "/images/placeholders/product-2-alt.jpg",
      },
      {
        id: "premium-3",
        name: "Хлопок экстра",
        price: 1500,
        oldPrice: null,
        image: "/images/placeholders/product-3.jpg",
        secondImage: "/images/placeholders/product-3-alt.jpg",
      },
      {
        id: "premium-4",
        name: "Вискоза премиум",
        price: 1200,
        oldPrice: null,
        image: "/images/placeholders/product-4.jpg",
        secondImage: "/images/placeholders/product-4-alt.jpg",
      },
    ],
  },
];

export default function CollectionsPage() {
  return (
    <div className="container-custom py-8 lg:py-12">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600"
        >
          <ArrowLeft className="h-4 w-4" />
          На главную
        </Link>
      </div>

      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Тематические подборки
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Специально подобранные коллекции тканей для ваших проектов
        </p>
      </div>

      {/* Collections */}
      <div className="space-y-16">
        {collections.map((collection, collectionIndex) => (
          <div key={collection.id}>
            {/* Collection header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="mb-2 flex items-center gap-3 text-2xl font-bold text-gray-900">
                  <Sparkles className="h-6 w-6 text-primary-600" />
                  {collection.title}
                </h2>
                <p className="text-gray-600">{collection.description}</p>
              </div>
            </div>

            {/* Products grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {collection.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Divider */}
            {collectionIndex < collections.length - 1 && (
              <div className="mt-16 border-t border-gray-200" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

