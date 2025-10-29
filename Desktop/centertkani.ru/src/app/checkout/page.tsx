"use client";

import { useState } from "react";
import { useCart } from "@/store/cart-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const checkoutSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  phone: z.string().regex(/^[\d\s()+-]+$/, "Введите корректный номер телефона"),
  email: z.string().email("Введите корректный email").optional().or(z.literal("")),
  deliveryMethod: z.enum(["pickup", "sdek", "post", "ozon"]),
  paymentMethod: z.enum(["online", "cash", "invoice"]),
  city: z.string().optional(),
  address: z.string().optional(),
  comment: z.string().optional(),
  pickupAddress: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Mock данные для способов доставки
const deliveryOptions = [
  { value: "pickup", label: "Самовывоз", icon: "📦", price: 0, days: "В день заказа" },
  { value: "sdek", label: "СДЭК", icon: "🚚", price: 500, days: "1-3 дня" },
  { value: "post", label: "Почта России", icon: "📮", price: 300, days: "5-10 дней" },
  { value: "ozon", label: "Ozon Delivery", icon: "📦", price: 600, days: "1-2 дня" },
];

const paymentOptions = [
  { 
    value: "online", 
    label: "Онлайн-оплата", 
    icon: "💳", 
    description: "Банковской картой через безопасный платежный шлюз",
    showVAT: false
  },
  { 
    value: "cash", 
    label: "При получении", 
    icon: "💰", 
    description: "Наличными курьеру",
    showVAT: false
  },
  { 
    value: "invoice", 
    label: "По счету", 
    icon: "📄", 
    description: "Для юридических лиц",
    showVAT: true
  },
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<string>("pickup");
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryMethod: "pickup",
      paymentMethod: "online",
    },
  });

  const paymentMethod = watch("paymentMethod");

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    // TODO: Implement API call to create order
    console.log("Order data:", { ...data, items, totalPrice });
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    clearCart();
    setIsSubmitting(false);
    // TODO: Redirect to success page
  };

  return (
    <div className="container-custom py-8 lg:py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Оформление заказа</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal info */}
          <div className="card p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Контактные данные</h2>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Имя <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("name")}
                className="input-field"
                placeholder="Иван Иванов"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Телефон <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                {...register("phone")}
                className="input-field"
                placeholder="+7 (999) 123-45-67"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email (необязательно)
              </label>
              <input
                type="email"
                {...register("email")}
                className="input-field"
                placeholder="ivan@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Delivery */}
          <div className="card p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Способ доставки</h2>
            
            <div className="space-y-3">
              {deliveryOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-300 p-4 hover:border-primary-500 transition-colors"
                >
                  <input
                    type="radio"
                    value={option.value}
                    {...register("deliveryMethod")}
                    className="mt-1 h-4 w-4 text-primary-600"
                    onChange={(e) => {
                      setSelectedDelivery(e.target.value);
                      setDeliveryPrice(option.price);
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{option.icon}</span>
                      <span className="font-medium">{option.label}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                      <span>{option.days}</span>
                      {option.price > 0 && <span className="font-semibold text-gray-900">{option.price.toLocaleString()} ₽</span>}
                      {option.price === 0 && <span className="text-green-600 font-semibold">Бесплатно</span>}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Адрес самовывоза или города */}
            {(selectedDelivery === "sdek" || selectedDelivery === "post" || selectedDelivery === "ozon") && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Город доставки
                </label>
                <input
                  type="text"
                  {...register("city")}
                  className="input-field"
                  placeholder="Москва"
                />
              </div>
            )}

            {selectedDelivery === "pickup" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Адрес самовывоза
                </label>
                <input
                  type="text"
                  {...register("pickupAddress")}
                  className="input-field"
                  defaultValue="Москва, ул. Примерная, 1"
                  readOnly
                />
                <p className="mt-1 text-xs text-gray-500">
                  Адрес может быть изменен в зависимости от наличия товара
                </p>
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="card p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Способ оплаты</h2>
            
            <div className="space-y-3">
              {paymentOptions.map((option) => (
                <div key={option.value}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-300 p-4 hover:border-primary-500 transition-colors">
                    <input
                      type="radio"
                      value={option.value}
                      {...register("paymentMethod")}
                      className="mt-1 h-4 w-4 text-primary-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{option.icon}</span>
                        <span className="font-medium">{option.label}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{option.description}</p>
                    </div>
                  </label>
                  
                  {/* Подсказка по НДС для оплаты по счету */}
                  {paymentMethod === "invoice" && option.showVAT && (
                    <div className="mt-2 rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm text-blue-800">
                      <strong>ℹ️ НДС:</strong> При оплате по счету к стоимости заказа будет добавлен НДС 20%. 
                      Бухгалтерия вышлет счет после подтверждения заказа.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="card p-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Комментарий к заказу
            </label>
            <textarea
              {...register("comment")}
              rows={3}
              className="input-field"
              placeholder="Дополнительная информация..."
            />
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-8 p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Итого</h2>
            <div className="space-y-2 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm">
                <span>Товары ({items.length} шт.)</span>
                <span>{totalPrice.toLocaleString()} ₽</span>
              </div>
              {deliveryPrice > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Доставка</span>
                  <span>{deliveryPrice.toLocaleString()} ₽</span>
                </div>
              )}
              {deliveryPrice === 0 && selectedDelivery !== "pickup" && (
                <div className="flex justify-between text-sm">
                  <span>Доставка</span>
                  <span className="text-green-600">Бесплатно</span>
                </div>
              )}
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="mb-4 flex items-center justify-between text-xl font-bold">
                <span>К оплате:</span>
                <span>{(totalPrice + deliveryPrice).toLocaleString()} ₽</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full"
              >
                {isSubmitting ? "Оформляем..." : "Оформить заказ"}
              </button>
              
              {/* Дополнительная информация */}
              <p className="mt-3 text-xs text-gray-500 text-center">
                Нажимая кнопку, вы соглашаетесь с <a href="/privacy" className="underline hover:text-primary-600">политикой конфиденциальности</a>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

