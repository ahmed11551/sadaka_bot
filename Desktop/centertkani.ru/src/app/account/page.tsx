"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Package, Gift } from "lucide-react";

type TabType = "profile" | "orders" | "loyalty";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  return (
    <div className="container-custom py-8 lg:py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Личный кабинет</h1>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar */}
        <aside className="space-y-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
              activeTab === "profile"
                ? "bg-primary-50 text-primary-700"
                : "hover:bg-gray-50"
            }`}
          >
            <User className="h-5 w-5" />
            <span className="font-medium">Профиль</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
              activeTab === "orders"
                ? "bg-primary-50 text-primary-700"
                : "hover:bg-gray-50"
            }`}
          >
            <Package className="h-5 w-5" />
            <span className="font-medium">Заказы</span>
          </button>

          <button
            onClick={() => setActiveTab("loyalty")}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
              activeTab === "loyalty"
                ? "bg-primary-50 text-primary-700"
                : "hover:bg-gray-50"
            }`}
          >
            <Gift className="h-5 w-5" />
            <span className="font-medium">Лояльность</span>
          </button>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <Link
              href="/login"
              className="block text-sm text-gray-600 hover:text-primary-600"
            >
              Выйти
            </Link>
          </div>
        </aside>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "loyalty" && <LoyaltyTab />}
        </div>
      </div>
    </div>
  );
}

function ProfileTab() {
  return (
    <div className="card p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Профиль</h2>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Имя
          </label>
          <input
            type="text"
            className="input-field"
            defaultValue="Иван Иванов"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            className="input-field"
            defaultValue="ivan@example.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Телефон
          </label>
          <input
            type="tel"
            className="input-field"
            defaultValue="+7 (999) 123-45-67"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Дата рождения
          </label>
          <input type="date" className="input-field" />
        </div>

        <div className="pt-4">
          <button className="btn-primary">Сохранить изменения</button>
        </div>
      </div>
    </div>
  );
}

function OrdersTab() {
  // Mock данные заказов
  const orders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "Доставлен",
      total: 3500,
      items: 2,
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      status: "В пути",
      total: 2100,
      items: 1,
    },
    {
      id: "ORD-003",
      date: "2024-01-05",
      status: "Отменен",
      total: 1800,
      items: 3,
    },
  ];

  return (
    <div className="card p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">История заказов</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border-b border-gray-200 pb-4 last:border-b-0"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">
                  Заказ №{order.id}
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {order.date} • {order.items} товар(ов)
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">
                  {order.total.toLocaleString()} ₽
                </div>
                <div
                  className={`mt-1 text-sm font-medium ${
                    order.status === "Доставлен"
                      ? "text-green-600"
                      : order.status === "В пути"
                      ? "text-blue-600"
                      : "text-red-600"
                  }`}
                >
                  {order.status}
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="btn-secondary text-sm">Детали</button>
              <button className="btn-secondary text-sm">Повторить заказ</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoyaltyTab() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Программа лояльности
            </h2>
            <p className="mt-2 text-gray-600">
              Копите бонусы и оплачивайте покупки
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600">850</div>
            <div className="text-sm text-gray-600">бонусов</div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Как работает программа
        </h3>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-primary-600">•</span>
            <span>За каждую покупку вы получаете 1% от суммы бонусами</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600">•</span>
            <span>1 бонус = 1 рубль</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600">•</span>
            <span>Бонусами можно оплатить до 50% от суммы заказа</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600">•</span>
            <span>Бонусы действуют 365 дней</span>
          </li>
        </ul>
      </div>

      <div className="card p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          История операций
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700">Начисление бонусов</span>
            <span className="font-semibold text-green-600">+150 ₽</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Заказ ORD-001</span>
            <span>15.01.2024</span>
          </div>
        </div>
      </div>
    </div>
  );
}

