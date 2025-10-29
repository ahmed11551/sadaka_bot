"use client";

import ProductCard from "@/components/products/ProductCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Mock data - will be replaced with API call
const saleProducts = [
  {
    id: "sale-1",
    name: "Лен бежевый",
    price: 690,
    oldPrice: 990,
    image: "/images/placeholders/sale-1.jpg",
    secondImage: "/images/placeholders/sale-1.jpg",
  },
  {
    id: "sale-2",
    name: "Лен мятный",
    price: 750,
    oldPrice: 1100,
    image: "/images/placeholders/sale-2.jpg",
    secondImage: "/images/placeholders/sale-2.jpg",
  },
  {
    id: "sale-3",
    name: "Лен желтый",
    price: 800,
    oldPrice: 1200,
    image: "/images/placeholders/sale-3.jpg",
    secondImage: "/images/placeholders/sale-3.jpg",
  },
  {
    id: "sale-4",
    name: "Лен розовый",
    price: 690,
    oldPrice: 990,
    image: "/images/placeholders/sale-4.jpg",
    secondImage: "/images/placeholders/sale-4.jpg",
  },
  {
    id: "sale-5",
    name: "Сатин белый",
    price: 590,
    oldPrice: 890,
    image: "/images/placeholders/sale-1.jpg",
    secondImage: "/images/placeholders/sale-1.jpg",
  },
  {
    id: "sale-6",
    name: "Трикотаж серый",
    price: 850,
    oldPrice: 1300,
    image: "/images/placeholders/sale-2.jpg",
    secondImage: "/images/placeholders/sale-2.jpg",
  },
];

export default function SalePage() {
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
          Скидки и акции
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Товары со скидкой. Приобретите качественные ткани по выгодным ценам
        </p>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {saleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-12 flex justify-center">
        <div className="flex gap-2">
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

