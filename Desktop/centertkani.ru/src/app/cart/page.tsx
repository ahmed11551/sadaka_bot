"use client";

import { useCart } from "@/store/cart-store";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, Tag, ShoppingCart } from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  const { items, totalPrice, removeItem, updateQuantity, promoCode, promoDiscount, applyPromoCode, clearCart } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setIsApplyingPromo(true);
    await applyPromoCode(promoInput.trim());
    setIsApplyingPromo(false);
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    const item = items.find((i) => i.id === id);
    if (item && newQuantity >= item.minQuantity) {
      updateQuantity(id, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-16">
        <ShoppingCart className="mb-4 h-24 w-24 text-gray-300" />
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Корзина пуста</h2>
        <p className="mb-8 text-gray-600">Добавьте товары для продолжения</p>
        <Link href="/catalog" className="btn-primary">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 lg:py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Корзина</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="card flex items-center gap-4 p-4 sm:flex-row"
            >
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      {item.price.toLocaleString()} ₽ за метр
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - item.step)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 hover:bg-gray-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseFloat(e.target.value))
                      }
                      min={item.minQuantity}
                      step={item.step}
                      className="w-20 rounded border border-gray-300 px-2 py-1 text-center text-sm"
                    />
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + item.step)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 hover:bg-gray-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <span className="ml-2 text-sm text-gray-600">м</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {(item.price * item.quantity).toLocaleString()} ₽
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-8 p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Итого</h2>

            {/* Promo code */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Промокод"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="input-field"
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  disabled={isApplyingPromo}
                  className="btn-secondary whitespace-nowrap"
                >
                  <Tag className="h-4 w-4" />
                </button>
              </div>
              {promoCode && (
                <p className="mt-2 text-sm text-green-600">
                  Промокод применен: {promoCode}
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-2 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Товаров: {items.length}</span>
                <span>{totalPrice.toLocaleString()} ₽</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Скидка</span>
                  <span>-{((totalPrice * promoDiscount) / (1 - promoDiscount)).toLocaleString()} ₽</span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="mb-4 flex items-center justify-between text-xl font-bold">
                <span>Итого:</span>
                <span>{totalPrice.toLocaleString()} ₽</span>
              </div>
              <Link href="/checkout" className="btn-primary w-full">
                Оформить заказ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

