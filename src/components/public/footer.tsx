"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { publicApi } from "@/lib/api";

const FB_PATH = "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z";
const IG_PATH = "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z";
const TW_PATH = "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z";
const YT_PATH = "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z";

export default function Footer() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    publicApi.getSettings().then(setSettings).catch(() => {});
  }, []);

  const socials = [
    { key: "facebook", path: FB_PATH },
    { key: "instagram", path: IG_PATH },
    { key: "twitter", path: TW_PATH },
    { key: "youtube", path: YT_PATH },
  ];

  return (
    <footer className="bg-[#111] pt-16 pb-8 px-6 text-gray-500">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="font-display text-2xl font-bold text-white mb-3">
              Chronos <span className="text-[#C4A265]">&</span> Shade
            </h3>
            <p className="text-sm leading-relaxed mb-5 max-w-[300px]">
              Premium watches and designer sunglasses. Curated for those who
              value quality and style.
            </p>
            <div className="flex gap-3">
              {socials
                .filter((s) => settings[s.key])
                .map((social) => (<a
                  
                    key={social.key}
                    href={settings[social.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-[#1a1a1a] flex items-center justify-center cursor-pointer hover:bg-[#C4A265]/20 transition"
                  >
                    <svg
                      className="w-4 h-4 text-[#C4A265]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
            </div>
          </div>
          {[
            {
              title: "Shop",
              links: [
                { label: "All Watches", href: "/products?categoryId=1" },
                { label: "All Sunglasses", href: "/products?categoryId=2" },
                { label: "Metal Wall Art", href: "/products?categoryId=3" },
                { label: "New Arrivals", href: "/products?sortBy=newest" },
              ],
            },
            {
              title: "Help",
              links: [
                { label: "Track Order", href: "/track" },
                { label: "Shipping & Returns", href: "/about" },
                { label: "FAQs", href: "/contact" },
                { label: "Contact Us", href: "/contact" },
              ],
            },
            {
              title: "Company",
              links: [
                { label: "About Us", href: "/about" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/privacy" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
                {col.title}
              </h4>
              {col.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-sm mb-2.5 hover:text-[#C4A265] transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 Chronos & Shade. All rights reserved.</p>
          <div className="flex gap-3">
            {["bKash", "Nagad", "VISA", "COD"].map((m) => (
              <span
                key={m}
                className="px-2.5 py-1 bg-[#1a1a1a] rounded text-[11px] font-semibold text-gray-600"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}