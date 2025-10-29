"use client";

import { ArrowLeft, Gift, Star, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoyaltyPage() {
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
          Программа лояльности
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-gray-600">
          Копите бонусы за покупки и оплачивайте ими до 50% стоимости заказов
        </p>
      </div>

      {/* How it works */}
      <div className="mb-16">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
          Как это работает
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              step: "1",
              title: "Делайте покупки",
              description:
                "Покупайте ткани в нашем магазине и получайте 1% с каждой покупки в виде бонусов",
              icon: TrendingUp,
            },
            {
              step: "2",
              title: "Копите бонусы",
              description:
                "Накапливайте бонусы на своем балансе. 1 бонус = 1 рубль, без ограничений по сроку",
              icon: Gift,
            },
            {
              step: "3",
              title: "Оплачивайте бонусами",
              description:
                "Используйте бонусы для оплаты до 50% стоимости заказа. Экономьте с каждой покупкой",
              icon: Star,
            },
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-2xl font-bold text-white">
                {item.step}
              </div>
              <item.icon className="mx-auto mb-4 h-12 w-12 text-primary-600" />
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="mb-16 rounded-lg bg-primary-600 p-8 text-white lg:p-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Преимущества программы
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              "1% с каждой покупки возвращается бонусами",
              "1 бонус = 1 рубль - простая система",
              "Оплата до 50% стоимости заказа",
              "Без ограничений по сроку использования",
              "Работает онлайн и офлайн",
              "Специальные бонусные акции",
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-white" />
                <p className="text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conditions */}
      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
          Условия программы
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Накопление бонусов",
              content: "Получайте 1% от суммы покупки в виде бонусов на ваш баланс",
              icon: TrendingUp,
            },
            {
              title: "Использование",
              content:
                "Оплачивайте бонусами до 50% стоимости заказа при оформлении",
              icon: Gift,
            },
            {
              title: "Активность",
              content:
                "Бонусы начисляются после оплаты заказа и доступны сразу",
              icon: Users,
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-lg border border-gray-200 bg-gray-50 p-6"
            >
              <item.icon className="mb-4 h-10 w-10 text-primary-600" />
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.content}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="rounded-lg bg-gray-50 p-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
          Часто задаваемые вопросы
        </h2>
        <div className="mx-auto max-w-3xl space-y-6">
          {[
            {
              q: "Как зарегистрироваться в программе?",
              a: "Автоматически при создании аккаунта на сайте. Все покупки с вашего аккаунта будут приносить бонусы.",
            },
            {
              q: "Где посмотреть баланс бонусов?",
              a: "В личном кабинете в разделе 'Программа лояльности'. Там вы увидите баланс и историю начислений.",
            },
            {
              q: "Как использовать бонусы?",
              a: "При оформлении заказа в корзине вы увидите опцию 'Оплатить бонусами'. Укажите сумму к оплате (до 50% от стоимости заказа).",
            },
            {
              q: "Есть ли срок действия бонусов?",
              a: "Нет, бонусы не имеют срока действия. Используйте их когда удобно.",
            },
            {
              q: "Можно ли сочетать бонусы с промокодами?",
              a: "Да, вы можете использовать и бонусы, и промокоды одновременно для максимальной выгоды.",
            },
          ].map((item, index) => (
            <div key={index} className="border-t border-gray-200 pt-6 first:border-t-0 first:pt-0">
              <h3 className="mb-2 font-semibold text-gray-900">{item.q}</h3>
              <p className="text-gray-600">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-primary-700"
        >
          Начать зарабатывать бонусы
        </Link>
      </div>
    </div>
  );
}

