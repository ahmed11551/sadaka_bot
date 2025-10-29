"use client";

import { ArrowLeft, Package, Truck, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DeliveryPage() {
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
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Оплата и доставка
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-gray-600">
          Мы предлагаем удобные способы оплаты и быструю доставку по всей России
        </p>
      </div>

      {/* Payment Methods */}
      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
          Способы оплаты
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Онлайн-оплата",
              description: "Банковской картой на сайте",
              icon: Package,
              features: [
                "Безопасная оплата",
                "Мгновенное подтверждение",
                "Все виды карт",
              ],
            },
            {
              title: "При получении",
              description: "Наложенным платежом",
              icon: Truck,
              features: [
                "Оплата наличными",
                "Оплата картой курьеру",
                "Комиссия 300₽",
              ],
            },
            {
              title: "По счету",
              description: "Для юридических лиц",
              icon: MapPin,
              features: [
                "С НДС 20%",
                "Счет на email",
                "Оплата 3 дня",
              ],
            },
          ].map((method, index) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <method.icon className="mb-4 h-12 w-12 text-primary-600" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {method.title}
              </h3>
              <p className="mb-4 text-gray-600">{method.description}</p>
              <ul className="space-y-2">
                {method.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Delivery Methods */}
      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
          Способы доставки
        </h2>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {[
            {
              title: "Самовывоз",
              price: "Бесплатно",
              time: "В день заказа",
              icon: Package,
              description: "Склад в Москве",
              address: "г. Москва, ул. Складская, д. 1",
              features: [
                "Бесплатная доставка",
                "В день заказа",
                "С 9:00 до 18:00",
              ],
            },
            {
              title: "СДЭК",
              price: "500₽",
              time: "1-3 дня",
              icon: Truck,
              description: "Быстрая доставка",
              features: [
                "Доставка по РФ",
                "1-3 рабочих дня",
                "Пункт выдачи или курьер",
              ],
            },
            {
              title: "Почта России",
              price: "300₽",
              time: "5-10 дней",
              icon: MapPin,
              description: "Доставка в любую точку России",
              features: [
                "Доступная цена",
                "Доставка в любой город",
                "Отслеживание посылки",
              ],
            },
            {
              title: "Ozon Delivery",
              price: "600₽",
              time: "1-2 дня",
              icon: Clock,
              description: "Премиум доставка",
              features: [
                "Самая быстрая",
                "Только в крупные города",
                "Доставка в день",
              ],
            },
          ].map((method, index) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <method.icon className="h-10 w-10 flex-shrink-0 text-primary-600" />
                  <div>
                    <h3 className="mb-1 text-xl font-semibold text-gray-900">
                      {method.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {method.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4 flex items-center gap-4 border-t border-gray-200 pt-4">
                <div>
                  <p className="text-sm text-gray-600">Стоимость</p>
                  <p className="text-lg font-bold text-primary-600">
                    {method.price}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Сроки</p>
                  <p className="text-lg font-bold text-gray-900">
                    {method.time}
                  </p>
                </div>
              </div>

              <ul className="space-y-2">
                {method.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
                    {feature}
                  </li>
                ))}
              </ul>

              {method.address && (
                <p className="mt-4 text-sm text-gray-600">
                  {method.address}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Order Process */}
      <div className="rounded-lg bg-gray-50 p-8 lg:p-12">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
          Как оформить заказ
        </h2>
        <div className="mx-auto max-w-3xl">
          <div className="space-y-6">
            {[
              "Выберите товары и добавьте в корзину",
              "Перейдите в корзину и проверьте заказ",
              "Выберите способ доставки и оплаты",
              "Заполните контактные данные",
              "Подтвердите заказ",
            ].map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white">
                  {index + 1}
                </div>
                <p className="pt-1 text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

