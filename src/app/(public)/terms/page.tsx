import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — ProBuildCalc",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: March 4, 2026</p>

        <div className="prose prose-sm dark:prose-invert space-y-6 text-foreground">
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By creating an account or using ProBuildCalc, you agree to these Terms of Service.
              If you do not agree, do not use the service. ProBuildCalc is intended for use by
              contractors and construction professionals for creating quotes, managing customers,
              and tracking jobs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">2. Account Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed">
              You are responsible for maintaining the security of your account credentials. You must
              provide accurate information when creating your account. You are responsible for all
              activity that occurs under your account. Notify us immediately of any unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">3. Subscription & Billing</h2>
            <p className="text-muted-foreground leading-relaxed">
              ProBuildCalc offers a free tier (5 quotes/month) and paid plans (Pro at $29/month,
              Business at $49/month). Paid plans include a 14-day free trial. Subscriptions renew
              automatically unless cancelled. Refunds are available within 30 days of purchase.
              Payments are processed securely via Stripe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">4. Acceptable Use</h2>
            <p className="text-muted-foreground leading-relaxed">
              You may not use ProBuildCalc for any illegal purpose, to harass others, to distribute
              malware, or to attempt to gain unauthorized access to our systems. We reserve the right
              to suspend or terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">5. Your Data</h2>
            <p className="text-muted-foreground leading-relaxed">
              You retain ownership of all data you create in ProBuildCalc including quotes, customer
              information, photos, and files. We do not claim any intellectual property rights over your
              content. You grant us a license to store and process your data solely for providing the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">6. Service Availability</h2>
            <p className="text-muted-foreground leading-relaxed">
              We strive to maintain 99.9% uptime but do not guarantee uninterrupted service. We may
              perform maintenance with reasonable notice. The offline features of the iOS app allow
              continued use during service interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">7. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              ProBuildCalc is provided &ldquo;as is&rdquo; without warranties of any kind.
              We are not liable for any indirect, incidental, or consequential damages arising from
              use of the service. Our total liability is limited to the amount you have paid us in
              the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">8. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              You may delete your account at any time from Settings. We may terminate accounts that
              violate these terms with notice. Upon termination, your data will be permanently deleted
              within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">9. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update these terms from time to time. Material changes will be communicated via
              email. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">10. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these terms, contact us at support@probuildcalc.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
