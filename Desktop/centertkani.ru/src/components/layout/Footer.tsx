import Link from "next/link";
import { Phone, Mail, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Company info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">
              Центр тканей
            </h3>
            <p className="text-sm text-gray-600">
              Качественные ткани для дома и одежды.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900">
              Контакты
            </h4>
            <div className="space-y-3">
              <a href="tel:+7XXXXXXXXXX" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600">
                <Phone className="h-4 w-4" />
                +7 (XXX) XXX-XX-XX
              </a>
              <a href="mailto:info@centertkani.ru" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600">
                <Mail className="h-4 w-4" />
                info@centertkani.ru
              </a>
            </div>
          </div>

          {/* Social icons */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900">
              Связаться с нами
            </h4>
            <div className="flex items-center gap-4">
              <a
                href="https://wa.me/7XXXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500 text-white transition-colors hover:bg-green-600"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-500 md:flex-row">
            <div>&copy; {new Date().getFullYear()} Центр тканей. Все права защищены.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

