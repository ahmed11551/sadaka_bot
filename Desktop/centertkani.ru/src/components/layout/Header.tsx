"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  ShoppingCart, 
  Menu, 
  ChevronDown
} from "lucide-react";
import { useCart } from "@/store/cart-store";
import MobileMenu from "./MobileMenu";

const mainCategories = [
  { name: "О нас", href: "/about" },
  { name: "Оплата и доставка", href: "/delivery" },
  { name: "Часто задаваемые вопросы", href: "/faq" },
  { name: "Программа лояльности", href: "/loyalty" },
  { name: "Контакты", href: "/contacts" },
];

const clothingFabrics = [
  "Шелк", "Футер", "Трикотаж", "Вискоза", "Тенсель", "Лен", 
  "Купра", "Хлопок", "Штапель", "Джинса"
];

const homeFabrics = [
  "Сатин Турция", "Однотон / Страйп", "Принт", "Сатин Китай",
  "Тенсель 605", "Поплин Турция", "Дак", "Вафельное полотно",
  "Махра", "Пике косичка", "Фланель", "Муслин"
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top info bar - информационный ряд */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="container-custom py-2.5">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-6">
              <Link href="/marketplaces/wb" className="hover:text-primary-600">
                Мы на WB
              </Link>
              <Link href="/marketplaces/ozon" className="hover:text-primary-600">
                Мы на OZON
              </Link>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/about" className="hover:text-primary-600">
                О нас
              </Link>
              <Link href="/delivery" className="hover:text-primary-600">
                Оплата и доставка
              </Link>
              <Link href="/faq" className="hover:text-primary-600">
                FAQ
              </Link>
              <Link href="/loyalty" className="hover:text-primary-600">
                Программа лояльности
              </Link>
              <Link href="/contacts" className="hover:text-primary-600">
                Контакты
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header - основной каталог */}
      <div className="container-custom py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image 
              src="/icons/logo-ct.svg"
              alt="CT"
              width={36}
              height={16}
              className="h-4 w-auto flex-shrink-0"
              unoptimized
            />
            <Image 
              src="/icons/logo-text.svg"
              alt="CENTER TKANI"
              width={120}
              height={11}
              className="h-[10.352px] w-auto"
              unoptimized
            />
          </Link>

          {/* Search Bar - Center */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <input
                type="search"
                placeholder="Поиск по сайту"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Actions - Right side */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* User Icon with rounded background */}
            <Link href="/login" className="flex items-center justify-center h-[40px] w-[40px] rounded-full bg-white">
              <Image 
                src="/icons/user-icon.svg"
                alt="User Account"
                width={24}
                height={24}
              />
            </Link>

            <Link href="/cart" className="relative flex items-center justify-center h-[40px] w-[40px] rounded-full bg-white">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#9b1e1c] text-xs font-semibold text-white">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="border-t border-gray-200 bg-white">
        <div className="container-custom py-3">
          <nav className="hidden lg:flex lg:items-center lg:gap-8">
            <button
              onClick={() => setIsCatalogOpen(!isCatalogOpen)}
              className={`text-sm font-semibold transition-colors flex items-center gap-1 ${
                isCatalogOpen ? "text-primary-600" : "text-gray-700 hover:text-primary-600"
              }`}
            >
              Каталог
              <ChevronDown className="h-4 w-4" />
            </button>
            <Link
              href="/works"
              className="text-sm font-semibold text-gray-700 transition-colors hover:text-primary-600"
            >
              Работы из наших тканей
            </Link>
            <Link
              href="/sale"
              className="text-sm font-semibold text-gray-700 transition-colors hover:text-primary-600"
            >
              Скидки и акции
            </Link>
          </nav>
        </div>
      </div>

      {/* Mega Menu Dropdown */}
      {isCatalogOpen && (
        <div className="border-t border-gray-200 bg-white">
          <div className="container-custom py-8">
            <div className="grid grid-cols-2 gap-12">
              {/* Для одежды */}
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Для одежды
                </h3>
                <div className="space-y-2">
                  {clothingFabrics.map((fabric) => (
                    <Link
                      key={fabric}
                      href={`/catalog/odezhda?filter=${fabric}`}
                      className="block text-sm text-gray-600 transition-colors hover:text-primary-600"
                    >
                      {fabric}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Для дома */}
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Для дома
                </h3>
                <div className="space-y-2">
                  {homeFabrics.map((fabric) => (
                    <Link
                      key={fabric}
                      href={`/catalog/dom?filter=${fabric}`}
                      className="block text-sm text-gray-600 transition-colors hover:text-primary-600"
                    >
                      {fabric}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        categories={mainCategories}
      />
    </header>
  );
}

