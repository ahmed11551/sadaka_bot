import Link from "next/link";

export default function PromoBlock() {
  return (
    <section className="py-16 bg-gradient-to-r from-purple-500 to-pink-600">
      <div className="container-custom">
        <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Широкий выбор высококачественных текстильных материалов со скидками до 50%
            </h2>
          </div>
          <div className="flex-shrink-0">
            <Link 
              href="/sale"
              className="btn-primary bg-white text-primary-600 px-8 py-4 text-base font-semibold hover:bg-gray-100"
            >
              Купить со скидкой
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

