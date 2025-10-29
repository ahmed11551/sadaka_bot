"use client";

import ProductCard from "@/components/products/ProductCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Mock data - will be replaced with API call
const combinationProducts = [
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
];

export default function Combinations() {
  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="container-custom">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Комбинации</h2>
          <Link
            href="/collections/combinations"
            className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            Посмотреть все
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {combinationProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

