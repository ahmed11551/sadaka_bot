"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/store/cart-store";
import { ShoppingCart } from "lucide-react";
import ProductRecommendations from "@/components/products/ProductRecommendations";

// Mock data - will be replaced with API call
const mockProduct = {
  id: "product-1",
  name: "Ткань премиум качества",
  price: 1500,
  oldPrice: 2000,
  images: [
    "/images/placeholders/placeholder.svg",
    "/images/placeholders/placeholder2.svg",
    "/images/placeholders/placeholder.svg",
  ],
  description: `
    Высококачественная ткань для пошива одежды. 
    Отличный выбор для создания стильных и комфортных вещей.
    
    Состав: 100% хлопок
    Ширина: 150 см
    Плотность: 140 г/м²
    
    Подходит для пошива:
    - Блузок и рубашек
    - Платьев
    - Брюк
    - Домашнего текстиля
  `,
  characteristics: {
    "Состав": "100% хлопок",
    "Ширина": "150 см",
    "Плотность": "140 г/м²",
    "Цвет": "Голубой",
    "Длина в упаковке": "15 м",
  },
  minQuantity: 0.5,
  step: 0.1,
  inStock: true,
};

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(mockProduct.minQuantity);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: mockProduct.id,
      name: mockProduct.name,
      price: mockProduct.price,
      image: mockProduct.images[0],
      quantity,
      minQuantity: mockProduct.minQuantity,
      step: mockProduct.step,
    });
  };

  const handleBuyOneClick = () => {
    // TODO: Implement one-click buy functionality
    console.log("Buy in one click");
  };

  const discount = mockProduct.oldPrice
    ? Math.round(((mockProduct.oldPrice - mockProduct.price) / mockProduct.oldPrice) * 100)
    : 0;

  return (
    <div className="container-custom py-8 lg:py-12">
      {/* Product info */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={mockProduct.images[selectedImage]}
              alt={mockProduct.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {discount > 0 && (
              <div className="absolute left-4 top-4 rounded-full bg-primary-600 px-3 py-1.5 text-sm font-semibold text-white">
                -{discount}%
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3">
            {mockProduct.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 ${
                  selectedImage === index ? "border-primary-600" : "border-gray-200"
                }`}
              >
                <Image
                  src={image}
                  alt={`${mockProduct.name} ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{mockProduct.name}</h1>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                {mockProduct.price.toLocaleString()} ₽
              </span>
              {mockProduct.oldPrice && (
                <span className="text-xl text-gray-500 line-through">
                  {mockProduct.oldPrice.toLocaleString()} ₽
                </span>
              )}
            </div>
            {mockProduct.inStock ? (
              <p className="mt-2 text-sm text-green-600">✓ В наличии</p>
            ) : (
              <p className="mt-2 text-sm text-red-600">✗ Нет в наличии</p>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">Описание</h2>
            <p className="text-gray-700 whitespace-pre-line">{mockProduct.description.trim()}</p>
          </div>

          {/* Characteristics */}
          <div>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">Характеристики</h2>
            <div className="space-y-2 border-t border-gray-200 pt-3">
              {Object.entries(mockProduct.characteristics).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-gray-100 py-2">
                  <span className="text-gray-600">{key}:</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity selector */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Количество:</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(mockProduct.minQuantity, quantity - mockProduct.step))}
                className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val >= mockProduct.minQuantity) {
                    setQuantity(val);
                  }
                }}
                min={mockProduct.minQuantity}
                step={mockProduct.step}
                className="w-24 rounded-lg border border-gray-300 px-4 py-3 text-center text-sm"
              />
              <button
                onClick={() => setQuantity(quantity + mockProduct.step)}
                className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                +
              </button>
              <span className="text-sm text-gray-600">м</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button onClick={handleAddToCart} className="btn-primary w-full flex items-center justify-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Добавить в корзину
            </button>
            <button onClick={handleBuyOneClick} className="btn-secondary w-full">
              Купить в 1 клик
            </button>
          </div>

          {/* Additional service: Thread matching - визуальная опция */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">Подобрать нитки в тон</h4>
                <p className="mt-1 text-sm text-gray-600">
                  Наши специалисты помогут подобрать идеальные нитки к выбранной ткани
                </p>
              </div>
              <button className="ml-4 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
                Выбрать
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <ProductRecommendations productId={mockProduct.id} />
    </div>
  );
}

