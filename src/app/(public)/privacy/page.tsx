export default function PrivacyPage() {
  return (
    <div className="max-w-[800px] mx-auto px-6 py-16">
      <div className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C4A265] mb-3">
          Legal
        </p>
        <h1 className="font-display text-4xl font-bold text-[#1a1a1a] mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-400">
          Last updated: June 25, 2026
        </p>
      </div>

      <div className="prose prose-gray max-w-none space-y-8 text-sm text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">
            1. Information We Collect
          </h2>
          <p>
            When you place an order on Chronos & Shade, we collect only the
            information necessary to process and deliver your order. Since we
            offer guest checkout, no account creation is required. The
            information we collect includes:
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-1.5">
            <li>Full name</li>
            <li>Phone number</li>
            <li>Email address (optional)</li>
            <li>Delivery address and district</li>
            <li>Order details and preferences</li>
            <li>Payment method selection</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">
            2. How We Use Your Information
          </h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-5 mt-3 space-y-1.5">
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations and delivery updates</li>
            <li>Communicate about your order if needed</li>
            <li>Improve our products and services</li>
            <li>Respond to your inquiries and support requests</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">
            3. Data Protection
          </h2>
          <p>
            We take the security of your personal information seriously. Your
            data is stored securely using industry-standard encryption. We do
            not store payment card details — all payment processing is handled
            by our secure payment partners (bKash, Nagad) or collected via
            Cash on Delivery.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">
            4. Information Sharing
          </h2>
          <p>
            We do not sell, trade, or rent your personal information to third
            parties. We may share your information only with:
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-1.5">
            <li>Delivery partners to fulfill your order</li>
            <li>Payment processors to handle transactions</li>
            <li>Legal authorities when required by law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">
            5. Cookies
          </h2>
          <p>
            Our website uses minimal cookies to maintain your shopping cart
            during your browsing session. We use local storage to persist your
            cart items so they remain available when you return. No tracking
            or advertising cookies are used.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">
            6. Your Rights
          </h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 mt-3 space-y-1.5">
            <li>Request access to your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt out of marketing communications</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">
            7. Order Data Retention
          </h2>
          <p>
            We retain order information for a period of 2 years to handle
            warranty claims, returns, and customer support inquiries. After
            this period, data is securely deleted unless required for legal
            compliance.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">
            8. Changes to This Policy
          </h2>
          <p>
            We may update this privacy policy from time to time. Any changes
            will be posted on this page with an updated revision date. We
            encourage you to review this page periodically.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">
            9. Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy or how we
            handle your data, please contact us at:
          </p>
          <div className="mt-3 bg-[#faf9f6] rounded-xl p-5">
            <p className="font-semibold text-[#1a1a1a]">Chronos & Shade</p>
            <p className="mt-1">Email: hello@chronosandshade.com</p>
            <p>Phone: +880 1712345678</p>
            <p>Address: Dhanmondi 27, Dhaka 1209, Bangladesh</p>
          </div>
        </section>
      </div>
    </div>
  );
}