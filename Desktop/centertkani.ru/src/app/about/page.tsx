"use client";

import { ArrowLeft, Users, Award, Heart, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutPage() {
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
          О нас
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-gray-600">
          Мы специализируемся на продаже качественных тканей для одежды и дома
          уже более 10 лет. Наш ассортимент включает широкий выбор материалов
          различных фактур, цветов и назначений.
        </p>
      </div>

      {/* Main content */}
      <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Text content */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Наша история
            </h2>
            <p className="mb-4 text-gray-600">
              Мы начали свою деятельность в 2013 году с небольшого склада в Москве
              и амбициозной цели — сделать качественные ткани доступными для
              широкой аудитории.
            </p>
            <p className="mb-4 text-gray-600">
              За годы работы мы накопили богатый опыт и установили прочные
              партнерские отношения с ведущими производителями тканей из России,
              Турции, Китая и европейских стран.
            </p>
            <p className="text-gray-600">
              Сегодня CENTER TKANI — это команда профессионалов, готовая помочь
              вам выбрать идеальную ткань для любого проекта.
            </p>
          </div>
        </div>

        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src="/images/placeholders/work-1.jpg"
            alt="Наша команда"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
          Наши ценности
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Award,
              title: "Качество",
              description:
                "Только проверенные ткани от надежных производителей",
            },
            {
              icon: Heart,
              title: "Забота",
              description: "Индивидуальный подход к каждому клиенту",
            },
            {
              icon: Shield,
              title: "Надежность",
              description: "Гарантии качества и точные сроки доставки",
            },
            {
              icon: Users,
              title: "Экспертиза",
              description: "Профессиональные консультации по выбору тканей",
            },
          ].map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-lg bg-gray-50 p-6 text-center"
            >
              <value.icon className="mx-auto mb-4 h-12 w-12 text-primary-600" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {value.title}
              </h3>
              <p className="text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Why us */}
      <div className="rounded-lg bg-primary-600 p-8 text-white lg:p-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold">
            Почему выбирают нас
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="text-left">
              <h3 className="mb-2 text-lg font-semibold">Более 10 лет опыта</h3>
              <p className="text-white/90">
                Наша команда знает все о тканях и их применении
              </p>
            </div>
            <div className="text-left">
              <h3 className="mb-2 text-lg font-semibold">Широкий ассортимент</h3>
              <p className="text-white/90">
                Тысячи позиций тканей для одежды и дома
              </p>
            </div>
            <div className="text-left">
              <h3 className="mb-2 text-lg font-semibold">Оптовые и розничные цены</h3>
              <p className="text-white/90">
                Работаем с юр. лицами и частными клиентами
              </p>
            </div>
            <div className="text-left">
              <h3 className="mb-2 text-lg font-semibold">Быстрая доставка</h3>
              <p className="text-white/90">
                Доставка по всей России через СДЭК, Почту России и Ozon
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

