"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Array<{ name: string; href: string }>;
}

export default function MobileMenu({ isOpen, onClose, categories }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Menu panel */}
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold">Меню</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <div className="space-y-1">
              {categories.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  onClick={onClose}
                  className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 space-y-2 text-sm text-gray-600">
            <div className="font-medium text-gray-900">Контакты</div>
            <div>+7 (XXX) XXX-XX-XX</div>
            <div>info@centertkani.ru</div>
          </div>
        </div>
      </div>
    </div>
  );
}

