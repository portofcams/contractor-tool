import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support — ProBuildCalc",
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-2">Support</h1>
        <p className="text-muted-foreground mb-8">
          We&apos;re here to help you get the most out of ProBuildCalc.
        </p>

        <div className="prose prose-sm dark:prose-invert space-y-6 text-foreground">
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              Questions, bug reports, or feature requests? Email{" "}
              <a href="mailto:support@probuildcalc.com" className="underline">
                support@probuildcalc.com
              </a>{" "}
              and we&apos;ll get back to you, typically within 1–2 business days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">Device Requirements</h2>
            <p className="text-muted-foreground leading-relaxed">
              3D scanning uses the LiDAR sensor, available on iPhone 12 Pro and later Pro models and
              iPad Pro (2020) and later. On devices without LiDAR, the scan modes are unavailable; the
              rest of the app still works.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">Scanning a Room</h2>
            <p className="text-muted-foreground leading-relaxed">
              Tap New Room Scan, then walk slowly around the space so the camera can capture every wall,
              corner, and opening, and tap Done. Your scan is saved to your library, where you can view
              it in 3D, generate a materials takeoff, export a blueprint PDF or 3D model, or place it in
              AR at real-world scale.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">Subscription &amp; Billing</h2>
            <p className="text-muted-foreground leading-relaxed">
              ProBuildCalc Pro is $9.99/month and unlocks AI quotes, mesh and object capture, the full
              scan library, before/after compare, Quick Estimate, blueprint PDF export, 3D model export,
              and portal sync. Subscriptions are billed through your Apple ID and renew automatically
              unless cancelled at least 24 hours before the end of the period. Manage or cancel anytime
              in Settings → [your name] → Subscriptions on your device.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">Your Account &amp; Data</h2>
            <p className="text-muted-foreground leading-relaxed">
              Scans stay on your device unless you sign in and sync them to your Ikena portal. To delete
              your account and remove your data from our servers, open the app, sign in, then tap the
              account menu (top-right) → Delete Account. See our{" "}
              <a href="/privacy" className="underline">
                Privacy Policy
              </a>{" "}
              for details on how we handle data.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
