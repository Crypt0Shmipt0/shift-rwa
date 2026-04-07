import { LegalPage } from "@/components/legal/legal-page";

export const metadata = { title: "Disclaimer — SHIFT" };

export default function DisclaimerPage() {
  return (
    <LegalPage title="Risk Disclaimer" updated="2026-04-01">
      <p>
        <strong>Leveraged products carry substantial risk.</strong> You may lose some or all of your
        capital. Do not trade with money you cannot afford to lose. Read this disclaimer in full before
        using SHIFT.
      </p>

      <h2>1. Daily return targeting</h2>
      <p>
        SHIFT&apos;s leveraged tokens (TSL2s, NVD3s, SPY3s, TSLSs, etc.) target <strong>daily</strong> returns
        that are a multiple of the underlying&apos;s daily move. They are not designed to track the
        underlying over periods longer than one day. Because of daily reset and compounding, multi-day
        returns can differ substantially from what you&apos;d expect from a simple 2× or 3× calculation.
        This is a mathematical feature, not a bug — it&apos;s how all daily-targeted leveraged products
        work, on chain or at a brokerage.
      </p>

      <h2>2. Not investment advice</h2>
      <p>
        Nothing on SHIFT is investment, financial, tax, or legal advice. All content is for educational
        and informational purposes only. Consult a qualified professional before making any financial
        decision.
      </p>

      <h2>3. Smart contract risk</h2>
      <p>
        SHIFT&apos;s protocol is deployed via smart contracts on public blockchains. While we audit
        thoroughly and work with reputable security firms, smart contracts can have undiscovered bugs.
        The code is immutable once deployed — we cannot freeze or reverse trades.
      </p>

      <h2>4. Oracle and liquidity risk</h2>
      <p>
        Pricing depends on oracles and available on-chain liquidity. During periods of extreme
        volatility, oracle updates may lag, and slippage may be large. Liquidity providers may withdraw
        at any time.
      </p>

      <h2>5. Regulatory and geographic restrictions</h2>
      <p>
        SHIFT is not available in jurisdictions where its use would violate local law. Restricted
        regions currently include (but are not limited to):
      </p>
      <ul>
        <li>United States of America</li>
        <li>United Kingdom</li>
        <li>Canada</li>
        <li>OFAC-sanctioned regions (Cuba, Iran, North Korea, Syria, Crimea, Donetsk, Luhansk)</li>
        <li>Any jurisdiction where tokenized equity trading is prohibited</li>
      </ul>
      <p>
        Using a VPN to circumvent these restrictions is a violation of our <a href="/terms">Terms of Use</a>.
      </p>

      <h2>6. Tax responsibility</h2>
      <p>
        You are solely responsible for any taxes arising from your trades. SHIFT does not issue tax
        forms. Use the Portfolio export to share activity with your accountant.
      </p>

      <h2>7. No guarantee of past performance</h2>
      <p>
        Historical returns shown in charts, leaderboards, or analytics are not indicative of future
        results. Markets move. Assume any shown number could go to zero.
      </p>

      <h2>8. Contact</h2>
      <p>
        Compliance questions: <a href="mailto:compliance@shift.finance">compliance@shift.finance</a>.
      </p>
    </LegalPage>
  );
}
