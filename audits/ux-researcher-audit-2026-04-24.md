# SHIFT Finance — UX Researcher Audit

**Site:** https://shift-rwa.vercel.app/
**Date:** 2026-04-24
**Auditor:** UX Researcher (Claude)
**Viewports tested:** Desktop 1440×900, Mobile 390×844 (iPhone 14-class)
**Pages walked:** `/`, `/trade/TSL2L`, `/app`, `/markets`, `/portfolio`, `/leaderboard`, `/rewards`, `/learn`, `/blog`, `/blog/the-shift-signal-1-wall-street-doesnt-want-you-to-know`, `/team`, `/status`
**Personas:**
- **P-Crypto** — Hyperliquid / GMX / Drift trader evaluating SHIFT for capital allocation
- **P-TradFi** — Equity investor curious about on-chain stocks, needs trust before funds move
- **P-Retail** — Crypto-curious, heard of tokenized stocks, doesn't know what an RWA is

Severity key:
- **P0** — Leaks trust or kills conversion. Fix before the next growth spend.
- **P1** — Friction. Costs measurable conversion / comprehension.
- **P2** — Polish. Ship with the next pass.

---

## Executive summary

The site *looks* like a finished protocol marketing page but behaves like a pre-launch mockup with live copy glued on top of demo data. The three persona journeys collapse at different breakpoints, but they share the same root failures:

1. **The trade page is not a trade page.** It presents mock balances ($124,278.92 USDC pre-filled), lets an unconnected user "Buy TSL2L", opens a Review modal that *declares the network as "Base"* while the homepage sells "Live on Solana", and the Confirm button terminates in silence — no wallet prompt, no toast, no error.
2. **Trust claims have no payload.** "Chainlink Proof-of-Reserves" links to `data.chain.link`'s homepage, not a specific SHIFT feed. Team members are listed with TradFi-heavyweight bios (ex-CTO Flow Traders, ex-Israel Securities Authority, ex-COO Zaisan) and **zero LinkedIn / X links** to verify them. "$40M+ Liquidity Raised" sits next to "$2M Seed Closed" without disambiguation.
3. **The "what is this?" test fails at 5 seconds.** The hero is "Wall Street For Crypto" — which tells you nothing about 2×/3× leveraged tokens, no-liquidation design, or who this is for. Subhead helps but requires reading.
4. **The rewards page is a single email field with no mechanics.** XP thresholds (10k, 50k, 250k) have no denominator, no "what does 1 XP cost," no total allocation, no referral mechanic. "Program parameters are not final" disclaimer kneecaps the entire page.
5. **Mobile ATF is hero + paragraph + two CTAs stacked vertically.** Proof points and trust anchors (Chainlink, SNZ, GMX founder) are far below the fold. Most mobile visitors will not see them.

There are 30 findings below. 10 are P0.

---

## P0 — Trust / conversion critical

### P0-01 Trade flow shows "Network: Base" on a Solana protocol
- **Personas:** P-Crypto, P-TradFi
- **Where:** `/trade/TSL2L` → click "Buy TSL2L" → Review trade modal → "Network" row
- **What breaks:** Homepage says "Live on Solana". This modal says "Network: Base". A crypto-native trader reads this as either (a) the product is a mess and the team doesn't know their own chain or (b) this is a copy-pasted demo from another build. Either way they close the tab.
- **Behavioral evidence:** A Hyperliquid trader's trust bar is high; a single chain mismatch on the *signing* screen is a dealbreaker. Nobody signs a Solana transaction that says "Base".
- **Fix:** Replace with "Network: Solana" everywhere in the trade confirmation. Add an automated test that asserts the network string matches the live deployment.

### P0-02 "Buy TSL2L" CTA is enabled without a connected wallet
- **Personas:** P-Crypto, P-Retail
- **Where:** `/trade/TSL2L` — primary button
- **What breaks:** The button reads "Buy TSL2L" (enabled) with a user who has never connected a wallet. Clicking opens a Review modal, then Confirm transitions to "Signing…" for ~2s and silently closes. No wallet prompt, no error toast, no state change. The user does not know whether a trade happened, failed, or whether the site is broken.
- **Behavioral evidence:** Crypto-native expectation is strict: the primary CTA mirrors wallet state ("Connect wallet" → "Approve USDC" → "Buy TSL2L"). A button that lies about its readiness is the #1 driver of "this protocol is sketchy."
- **Fix:** Progressive CTA states: `Connect wallet` → `Enter an amount` → `Approve USDC` → `Buy TSL2L`. Each state should match actual wallet + allowance + balance. Disable Confirm when there is no signer.

### P0-03 Mock balances pre-filled in live trade panel
- **Personas:** P-Crypto, P-TradFi
- **Where:** `/trade/TSL2L` — Sell row shows "124,278.92 USDC", Buy row shows "4,278.92 TSL2L" without a wallet connected
- **What breaks:** A user who has never connected sees $124k in USDC sitting in the panel. They know they don't have that. Three possibilities: the site is showing someone else's balance (catastrophic), the site is fake (disqualifying), or the site is mocked (amateur). All three end the session.
- **Behavioral evidence:** The first thing a crypto-native does is inspect the DOM. They see hardcoded mock values → screenshots → Twitter.
- **Fix:** Zero-state balances render as `—` or `0.00` with "Connect wallet to see your balance" next to them. Never ship mock numbers in a route that users can land on.

### P0-04 Chainlink Proof-of-Reserves link goes to chain.link's homepage
- **Personas:** P-TradFi, P-Crypto
- **Where:** Hero pill "Chainlink Proof-of-Reserves" → `https://data.chain.link/`
- **What breaks:** A TradFi user clicks expecting to see SHIFT's specific PoR feed (e.g., the TSLL reserve verifying TSL2L). They land on the generic Chainlink Data Feeds marketing page. Trust claim becomes a trust bluff.
- **Behavioral evidence:** TradFi-native users are trained on hyperlinked verification (every Bloomberg ticker is a drill-down). An unverifiable claim on a page that calls itself "fully transparent" is a full stop.
- **Fix:** Link to the specific Chainlink Data Feeds / PoR page for each underlying (TSLL, SOXL, SPXL, URA). If those don't exist yet, remove the claim until they do.

### P0-05 Team page has zero individual LinkedIn / X profile links
- **Personas:** P-TradFi
- **Where:** `/team` — Daniel Liven (CEO), Michael Bar Zeev (CBDO), Thomas Wolff (Tech Director / ex-CTO Flow Traders), Shoham Ben Rubi (ex-Israel Securities Authority), Bar Elkis (COO), plus "deep bench" advisors
- **What breaks:** The bios are *exactly* the kind TradFi users need (Flow Traders is credible, ISA is credible, Fireblocks acquisition is credible). But there is no way to verify any of them. A TradFi equity investor's second tab is LinkedIn. If they can't find these names attached to real profiles in <60 seconds, the entire credibility stack collapses.
- **Behavioral evidence:** Due diligence is a binary gate — one unverifiable senior-leader claim nukes the whole page.
- **Fix:** Add LinkedIn + X icons to every team and advisor card. If a member doesn't have a public LinkedIn, remove them from the public team page (they can appear in a private data room).

### P0-06 Above-the-fold headline fails the "what is this?" 5-second test
- **Personas:** P-Retail, P-TradFi
- **Where:** `/` hero — "Wall Street For Crypto."
- **What breaks:** The promise is metaphorical, not specific. A P-Retail user ("I heard about tokenized stocks") learns nothing about what SHIFT sells. A P-TradFi user reads it as hype. The clarifying subhead (3×/2×, no-liquidation, on-chain) is three lines down and requires reading.
- **Behavioral evidence:** 5s eye-track heuristic: eyes go to headline, pill, CTA. If the headline is a metaphor, the pill becomes the product description — and the pill ("the first liquidation-free leveraged RWA protocol") uses three jargon terms at once.
- **Fix:** Replace with a functional headline. Candidates: "Trade 3× Tesla. No liquidations. On-chain." or "2× & 3× leveraged stocks. Long or short. Zero liquidation risk." Put "Wall Street for crypto" as a tagline under the logo.

### P0-07 "BNB Chain — coming soon" pill adjacent to "Live on Solana" pill
- **Personas:** P-Crypto
- **Where:** Hero pills below subhead
- **What breaks:** Pre-launch chains advertised at the same visual weight as live chains signals roadmap padding. A Drift/Hyperliquid user sees this as the team being more excited about what's *not* live.
- **Behavioral evidence:** Crypto-natives discount "coming soon" by ~100%. Advertising it in the hero reads as hype.
- **Fix:** Move "BNB Chain — coming soon" to a small roadmap strip further down. Keep only the "Live on Solana" pill in the hero.

### P0-08 Rewards page: XP thresholds with no denominator and contradictory state
- **Personas:** P-Crypto, P-Retail
- **Where:** `/rewards`
- **What breaks:** (a) "Now live · Waitlist open" — which is it? (b) "Points accruing now" + "Full redemption program launches Q3 2026" — am I farming now or not? (c) XP thresholds (10k Operator, 50k Strategist, 250k Sovereign) have no $-per-XP ratio. (d) No total $SHFT allocation pool published. (e) "Program parameters are not final. Badges, XP rates, and rebates may change before launch." kills the whole premise. (f) Form is a single email with no referral input, no wallet connect, no Discord/Twitter verify.
- **Behavioral evidence:** A serious farmer compares allocation/$/time vs. other campaigns (Jupiter, Drift, Eigenlayer). Without that math, they don't farm. A crypto-curious user reads the disclaimer and leaves.
- **Fix:** Pick one state (Live *or* Waitlist, not both). Publish a concrete formula: "1 XP = $1 traded volume × leverage multiplier × badge multiplier". Publish the total $SHFT pool or the % committed to early-trader rewards. Add wallet connect + Twitter verify + referral code to the signup. Replace the "parameters may change" disclaimer with a specific "locked until X" commitment.

### P0-09 "$40M+ Liquidity Raised" and "$2M Seed Closed" shown without disambiguation
- **Personas:** P-TradFi, P-Crypto
- **Where:** Hero stat bar; repeated in "Trade today. Earn $SHFT tomorrow." section
- **What breaks:** "Liquidity raised" next to "Seed raised" conflates equity fundraising with protocol TVL (which is the only number crypto users care about). A crypto trader reads "$40M" as TVL; a TradFi investor reads it as equity. Either one discovers the truth later and loses trust.
- **Behavioral evidence:** Crypto-natives default to TVL from DefiLlama; TradFi defaults to equity rounds from PitchBook. Mixed definitions signal either obfuscation or sloppiness.
- **Fix:** Rename to exact, disambiguated labels: "Seed equity: $2M (2024)", "Lifetime trade volume: $40M+", "Current TVL: $X.X M (DefiLlama ↗)", with each linking to the source. If there is no TVL yet, say so.

### P0-10 Primary nav misses `/blog`, `/team`, and the product-narrative routes
- **Personas:** P-TradFi, P-Crypto
- **Where:** Header nav on all pages
- **What breaks:** Primary nav has `Markets / Portfolio / Leaderboard / Rewards / Learn`. Blog (thought-leadership for P-TradFi) and Team (trust anchor for P-TradFi) are hidden — only reachable from the home mid-page or footer. `Leaderboard` occupies a prime nav slot but the page is "Coming Q3 2026". `Portfolio` requires a wallet and returns a connect-wall state. Users who bounce to the blog via the home find themselves trapped inside /blog with no top-level anchor back.
- **Behavioral evidence:** TradFi investors read blog + team before clicking Launch App. Crypto users go Markets → Trade. Current nav optimizes for neither.
- **Fix:** Nav = `Markets · Rewards · Learn · Blog · Team`. Remove `Leaderboard` from primary until it ships; surface it on /rewards where it naturally belongs.

---

## P1 — Friction / clarity

### P1-11 /app is a narrow demo card, not a trading app
- **Personas:** P-Crypto, P-Retail
- **Where:** `/app` — reached from the hero "Launch App" button
- **What breaks:** Shows "$25,151.39" net worth without wallet, a decorative 3D wallet image, three action tiles ("Tesla x2", "Semis x3", "S&P 500 x3") which is *three of seven* available tokens, and a cramped max-width ~560px on a 1440 screen. A crypto-native who just clicked the hero's primary CTA is expecting a trade panel or wallet prompt. They get a concept.
- **Fix:** `/app` should auto-route to `/trade/TSL2L` (most active market) with a wallet-connect modal on first load; or redesign `/app` as a Jupiter-style aggregator view with all 7 markets visible.

### P1-12 Token names (TSL2L, SOX3L, SPX3S, URA2L) are ticker-like but never decoded above the fold
- **Personas:** P-Retail, P-TradFi
- **Where:** Homepage "Live markets" section and everywhere the symbol appears
- **What breaks:** A retail user has no mental model for "TSL2L". The card shows "2× long" underneath but the symbol itself is the naming contract — unexplained, it feels like a project asking users to learn a new ticker system.
- **Behavioral evidence:** Retail users default to human names ("Tesla 2× Long") not protocol notation.
- **Fix:** Every market card shows *both*: `Tesla 2× Long` (primary) with `TSL2L` (secondary, mono-font). Apply consistently on /markets, /trade, and homepage.

### P1-13 /trade chart shows a crashing ETF while the page sells 2× long exposure
- **Personas:** P-Crypto, P-TradFi
- **Where:** `/trade/TSL2L` — TradingView chart of Direxion TSLL
- **What breaks:** The visible chart shows TSLL from ~$24 down to ~$12 (–50%) with the last candle at –7.04%. The user is being asked to buy a 2× *long* token against an underlying that is actively collapsing. The chart fact is correct — but pairing it with an emphasized "Buy" CTA without risk framing feels predatory to a TradFi user and like bad product to a crypto user.
- **Fix:** Add a "price-change context" card adjacent to the chart: "TSLL has fallen 50% over 6 months. A 2× long position compounds that decline." Let users enable 'Short' with a one-click switch to TSL1S.

### P1-14 /trade "Intelligence" panel shows 7-153 day old headlines
- **Personas:** P-Crypto, P-TradFi
- **Where:** `/trade/TSL2L` → right column "Intelligence"
- **What breaks:** News: 7 days, 24 days, 58 days, 153 days old. On a live trading page this signals a data pipeline that hasn't been fed. A user expecting real intelligence sees a stale RSS pull.
- **Fix:** Either ship fresh news (<48h) or rename the panel to "Selected research" / "Reading list" so the age makes sense.

### P1-15 /trade has no H1
- **Personas:** P-TradFi (screen readers), SEO
- **Where:** `/trade/TSL2L` DOM
- **What breaks:** DOM shows `h1` collection is empty. Title tag is correct. SEO and accessibility both suffer. A screen reader user lands and hears "TSL2L $175.60" with no page-level heading.
- **Fix:** `<h1>TSL2L — 2× Tesla Long</h1>` visually hidden or placed in the market header.

### P1-16 Rewards form has zero secondary hook after "You're on the waitlist"
- **Personas:** P-Crypto, P-Retail
- **Where:** `/rewards` after submit
- **What breaks:** Success state is a green check and one line. No referral URL generated, no Twitter-share CTA, no Discord invite, no "invite 5 to 2× your spot". The most valuable moment (user just committed) is spent doing nothing. For a rewards protocol, this is malpractice.
- **Fix:** Immediately replace the form with: (1) a personalized referral link, (2) a "Connect X to earn +10,000 XP" button, (3) a "Join Discord for OG role" button, (4) a "Tweet to skip the line" button with pre-filled copy.

### P1-17 Mobile hero CTAs are stacked and Launch App appears below ~1.5 screens of content
- **Personas:** P-Retail, P-Crypto
- **Where:** `/` on 390-wide viewport
- **What breaks:** Above the fold: logo + hamburger + pill + H1 (3 lines) + subhead (5 lines) + "Launch App" button. Launch App comes after a 60+ word paragraph. Mobile users scroll fatigue before the CTA is visible.
- **Fix:** Mobile H1 on two lines max, subhead hidden behind a "Read more" or replaced by a single-line value prop. Launch App button within 1 viewport of page top.

### P1-18 Mobile header has no visible "Launch App" — lives only inside hamburger
- **Personas:** P-Crypto, P-Retail
- **Where:** `/` mobile header
- **What breaks:** Desktop has Launch App top-right (teal, high-contrast). Mobile has only a hamburger icon. The primary conversion CTA requires 2 taps (open menu → tap Launch App) rather than 1.
- **Fix:** Keep a compact "Launch App" pill in the mobile header beside the hamburger. Shrink logo if needed.

### P1-19 "How it works" hero CTA goes to /learn (an FAQ accordion), not a visual explanation
- **Personas:** P-Retail, P-TradFi
- **Where:** Hero secondary CTA
- **What breaks:** A user clicking "How it works" expects a diagram or a 3-step walkthrough. They get an FAQ and a 5-step cardboard cutout. The actual mental-model material (NAV targeting, daily reset, redemption) is deferred to a Gitbook link.
- **Fix:** `/learn` should lead with a 60-second animation or a clean flow diagram of Deposit → Mint → Trade → Redeem. Keep the FAQ below.

### P1-20 FAQ on homepage: first item highlights but doesn't open on click
- **Personas:** All
- **Where:** `/` FAQ section — "What is SHIFT actually solving?" button
- **What breaks:** Click triggers a visual highlight (teal color change) but the accordion body does not expand (aria-expanded stays "false" after click). Other FAQ items may or may not work. A user who wants the basic product explanation is stonewalled.
- **Fix:** Regression-test all accordion items. Add Cypress/Playwright coverage for aria-expanded toggling.

### P1-21 Partner/integration strip mixes live integrations with roadmap chains
- **Personas:** P-Crypto
- **Where:** `/` "Plugged into where capital already flows." section
- **What breaks:** 15 logos: Solana, Jupiter, Meteora, Phantom, OKX Wallet, Kamino, Orca, Birdeye, Loopscale, BNB Chain, Thena, Ichi, Chainlink, NEAR, Alpaca. Presented as "Live integrations" but BNB Chain and Thena were earlier labeled "coming soon". NEAR's relationship is unclear — is SHIFT deployed on NEAR? Inflating the logo strip with roadmap partners destroys its credibility.
- **Fix:** Split into two rows: "Live on Solana" (Solana, Jupiter, Meteora, Phantom, Kamino, Orca, Birdeye, Loopscale, Chainlink, Alpaca) and a smaller "Coming soon" row (BNB Chain, Thena, Ichi, NEAR, OKX Wallet).

### P1-22 Alpaca Markets custody buried in a logo strip
- **Personas:** P-TradFi, P-Retail
- **Where:** `/` under the integrations grid — "Custody via Alpaca Markets — 24/5 mint-and-burn rails backing every token"
- **What breaks:** For TradFi users this is the single most important fact on the entire page: the tokens are backed by a regulated US broker. It's whispered in a caption at the bottom of a logo strip.
- **Fix:** Dedicated "How reserves work" block. Alpaca Markets logo + one-line explanation + link to their broker-dealer registration + link to Chainlink PoR feed. This belongs in the top third of the page, not the fourth scroll.

### P1-23 Decorative "Welcome" wallet card overlaps the trade panel's right-column flow
- **Personas:** P-Crypto
- **Where:** `/trade/TSL2L` right column, below the buy panel
- **What breaks:** A 3D decorative wallet image sits directly below the Review-Trade area. It's not interactive, it doesn't reflect user state, and it steals vertical space on a page where every pixel should be actionable.
- **Fix:** Replace the decorative card with a "Your positions" slot that shows connected-wallet holdings for this market (or an empty state if no wallet). Move decorative art to marketing pages only.

### P1-24 /portfolio uses best-practice wallet gating; /trade does not
- **Personas:** P-Crypto
- **Where:** Contrast between `/portfolio` (correctly shows "Wallet required — Connect wallet") and `/trade/TSL2L` (allows "trading" without wallet)
- **What breaks:** Inconsistent gating within the same product. /portfolio's pattern is correct and should be the template.
- **Fix:** Apply the /portfolio pattern to /trade: required-state card → connect-wallet CTA → only then render the trade panel.

### P1-25 Blog title tag duplicates "SHIFT Finance · SHIFT Finance"
- **Personas:** SEO, social sharing
- **Where:** Every blog post — `<title>` tag
- **What breaks:** Page title is `The SHIFT Signal #1: Wall Street Doesn't Want You to Know This — SHIFT Finance · SHIFT Finance`. Duplicated brand is a template bug that leaks into Twitter previews and search snippets.
- **Fix:** Configure the Next.js metadata template to append brand only once: `%s — SHIFT Finance`.

### P1-26 Home blog teaser shows 4 posts; blog has 13. No most-popular or editorial order surfaced
- **Personas:** P-TradFi
- **Where:** `/` "Read the SHIFT thesis" section
- **What breaks:** The 4 posts shown are a mix of "Signal #1" (the thesis doc), "Academy #1", "Signal #2", and "General". There's no clear reading order. The most investor-credibility-boosting post ("SHIFT Signal #1: Wall Street Doesn't Want You to Know") doesn't stand out vs. the general-interest pieces.
- **Fix:** Home surface = top 3 curated by editorial role: (1) Flagship thesis, (2) Latest Signal, (3) Latest Academy. Label each with its series so users build a mental taxonomy.

---

## P2 — Polish / craft

### P2-27 Blog post end-CTA present but no inline conversion moments
- **Personas:** P-TradFi
- **Where:** `/blog/the-shift-signal-1-...`
- **What breaks:** 1,587-word post has a single end-page "Start trading on SHIFT" CTA and "Read next" rail. No inline product links (e.g., when the post says "tokenized stocks" it could link to `/trade/TSL2L`), no sticky "Launch App" rail on long scrolls, no "TL;DR" for skimmers.
- **Fix:** Add inline contextual links + a right-rail sticky "Trade these assets" card that updates as user scrolls past product mentions. Add a 50-word TL;DR at the top.

### P2-28 Leaderboard route briefly renders blank before content paints
- **Personas:** All
- **Where:** `/leaderboard` — first paint
- **What breaks:** First fullpage capture rendered completely white (SSR hydration delay). Second attempt worked. Indicates an intermittent hydration bug — on cold-cache visitors this flash-of-blank is frequent.
- **Fix:** Ship a server-rendered skeleton with the hero text so first paint is never blank.

### P2-29 Comparison table uses icons but lacks explicit headers on "Short side / Liquidation risk" rows
- **Personas:** P-Retail
- **Where:** `/` "Three ways to get leverage" table
- **What breaks:** Row labels are buttons (tooltip-triggering?) but on desktop the check/cross icons are small and without tooltip captions some rows are ambiguous. Retail users aren't sure if a red X under "Spot stocks → Short side" means "can't short" or "won't short".
- **Fix:** Replace icons with short text: "No / Yes / 1-click", and keep the button as an info tooltip.

### P2-30 Footer "Disclaimer" link is primary-weight instead of tiny-grey
- **Personas:** P-TradFi (positive — this is actually good)
- **Where:** Footer Legal column
- **What breaks:** Nothing — this is correct for a leveraged product. Noted as a positive.
- **Fix:** None — keep it.

---

## Supplementary observations (not scored)

- **Brand inconsistency on the ticker:** Homepage says "$SHFT" in "Trade today. Earn $SHFT tomorrow." Rewards page also uses "$SHFT". Title tag uses "$SHFT". Consistent — good. Confirm this matches the [SHIFT brand + ticker conventions] memory note.
- **Console warnings:** 1 console warning on /trade/TSL2L. Worth tracing (likely a hydration mismatch from the mocked balances).
- **`/app` uses `$25,151.39` and `/` uses `$87,218.18` for the demo "Total Net Worth"** — two different mock numbers across two pages.
- **Inconsistent capitalization on stats:** "Seed Closed" vs "Seed raised" vs "Liquidity Raised" vs "Liquidity raised" across hero and rewards sections.
- **Status page lists "Wallet connect (WalletConnect)"** — but WalletConnect is not the canonical Solana wallet bridge. Phantom / Solflare use their own adapters. Status page may be misleading.
- **No cookie banner or GDPR notice observed** — likely a problem for EU users given the TradFi positioning.

---

## Prioritized fix sequence (recommended order)

**This sprint (P0 — trust & conversion blockers):**
1. Fix the "Network: Base" string on the Solana trade confirm modal.
2. Remove mock USDC / TSL2L balances from /trade zero-state.
3. Wire the trade CTA to actual wallet state (`Connect wallet` → `Approve` → `Buy`).
4. Point Chainlink PoR link to a real reserve feed; or remove the claim.
5. Add LinkedIn / X to every team + advisor card.
6. Rewrite the hero headline to describe the product (2× & 3× leveraged stocks, no liquidations).
7. Disambiguate "$2M Seed" from "$40M+ Liquidity" with explicit labels and sources.
8. Pick one state for rewards (Live *or* Waitlist) and ship a concrete XP formula + total allocation.
9. Add Blog + Team to primary nav; remove Leaderboard until it's live.
10. Mobile: Launch App in the header; tighten hero to 1 viewport before the first CTA.

**Next sprint (P1 — friction):**
- /app → redirect or redesign as a real app entry.
- Name every market with a human-readable title alongside the ticker.
- Inline trade-panel CTAs that reflect wallet/allowance/balance.
- Fresh news on Intelligence panel or rename the panel.
- Fix FAQ accordion toggle.
- Split live vs. coming-soon partner logos.
- Promote Alpaca custody to its own on-page block.

**Backlog (P2 — polish):**
- Inline product links inside blog posts.
- Server-rendered skeleton for /leaderboard.
- Tooltip text on comparison table.
- Title-tag metadata template dedupe.

---

## Research methodology note

This audit was produced from direct walkthroughs on a Playwright-driven Chromium session at 1440×900 and 390×844, across 12 routes, with interaction tests on the trade flow (input, review, confirm) and rewards signup. Findings are grouped by persona impact and triangulated across the three personas where possible. Each finding includes (a) persona, (b) location, (c) mental-model break, (d) predicted behavior, (e) concrete fix.

Screenshots saved to the working directory as `shift-*.png` for reference.
