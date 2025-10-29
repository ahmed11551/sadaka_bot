"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="bg-primary-600 py-12 text-white lg:py-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
            О нас
          </h2>
          <p className="mb-8 text-lg leading-relaxed text-white/90">
            Мы специализируемся на продаже качественных тканей для одежды и дома 
            уже более 10 лет. Наш ассортимент включает широкий выбор материалов 
            различных фактур, цветов и назначений. 
          </p>
          <p className="mb-8 text-base leading-relaxed text-white/80">
            Мы работаем как с оптовыми покупателями, так и с частными клиентами, 
            обеспечивая высокий уровень сервиса и доступные цены. Наш склад находится 
            в Москве, но мы доставляем заказы по всей России.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white hover:text-primary-600"
          >
            Подробнее о нас
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

