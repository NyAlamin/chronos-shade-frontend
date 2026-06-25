"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Banner } from "@/types";
import { publicApi } from "@/lib/api";

function parseImages(image: string | null): string[] {
  if (!image) return [];
  try {
    const parsed = JSON.parse(image);
    if (Array.isArray(parsed)) return parsed;
    return [image];
  } catch {
    return image ? [image] : [];
  }
}

export default function HeroSlider() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    publicApi.getActiveBanners().then(setBanners).catch(() => {});
  }, []);

  // Auto-slide between banners
  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((p) => (p + 1) % banners.length);
        setBgIndex(0);
        setFade(true);
      }, 500);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // Auto-cycle background images within current banner
  useEffect(() => {
    if (banners.length === 0) return;
    const images = parseImages(banners[current]?.image);
    if (images.length < 2) return;

    const timer = setInterval(() => {
      setBgIndex((p) => (p + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [current, banners]);

  if (banners.length === 0) {
    return (
      <div className="h-[85vh] min-h-[550px] max-h-[800px] bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center">
        <div className="max-w-xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C4A265] mb-4">
            Welcome
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-5">
            Chronos & Shade
          </h1>
          <p className="text-white/60 text-base leading-relaxed mb-9">
            Premium watches and designer sunglasses
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2.5 px-10 py-4 bg-[#C4A265] text-[#1a1a1a] rounded-lg text-sm font-bold hover:bg-[#b8964e] transition"
          >
            Shop Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const slide = banners[current];
  const images = parseImages(slide?.image);
  const currentBg = images[bgIndex % images.length];

  const gradients = [
    "from-[#1a1a2e] via-[#16213e] to-[#0f3460]",
    "from-[#2d1b00] via-[#4a3728] to-[#1a1a1a]",
    "from-[#0a0a0a] via-[#1a1a1a] to-[#2a2a2a]",
  ];

  const nav = (dir: number) => {
    setFade(false);
    setTimeout(() => {
      setCurrent((p) => (p + dir + banners.length) % banners.length);
      setBgIndex(0);
      setFade(true);
    }, 300);
  };

  return (
    <div
      className={`relative h-[85vh] min-h-[550px] max-h-[800px] overflow-hidden bg-gradient-to-br ${
        gradients[current % gradients.length]
      }`}
    >
      {/* Background images with crossfade */}
      {images.length > 0 && (
        <div className="absolute inset-0">
          {images.map((img, i) => (
            <div
              key={img}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
              style={{
                backgroundImage: `url(${img})`,
                opacity: i === bgIndex % images.length ? 0.4 : 0,
              }}
            />
          ))}
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full border border-[#C4A265]/10" />
      <div className="absolute -bottom-36 -left-36 w-[600px] h-[600px] rounded-full border border-[#C4A265]/8" />

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center relative z-10">
        <div
          className={`max-w-xl transition-all duration-500 ${
            fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C4A265] mb-4">
            {slide.subtitle}
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-5">
            {slide.title}
          </h1>
          <p className="text-white/60 text-base leading-relaxed mb-9 max-w-md">
            {slide.description}
          </p>
          <Link
            href={slide.ctaLink || "/products"}
            className="inline-flex items-center gap-2.5 px-10 py-4 bg-[#C4A265] text-[#1a1a1a] rounded-lg text-sm font-bold hover:bg-[#b8964e] transition"
          >
            {slide.ctaText || "Shop Now"} <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Image dots (for current banner's images) */}
      {images.length > 1 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setBgIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === bgIndex % images.length
                  ? "bg-white w-4"
                  : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}

      {/* Banner slide indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => nav(i - current)}
            className={`h-2.5 rounded-full transition-all duration-400 ${
              i === current
                ? "w-8 bg-[#C4A265]"
                : "w-2.5 bg-white/25 hover:bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => nav(-1)}
        className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center hover:bg-white/20 transition z-10"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => nav(1)}
        className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center hover:bg-white/20 transition z-10"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}