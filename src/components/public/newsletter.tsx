"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="bg-[#1a1a1a] py-20 px-6">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="font-display text-3xl font-bold text-white mb-3">
          Stay in the Loop
        </h2>
        <p className="text-white/50 text-sm mb-8 leading-relaxed">
          Get early access to new arrivals, exclusive deals, and style guides
          delivered to your inbox.
        </p>
        <div className="flex gap-2.5 max-w-md mx-auto">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 px-5 py-3.5 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white text-sm outline-none focus:border-[#C4A265] transition"
          />
          <Button className="px-7 bg-[#C4A265] text-[#1a1a1a] font-bold hover:bg-[#b8964e] whitespace-nowrap">
            Subscribe
          </Button>
        </div>
      </div>
    </section>
  );
}