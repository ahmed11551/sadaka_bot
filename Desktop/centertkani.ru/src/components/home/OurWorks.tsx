"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// Mock data - will be replaced with API call
const ourWorks = [
  {
    id: "1",
    title: "Пример работы 1",
    image: "/images/placeholders/work-1.jpg",
    fabricName: "Ткань премиум",
    fabricLink: "/catalog/fabric-1",
  },
  {
    id: "2",
    title: "Пример работы 2",
    image: "/images/placeholders/work-2.jpg",
    fabricName: "Ткань стандарт",
    fabricLink: "/catalog/fabric-2",
  },
  {
    id: "3",
    title: "Пример работы 3",
    image: "/images/placeholders/work-3.jpg",
    fabricName: "Ткань эконом",
    fabricLink: "/catalog/fabric-3",
  },
  {
    id: "4",
    title: "Пример работы 4",
    image: "/images/placeholders/work-4.jpg",
    fabricName: "Ткань премиум",
    fabricLink: "/catalog/fabric-1",
  },
];

export default function OurWorks() {
  return (
    <section className="py-12 lg:py-16">
      <div className="container-custom">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900"
            >
              Работы из наших тканей
            </motion.h2>
            <p className="mt-2 text-gray-600">
              Вдохновляйтесь идеями для ваших проектов
            </p>
          </div>
          <Link
            href="/works"
            className="hidden items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 sm:flex"
          >
            Все работы
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ourWorks.map((work) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group cursor-pointer overflow-hidden rounded-lg"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="text-sm font-semibold">{work.title}</div>
                  <Link
                    href={work.fabricLink}
                    className="text-xs underline hover:no-underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {work.fabricName} →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

