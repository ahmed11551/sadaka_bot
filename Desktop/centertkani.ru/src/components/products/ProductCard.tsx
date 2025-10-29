"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/store/cart-store";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    oldPrice?: number | null;
    image: string;
    secondImage?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      minQuantity: 0.5,
      step: 0.1,
    });
  };

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <motion.div
      className="group relative overflow-hidden rounded-[20px] bg-white border-[1.2px] border-[rgba(16,16,16,0.1)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`}>
        {/* Image container */}
        <div className="relative h-[380px] overflow-hidden rounded-[10px] bg-gray-100 p-[10px]">
          {!imageError ? (
            <>
              <Image
                src={product.image}
                alt={product.name}
                fill
                className={`object-cover transition-opacity duration-500 ${
                  isHovered && product.secondImage ? "opacity-0" : "opacity-100"
                }`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                onError={() => setImageError(true)}
              />
              {product.secondImage && (
                <Image
                  src={product.secondImage}
                  alt={product.name}
                  fill
                  className={`object-cover transition-opacity duration-500 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  onError={() => setImageError(true)}
                />
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-200 text-gray-400">
              <span>Изображение</span>
            </div>
          )}

          {/* Discount badge */}
          {discount > 0 && (
            <div className="absolute left-2 top-2 z-10 rounded-full bg-primary-600 px-2.5 py-1 text-xs font-semibold text-white">
              -{discount}%
            </div>
          )}

          {/* Quick add button */}
          <div className="absolute bottom-2 right-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              onClick={handleAddToCart}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition-transform hover:scale-110"
              aria-label="Добавить в корзину"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Product info */}
        <div className="p-[10px] pt-[14px] pb-0">
          <div className="flex flex-col gap-[5px]">
            <h3 className="text-[16px] font-semibold text-[#101010] leading-[1.2]">
              {product.name}
            </h3>
            <div className="flex items-center">
              <span className="text-[16px] font-bold text-[#9b1e1c] leading-[1.2]">
                {product.price.toLocaleString()} ₽ /м
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

