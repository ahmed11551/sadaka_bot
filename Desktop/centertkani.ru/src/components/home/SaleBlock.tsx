"use client";

import ProductCard from "@/components/products/ProductCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Mock data - will be replaced with API call
const saleProducts = [
  {
    id: "5",
    name: "Футер зеленый",
    price: 590,
    oldPrice: 890,
    image: "/images/placeholders/sale-1.jpg",
    secondImage: "/images/placeholders/sale-1.jpg",
  },
  {
    id: "6",
    name: "Футер лавандовый",
    price: 590,
    oldPrice: 890,
    image: "/images/placeholders/sale-2.jpg",
    secondImage: "/images/placeholders/sale-2.jpg",
  },
  {
    id: "7",
    name: "Футер коралловый",
    price: 590,
    oldPrice: 890,
    image: "/images/placeholders/sale-3.jpg",
    secondImage: "/images/placeholders/sale-3.jpg",
  },
  {
    id: "8",
    name: "Футер оливковый",
    price: 590,
    oldPrice: 890,
    image: "/images/placeholders/sale-1.jpg",
    secondImage: "/images/placeholders/sale-1.jpg",
  },
];

export default function SaleBlock() {
  return (
    <section className="bg-gray-50 py-12 lg:py-16">
      <div className="container-custom">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-gray-900"
              >
                Скидки и акции
              </motion.h2>
              <p className="mt-2 text-gray-600">
                Специальные предложения с выгодными ценами
              </p>
            </div>
            <Link
              href="/sale"
              className="hidden items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 sm:flex"
            >
              Посмотреть все
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {saleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

