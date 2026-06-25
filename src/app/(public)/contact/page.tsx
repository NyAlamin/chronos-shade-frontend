"use client";

import { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publicApi } from "@/lib/api";
import { toast } from "sonner";

export default function ContactPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    publicApi.getSettings().then(setSettings).catch(() => {});
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We will get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C4A265] mb-3">
          Get in Touch
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4">
          Contact Us
        </h1>
        <p className="text-gray-500 text-base max-w-lg mx-auto leading-relaxed">
          Have a question about our products, your order, or just want to say
          hello? We would love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16">
        <div>
          <h2 className="text-xl font-bold text-[#1a1a1a] mb-8">Our Information</h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#C4A265]/10 flex items-center justify-center flex-shrink-0">
                <MapPin size={20} className="text-[#C4A265]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1a1a1a] mb-1">Visit Us</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {settings.address || "Dhanmondi 27, Dhaka 1209, Bangladesh"}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#C4A265]/10 flex items-center justify-center flex-shrink-0">
                <Phone size={20} className="text-[#C4A265]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1a1a1a] mb-1">Call Us</h3>
                <p className="text-sm text-gray-500">
                  {settings.phone || "+880 1631863289"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Saturday - Thursday, 10am - 8pm</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#C4A265]/10 flex items-center justify-center flex-shrink-0">
                <Mail size={20} className="text-[#C4A265]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1a1a1a] mb-1">Email Us</h3>
                <p className="text-sm text-gray-500">
                  {settings.email || "hello@chronosandshade.com"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">We reply within 24 hours</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#C4A265]/10 flex items-center justify-center flex-shrink-0">
                <Clock size={20} className="text-[#C4A265]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1a1a1a] mb-1">Business Hours</h3>
                <p className="text-sm text-gray-500">Saturday - Thursday: 10am - 8pm</p>
                <p className="text-sm text-gray-500">Friday: Closed</p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100">
            <h3 className="text-sm font-bold text-[#1a1a1a] mb-4">Follow Us</h3>
            <p className="text-sm text-gray-500">
              Find us on social media. Check our Settings page for links.
            </p>
          </div>
        </div>

        <div className="bg-[#faf9f6] rounded-2xl p-8 md:p-10">
          <h2 className="text-xl font-bold text-[#1a1a1a] mb-2">Send us a Message</h2>
          <p className="text-sm text-gray-500 mb-8">
            Fill out the form and we will get back to you as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Your Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4A265] transition bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Email Address *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="purijoss7@gmail.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4A265] transition bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Subject *</label>
              <input
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="How can we help?"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4A265] transition bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Message *</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us what you are looking for..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C4A265] transition bg-white resize-vertical"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#1a1a1a] hover:bg-[#333] text-white font-bold rounded-lg gap-2"
            >
              <Send size={16} /> Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}