"use client";

import ProductCard from "@/components/products/ProductCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Mock data - will be replaced with API call
const newProducts = [
  {
    id: "1",
    name: "Лен бежевый",
    price: 800,
    oldPrice: null,
    image: "/images/placeholders/product-1.jpg",
  },
  {
    id: "2",
    name: "Лен мятный",
    price: 800,
    oldPrice: null,
    image: "/images/placeholders/product-2.jpg",
  },
  {
    id: "3",
    name: "Лен желтый",
    price: 800,
    oldPrice: null,
    image: "/images/placeholders/product-3.jpg",
  },
  {
    id: "4",
    name: "Лен розовый",
    price: 800,
    oldPrice: null,
    image: "/images/placeholders/product-4.jpg",
  },
];

export default function NewArrivals() {
  return (
    <section className="py-12 lg:py-16">
      <div className="container-custom">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Новинки</h2>
          <Link
            href="/catalog?filter=new"
            className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            Посмотреть все
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

