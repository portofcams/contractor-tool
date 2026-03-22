import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — ProBuildCalc",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: March 4, 2026</p>

        <div className="prose prose-sm dark:prose-invert space-y-6 text-foreground">
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">
              When you create an account, we collect your company name, email address, and password.
              When you use ProBuildCalc, we store the data you provide including customer information,
              quotes, invoices, photos, floor plans, and voice notes. We also collect usage data such as
              login times and feature usage to improve the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">2. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use your information to provide and improve ProBuildCalc, send transactional emails
              (quote notifications, password resets), process payments via Stripe, and provide customer
              support. We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">3. Data Storage & Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your data is stored on secure servers with encrypted connections (TLS/SSL). Passwords are
              hashed using bcrypt. Payment information is processed by Stripe and never stored on our
              servers. We implement industry-standard security measures to protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">4. Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the following third-party services: Stripe for payment processing, Resend for
              email delivery, Google for authentication (optional), and Cloudflare for content delivery.
              Each service has its own privacy policy governing data handling.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">5. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              You can access, update, or delete your account data at any time from the Settings page.
              Deleting your account permanently removes all associated data including customers, quotes,
              invoices, photos, and files. You may export your data before deletion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">6. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use essential cookies for authentication and session management. We do not use
              third-party tracking cookies. Analytics are collected via Google Analytics with
              anonymized IP addresses.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">7. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of significant
              changes via email or in-app notification. Continued use of ProBuildCalc after changes
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">8. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For privacy-related questions, contact us at support@probuildcalc.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
