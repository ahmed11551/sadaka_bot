"use client";

import { ArrowLeft, MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
          Контакты
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-gray-600">
          Свяжитесь с нами любым удобным способом
        </p>
      </div>

      {/* Contact Info */}
      <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
        {[
          {
            icon: MapPin,
            title: "Адрес",
            content: ["г. Москва", "ул. Складская, д. 1"],
            subtext: "Склад-офис",
          },
          {
            icon: Phone,
            title: "Телефоны",
            content: ["+7 (495) 123-45-67", "+7 (495) 123-45-68"],
            subtext: "Пн-Пт: 9:00-18:00",
          },
          {
            icon: Mail,
            title: "Email",
            content: ["info@centertkani.ru", "orders@centertkani.ru"],
            subtext: "Ответим в течение дня",
          },
        ].map((contact, index) => (
          <motion.div
            key={contact.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm"
          >
            <contact.icon className="mx-auto mb-4 h-12 w-12 text-primary-600" />
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              {contact.title}
            </h3>
            <div className="space-y-1">
              {contact.content.map((item, i) => (
                <p key={i} className="text-gray-600">
                  {item}
                </p>
              ))}
            </div>
            {contact.subtext && (
              <p className="mt-3 text-sm text-gray-500">{contact.subtext}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Schedule */}
      <div className="mb-16 rounded-lg bg-gray-50 p-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
            <Clock className="h-6 w-6 text-primary-600" />
            Режим работы
          </h2>
          <div className="space-y-4">
            {[
              { day: "Понедельник - Пятница", time: "9:00 - 18:00" },
              { day: "Суббота", time: "10:00 - 16:00" },
              { day: "Воскресенье", time: "Выходной" },
            ].map((schedule, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-gray-200 pb-3 last:border-0"
              >
                <span className="font-medium text-gray-900">{schedule.day}</span>
                <span className="text-gray-600">{schedule.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form and Map */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Contact Form */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Напишите нам
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                Имя
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                Телефон
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
                Сообщение
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
            >
              <Send className="h-5 w-5" />
              Отправить сообщение
            </button>
          </form>
        </div>

        {/* Map placeholder */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Как нас найти
          </h2>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-200">
            {/* Map placeholder */}
            <div className="flex h-full items-center justify-center text-gray-500">
              <div className="text-center">
                <MapPin className="mx-auto mb-2 h-16 w-16" />
                <p className="font-medium">Карта загрузится здесь</p>
                <p className="text-sm">г. Москва, ул. Складская, д. 1</p>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-3 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary-600" />
              <p className="text-sm text-gray-600">
                Склад расположен в шаговой доступности от метро
              </p>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary-600" />
              <p className="text-sm text-gray-600">
                Парковка для клиентов
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

