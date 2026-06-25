import Link from "next/link";
import { ArrowRight, Eye, Heart, Shield, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] py-24 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C4A265] mb-4">
            Our Story
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Crafting Timeless Style Since 2024
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-xl mx-auto">
            At Chronos & Shade, we believe that the right accessory doesn't
            just complete an outfit — it defines a moment. We curate premium
            watches and designer sunglasses for those who refuse to settle for
            ordinary.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-[#C4A265]/10 flex items-center justify-center mb-6">
              <Eye size={24} className="text-[#C4A265]" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[#1a1a1a] mb-4">
              Our Vision
            </h2>
            <p className="text-gray-500 leading-relaxed">
              To become Bangladesh's most trusted destination for premium
              watches and sunglasses — where every customer finds their perfect
              expression of style without the friction of traditional retail.
              We envision a shopping experience that's as refined as the
              products we sell.
            </p>
          </div>
          <div>
            <div className="w-14 h-14 rounded-2xl bg-[#C4A265]/10 flex items-center justify-center mb-6">
              <Heart size={24} className="text-[#C4A265]" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[#1a1a1a] mb-4">
              Our Mission
            </h2>
            <p className="text-gray-500 leading-relaxed">
              To make premium accessories accessible to everyone. We carefully
              select each product in our collection for its craftsmanship,
              design, and value. No registration walls, no unnecessary steps —
              just find what you love, check out as a guest, and let us handle
              the rest.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#faf9f6] py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C4A265] mb-3">
              What We Stand For
            </p>
            <h2 className="font-display text-3xl font-bold text-[#1a1a1a]">
              Our Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Award size={24} />,
                title: "Authenticity",
                desc: "Every product is 100% genuine. We work directly with authorized distributors to guarantee authenticity.",
              },
              {
                icon: <Shield size={24} />,
                title: "Quality First",
                desc: "We don't chase trends at the expense of quality. Each item is inspected before it reaches you.",
              },
              {
                icon: <Heart size={24} />,
                title: "Customer Care",
                desc: "From browsing to delivery and beyond — your satisfaction drives every decision we make.",
              },
              {
                icon: <Eye size={24} />,
                title: "Curated Selection",
                desc: "We don't sell everything. We sell the right things — carefully chosen pieces that stand the test of time.",
              },
            ].map((val, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border border-gray-100"
              >
                <div className="text-[#C4A265] mb-4">{val.icon}</div>
                <h3 className="text-base font-bold text-[#1a1a1a] mb-2">
                  {val.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C4A265] mb-3">
            The Chronos & Shade Difference
          </p>
          <h2 className="font-display text-3xl font-bold text-[#1a1a1a]">
            Why Shop With Us
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              number: "01",
              title: "No Account Required",
              desc: "Shop and checkout as a guest. We respect your time — no forced registrations, no password headaches.",
            },
            {
              number: "02",
              title: "2-Year Warranty",
              desc: "Every watch comes with a 2-year warranty. Every pair of sunglasses is covered for 1 year. We stand behind what we sell.",
            },
            {
              number: "03",
              title: "30-Day Returns",
              desc: "Changed your mind? No problem. Return any unworn item within 30 days for a full refund, no questions asked.",
            },
          ].map((item, i) => (
            <div key={i} className="relative pl-16">
              <span className="absolute left-0 top-0 text-4xl font-bold text-[#C4A265]/20 font-display">
                {item.number}
              </span>
              <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1a1a1a] py-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Ready to Find Your Style?
          </h2>
          <p className="text-white/50 text-sm mb-8 leading-relaxed">
            Browse our curated collection of premium watches and designer
            sunglasses.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#C4A265] text-[#1a1a1a] rounded-lg text-sm font-bold hover:bg-[#b8964e] transition"
          >
            Shop Now <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}