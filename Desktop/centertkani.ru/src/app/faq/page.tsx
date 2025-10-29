"use client";

import { ArrowLeft, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faq = [
  {
    category: "Общие вопросы",
    questions: [
      {
        q: "Какой минимальный заказ?",
        a: "Минимальный заказ составляет 0.5 метра для всех позиций. Вы можете заказать любой метраж ткани с шагом 0.1 метра.",
      },
      {
        q: "Вы работаете с физическими и юридическими лицами?",
        a: "Да, мы работаем как с частными клиентами, так и с юридическими лицами. Для юр. лиц доступна оплата по счету с НДС 20%.",
      },
      {
        q: "Где находится ваш склад?",
        a: "Наш склад находится в Москве. Адрес: г. Москва, ул. Складская, д. 1. Режим работы: с 9:00 до 18:00.",
      },
      {
        q: "Можно ли посмотреть и потрогать ткань перед покупкой?",
        a: "Да, вы можете приехать на склад для ознакомления с товаром. Предварительно созвонитесь с нами, чтобы убедиться, что нужная позиция есть в наличии.",
      },
    ],
  },
  {
    category: "Оплата",
    questions: [
      {
        q: "Какие способы оплаты вы принимаете?",
        a: "Мы принимаем оплату банковской картой на сайте, наложенным платежом при получении и по счету для юридических лиц.",
      },
      {
        q: "Есть ли дополнительная комиссия при оплате?",
        a: "При оплате онлайн комиссии нет. При оплате при получении (наложенный платеж) комиссия составляет 300₽. При оплате по счету НДС 20% включен в стоимость.",
      },
      {
        q: "Как быстро приходит уведомление об оплате?",
        a: "При онлайн-оплате уведомление приходит мгновенно. При оплате по счету - в течение 24 часов после поступления средств.",
      },
    ],
  },
  {
    category: "Доставка",
    questions: [
      {
        q: "Как долго идет доставка?",
        a: "Самовывоз - в день заказа. СДЭК - 1-3 дня. Почта России - 5-10 дней. Ozon Delivery - 1-2 дня.",
      },
      {
        q: "Доставляете ли вы за пределы Москвы?",
        a: "Да, мы доставляем по всей России через СДЭК, Почту России и Ozon Delivery.",
      },
      {
        q: "Можно ли отследить посылку?",
        a: "Да, мы предоставляем трек-номер для отслеживания через курьерскую службу или почту.",
      },
      {
        q: "Что делать, если товар пришел с браком?",
        a: "Свяжитесь с нами в течение 7 дней после получения. Мы заменим товар или вернем деньги.",
      },
    ],
  },
  {
    category: "Товары",
    questions: [
      {
        q: "Откуда берутся ткани?",
        a: "Мы работаем с поставщиками из России, Турции, Китая и европейских стран. Все ткани проходят контроль качества.",
      },
      {
        q: "Есть ли гарантия на ткань?",
        a: "Мы даем гарантию на отсутствие скрытых дефектов. Если ткань оказалась с недостатками, мы вернем деньги или заменим товар.",
      },
      {
        q: "Как правильно рассчитать метраж?",
        a: "Минимальный заказ 0.5 метра. Далее - любой метраж с шагом 0.1 метра. Если сомневаетесь, проконсультируйтесь с нашим менеджером.",
      },
      {
        q: "Можно ли вернуть товар?",
        a: "Ткань нельзя вернуть по закону о защите прав потребителей, если она не бракованная. Бракованный товар возвращается в течение 7 дней после получения.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    new Set([faq[0].category])
  );
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set());

  const toggleCategory = (category: string) => {
    const newSet = new Set(openCategories);
    if (newSet.has(category)) {
      newSet.delete(category);
    } else {
      newSet.add(category);
    }
    setOpenCategories(newSet);
  };

  const toggleQuestion = (question: string) => {
    const newSet = new Set(openQuestions);
    if (newSet.has(question)) {
      newSet.delete(question);
    } else {
      newSet.add(question);
    }
    setOpenQuestions(newSet);
  };

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
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Часто задаваемые вопросы
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-gray-600">
          На этой странице собраны ответы на самые популярные вопросы
        </p>
      </div>

      {/* FAQ */}
      <div className="space-y-6">
        {faq.map((category) => (
          <div key={category.category} className="rounded-lg border border-gray-200 bg-white">
            <button
              onClick={() => toggleCategory(category.category)}
              className="flex w-full items-center justify-between p-6 text-left"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                {category.category}
              </h2>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  openCategories.has(category.category) ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {openCategories.has(category.category) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6">
                    <div className="space-y-4">
                      {category.questions.map((item) => (
                        <div
                          key={item.q}
                          className="rounded-lg border border-gray-100 bg-gray-50"
                        >
                          <button
                            onClick={() => toggleQuestion(item.q)}
                            className="flex w-full items-center justify-between p-4 text-left"
                          >
                            <span className="font-medium text-gray-900">
                              {item.q}
                            </span>
                            <ChevronDown
                              className={`h-4 w-4 text-gray-500 transition-transform ${
                                openQuestions.has(item.q) ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          <AnimatePresence>
                            {openQuestions.has(item.q) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="border-t border-gray-200 px-4 pb-4 pt-4">
                                  <p className="text-gray-600">{item.a}</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="mt-12 rounded-lg bg-primary-600 p-8 text-center text-white">
        <h2 className="mb-4 text-2xl font-bold">
          Не нашли ответ на свой вопрос?
        </h2>
        <p className="mb-6 text-white/90">
          Свяжитесь с нами, и мы обязательно поможем
        </p>
        <Link
          href="/contacts"
          className="inline-flex items-center rounded-lg bg-white px-6 py-3 font-semibold text-primary-600 transition-colors hover:bg-gray-50"
        >
          Связаться с нами
        </Link>
      </div>
    </div>
  );
}

