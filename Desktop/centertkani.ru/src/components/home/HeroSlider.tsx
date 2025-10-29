"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const heroBanners = [
  {
    id: 1,
    title: "ТКАНЬ ДЛЯ ОДЕЖДЫ",
    image: "/images/hero/odezhda-from-figma.jpg",
    link: "/catalog/odezhda",
  },
  {
    id: 2,
    title: "ТКАНЬ ДЛЯ ДОМА",
    image: "/images/hero/dom-from-figma.jpg",
    link: "/catalog/dom",
  },
];

export default function HeroSlider() {
  return (
    <section className="container-custom py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        {heroBanners.map((banner, index) => (
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[14px]"
          >
            <Link href={banner.link}>
              {/* Hero Card with Image */}
              <div className="relative aspect-[4/3] bg-gray-200 rounded-[14px] overflow-hidden">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(16,16,16,0.04)] to-[rgba(16,16,16,0.4)]" />
                
                {/* Title and Indicators Container */}
                <div className="absolute bottom-0 left-0 right-0 pb-[27px] px-[27px]">
                  {/* Title - absolute positioned */}
                  <div className="mb-6">
                    <h2 className="text-[60px] font-bold text-white leading-[1.2] whitespace-pre-wrap">
                      {banner.title}
                    </h2>
                  </div>

                  {/* Slider Indicators */}
                  <div className="flex gap-[10px]">
                    {heroBanners.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 rounded-full transition-all ${
                          i === index
                            ? "bg-[#f1f0ee] w-[118px]"
                            : "bg-[rgba(241,240,238,0.3)] w-[152px]"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

