import { LegalPage } from "@/components/legal/legal-page";
import type { TocEntry } from "@/components/legal/legal-page";

export const metadata = { title: "Terms of Use" };

const TOC: TocEntry[] = [
  { id: "eligibility",         label: "1. Eligibility" },
  { id: "non-custodial",       label: "2. Non-custodial service" },
  { id: "no-investment-advice",label: "3. No investment advice" },
  { id: "prohibited-conduct",  label: "4. Prohibited conduct" },
  { id: "no-warranty",         label: "5. No warranty" },
  { id: "liability",           label: "6. Limitation of liability" },
  { id: "changes",             label: "7. Changes" },
  { id: "contact",             label: "8. Contact" },
];

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="2026-04-01" toc={TOC}>
      <p>
        By accessing or using any part of SHIFT Finance (&ldquo;SHIFT&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;), you agree to these
        Terms of Use. If you do not agree, do not use the service. SHIFT is a decentralized trading
        interface for tokenized real-world assets. You are solely responsible for your use of the
        service.
      </p>

      <h2 id="eligibility">1. Eligibility</h2>
      <p>
        You must be at least 18 years old and legally permitted to access decentralized financial
        products in your jurisdiction. SHIFT is not available in certain restricted regions — see the
        <a href="/disclaimer"> Disclaimer </a>for the full list.
      </p>

      <h2 id="non-custodial">2. Non-custodial service</h2>
      <p>
        SHIFT is a non-custodial interface. We never take custody of your funds. All trades are executed
        via smart contracts on Solana. Other chains Coming Soon! You retain full control of your
        wallet and private keys at all times.
      </p>

      <h2 id="no-investment-advice">3. No investment advice</h2>
      <p>
        Nothing on SHIFT constitutes investment, financial, legal, or tax advice. All information is
        provided for educational purposes only. Leveraged tokens carry substantial risk, including
        total loss of capital. Do your own research before trading.
      </p>

      <h2 id="prohibited-conduct">4. Prohibited conduct</h2>
      <ul>
        <li>Using SHIFT to launder funds or finance sanctioned activities</li>
        <li>Attempting to exploit, manipulate, or reverse-engineer the protocol</li>
        <li>Accessing SHIFT via VPN to circumvent geographic restrictions</li>
        <li>Scraping, automating, or load-testing the interface without permission</li>
      </ul>

      <h2 id="no-warranty">5. No warranty</h2>
      <p>
        SHIFT is provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; We disclaim all warranties, express or
        implied, including merchantability, fitness for a particular purpose, and non-infringement.
      </p>

      <h2 id="liability">6. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, SHIFT, its team, and its affiliates will not be liable
        for any indirect, incidental, special, consequential, or punitive damages arising from your use
        of the service — including lost profits, lost data, or protocol-level exploits beyond our
        control.
      </p>

      <h2 id="changes">7. Changes</h2>
      <p>
        We may update these Terms at any time. Material changes will be announced on our X account and
        reflected here with a new &ldquo;Last updated&rdquo; date.
      </p>

      <h2 id="contact">8. Contact</h2>
      <p>
        Questions about these Terms? Email <a href="mailto:legal@shift.finance">legal@shift.finance</a>.
      </p>
    </LegalPage>
  );
}
