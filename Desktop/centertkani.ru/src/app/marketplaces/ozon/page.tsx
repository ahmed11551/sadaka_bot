"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function OzonPage() {
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
          Мы на OZON
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-gray-600">
          Покупайте качественные ткани на OZON с быстрой доставкой по всей России
        </p>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src="/images/placeholders/work-2.jpg"
            alt="OZON"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Почему выбирают нас на OZON
            </h2>
            <p className="mb-4 text-gray-600">
              CENTER TKANI - один из ведущих продавцов тканей на площадке OZON.
              Более 800 довольных покупателей ежемесячно.
            </p>
            <p className="text-gray-600">
              На нашем маркетплейсе вы найдете широкий ассортимент тканей для
              одежды и дома с доставкой по всей России через OZON Express.
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Преимущества
            </h3>
            <ul className="space-y-3">
              {[
                "Быстрая доставка (1-2 дня)",
                "Широкий ассортимент",
                "Гарантия качества",
                "Выгодные цены",
                "Отзывы покупателей",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary-600" />
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <a
            href="https://www.ozon.ru"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Перейти на OZON
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
}

