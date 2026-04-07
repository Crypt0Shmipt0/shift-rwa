import { LegalPage } from "@/components/legal/legal-page";

export const metadata = { title: "Privacy Policy — SHIFT" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="2026-04-01">
      <p>
        SHIFT Finance respects your privacy. Because SHIFT is a non-custodial on-chain protocol, the
        vast majority of your activity is inherently public on the blockchains you trade on. This
        policy explains the limited additional data the SHIFT interface collects and how we use it.
      </p>

      <h2>1. What we collect</h2>
      <ul>
        <li><strong>Connected wallet address</strong> — stored client-side only, never linked to PII</li>
        <li><strong>Locally stored preferences</strong> — slippage, display currency, theme (localStorage)</li>
        <li><strong>Anonymized telemetry</strong> — aggregated page views, route transitions, error logs (no IP storage)</li>
        <li><strong>Email</strong> — only if you voluntarily join the rewards waitlist or support</li>
      </ul>

      <h2>2. What we do NOT collect</h2>
      <ul>
        <li>Your private keys or seed phrases</li>
        <li>Personally identifying information (name, DOB, SSN)</li>
        <li>KYC documents (SHIFT is non-custodial and does not run KYC)</li>
        <li>Cookies beyond essential session and functionality cookies</li>
      </ul>

      <h2>3. How we use data</h2>
      <p>
        Aggregate telemetry helps us fix bugs and improve UX. Emails are used exclusively for the
        communication you opted into. We never sell, rent, or share data with third parties for
        marketing.
      </p>

      <h2>4. On-chain data</h2>
      <p>
        Everything your wallet does on chain is public. SHIFT does not add to this — but you should be
        aware that any trade you make is visible to anyone who can read a block explorer.
      </p>

      <h2>5. Third-party services</h2>
      <p>
        SHIFT uses Vercel for hosting, WalletConnect for wallet connection, and TradingView for chart
        rendering. Each has its own privacy policy; by using SHIFT you also agree to theirs.
      </p>

      <h2>6. Your rights</h2>
      <p>
        You can clear all local preferences from the <a href="/settings">Settings page</a>. To request
        deletion of any email you&apos;ve submitted, contact <a href="mailto:privacy@shift.finance">privacy@shift.finance</a>.
      </p>

      <h2>7. Changes</h2>
      <p>
        We may update this policy. Material changes will be reflected above with a new &ldquo;Last
        updated&rdquo; date.
      </p>
    </LegalPage>
  );
}
