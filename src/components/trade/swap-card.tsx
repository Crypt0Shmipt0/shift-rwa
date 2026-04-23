"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ASSETS, getAsset } from "@/lib/mock";
import { useLocalStorage } from "@/lib/use-local-storage";
import { ChevronDown, Wallet, Settings, Info } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { TradeConfirmModal } from "@/components/trade/trade-confirm-modal";

type Side = "buy" | "sell";

const RATE = 21.53;
const MOCK_USDC_BALANCE = 124278.92;
const MOCK_ASSET_BALANCE = 4278.92;
const SLIPPAGE_PRESETS = [0.1, 0.5, 1];

export function SwapCard({ symbol = "TSL2L" }: { symbol?: string }) {
  const router = useRouter();
  const asset = getAsset(symbol);
  const [side, setSide] = useState<Side>("buy");
  const [inputAmount, setInputAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState("");
  const [slippage, setSlippage] = useLocalStorage<number>("shift:slippage", 0.5);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tslHovered, setTslHovered] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  useEffect(() => {
    if (!inputAmount || isNaN(Number(inputAmount))) {
      setOutputAmount("");
      return;
    }
    const amt = Number(inputAmount);
    setOutputAmount(side === "buy" ? (amt / RATE).toFixed(4) : (amt * RATE).toFixed(2));
  }, [inputAmount, side]);

  const inputBalance = side === "buy" ? MOCK_USDC_BALANCE : MOCK_ASSET_BALANCE;
  const parsedInput = Number(inputAmount) || 0;
  const insufficient = parsedInput > inputBalance;
  const invalid = parsedInput <= 0;

  const setHalf = () => setInputAmount((inputBalance / 2).toFixed(2));
  const setMax = () => setInputAmount(inputBalance.toFixed(2));
  const handleSwitch = () => {
    setSide(side === "buy" ? "sell" : "buy");
    setInputAmount("");
    setOutputAmount("");
  };

  const usdAmount = side === "buy" ? parsedInput : Number(outputAmount) || 0;
  const tokenAmount = side === "buy" ? Number(outputAmount) || 0 : parsedInput;
  const otherAssets = ASSETS.filter((a) => a.symbol !== asset.symbol);

  return (
    <div className="flex flex-col gap-10 items-center w-full max-w-[480px]">
      <div className="w-full relative">
        {/* Buy / Sell + Settings gear */}
        <div className="flex items-center justify-between ml-2.5 mb-3">
          <div className="flex items-center">
            <button
              onClick={() => { setSide("buy"); setInputAmount(""); }}
              className={`px-3 py-1 rounded-2xl text-base font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-mint focus-visible:outline-none ${
                side === "buy" ? "text-white" : "text-[#797979] hover:text-[#b0b0b0]"
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => { setSide("sell"); setInputAmount(""); }}
              className={`px-3 py-1 rounded-2xl text-base font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-mint focus-visible:outline-none ${
                side === "sell" ? "text-white" : "text-[#797979] hover:text-[#b0b0b0]"
              }`}
            >
              Sell
            </button>
          </div>

          <Popover>
            <PopoverTrigger
              aria-label="Trade settings"
              className="size-8 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-mint focus-visible:outline-none"
            >
              <Settings className="h-4 w-4" />
            </PopoverTrigger>
            <PopoverContent align="end" className="bg-card border-border w-72">
              <div className="flex items-center gap-1.5 text-sm font-semibold mb-3">
                Slippage tolerance
                <Info className="h-3 w-3 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2">
                {SLIPPAGE_PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setSlippage(p)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium tabular-nums transition-colors ${
                      slippage === p ? "bg-mint/15 text-mint border border-mint" : "bg-secondary text-muted-foreground hover:text-foreground border border-transparent"
                    }`}
                  >
                    {p}%
                  </button>
                ))}
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="50"
                    value={slippage}
                    onChange={(e) => setSlippage(Math.min(50, Math.max(0, Number(e.target.value) || 0)))}
                    className="w-20 bg-secondary rounded-lg px-3 py-2 text-sm tabular-nums outline-none focus:ring-2 focus:ring-mint"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Saved for next time.</p>
            </PopoverContent>
          </Popover>
        </div>

        {/* SELL input */}
        <div className={`rounded-3xl px-6 sm:px-8 py-6 flex flex-col gap-2.5 border-2 h-[140px] ${insufficient ? "border-destructive" : "border-mint"}`}>
          <div className="flex items-center justify-between">
            <span className="text-[#797979] text-xs">Sell</span>
            <div className="flex gap-3 items-center">
              <div className="flex gap-2 items-center text-mist">
                <Wallet className="h-3 w-3" />
                <span className="text-xs tabular-nums">{inputBalance.toLocaleString()}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={setHalf}
                  className="bg-[#333] px-2 py-1 rounded-lg text-mist text-xs border border-transparent hover:border-mint transition-colors"
                >
                  Half
                </button>
                <button
                  onClick={setMax}
                  className="bg-[#333] px-2 py-1 rounded-lg text-mist text-xs border border-transparent hover:border-mint transition-colors"
                >
                  Max
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-2.5 items-center p-1.5 rounded-3xl">
              {side === "buy" ? (
                <UsdcChip />
              ) : (
                <AssetChip
                  asset={asset}
                  open={dropdownOpen}
                  hovered={tslHovered}
                  onToggle={() => setDropdownOpen((p) => !p)}
                  onHover={setTslHovered}
                  refEl={dropdownRef}
                  onPick={(s) => router.push(`/trade/${s}`)}
                  others={otherAssets}
                />
              )}
            </div>
            <input
              type="text"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="0.00"
              aria-label={`${side === "buy" ? "USDC" : asset.symbol} amount`}
              className="bg-transparent text-right text-3xl text-white font-semibold w-[160px] sm:w-[200px] outline-none placeholder:text-[#797979] tabular-nums"
            />
          </div>
        </div>
        {insufficient && (
          <p className="text-xs text-destructive mt-2 ml-2 flex items-center gap-1">
            <Info className="h-3 w-3" />
            Amount exceeds your {side === "buy" ? "USDC" : asset.symbol} balance.
          </p>
        )}

        {/* Switch */}
        <div className="flex justify-center -my-4 relative z-10">
          <button
            onClick={handleSwitch}
            className="size-10 rounded-full bg-card border-[3px] border-background flex items-center justify-center hover:bg-[#1a1a1a] transition-colors focus-visible:ring-2 focus-visible:ring-mint focus-visible:outline-none"
            aria-label="Switch buy and sell direction"
          >
            <div className="-rotate-90 size-6 overflow-clip relative">
              <svg className="absolute" style={{ top: "58.33%", left: "16.67%", width: "66.67%", height: "12.5%" }} fill="none" viewBox="0 0 17 4">
                <path d="M0.5 0.5H16.5L13.5 3.5" stroke="#00CCCC" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg className="absolute" style={{ top: "29.17%", left: "16.67%", width: "66.67%", height: "12.5%" }} fill="none" viewBox="0 0 17 4">
                <path d="M16.5 3.5H0.500015L3.50001 0.5" stroke="#00CCCC" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
        </div>

        {/* BUY output */}
        <div className="bg-card rounded-3xl px-6 sm:px-8 py-6 flex flex-col gap-2.5 border-2 border-card h-[140px]">
          <div className="flex items-center justify-between">
            <span className="text-[#797979] text-xs">Buy</span>
            <div className="flex gap-2 items-center text-mist">
              <Wallet className="h-3 w-3" />
              <span className="text-xs tabular-nums">
                {(side === "buy" ? MOCK_ASSET_BALANCE : MOCK_USDC_BALANCE).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-2.5 items-center">
              {side === "buy" ? (
                <AssetChip
                  asset={asset}
                  open={dropdownOpen}
                  hovered={tslHovered}
                  onToggle={() => setDropdownOpen((p) => !p)}
                  onHover={setTslHovered}
                  refEl={dropdownRef}
                  onPick={(s) => router.push(`/trade/${s}`)}
                  others={otherAssets}
                />
              ) : (
                <div className="flex gap-2.5 items-center p-1.5 rounded-3xl">
                  <UsdcChip />
                </div>
              )}
            </div>
            <span className={`text-3xl font-semibold tabular-nums ${outputAmount ? "text-white" : "text-[#797979]"}`}>
              {outputAmount || "0.00"}
            </span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => setConfirmOpen(true)}
          disabled={invalid || insufficient}
          className="bg-mint w-full h-14 rounded-2xl mt-2 text-primary-foreground text-xl font-semibold hover:bg-mint/90 active:-translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-mint"
        >
          {insufficient
            ? "Insufficient balance"
            : invalid
              ? "Enter an amount"
              : `${side === "buy" ? "Buy" : "Sell"} ${asset.symbol}`}
        </button>

        {/* Rate */}
        <div className="flex gap-2 items-center justify-center mt-2">
          <span className="text-mist text-xs">Rate</span>
          <span className="text-foreground/80 text-xs tabular-nums">{RATE} USDC = 1 {asset.symbol}</span>
        </div>
      </div>

      {/* Portfolio preview banner */}
      <div className="h-[120px] rounded-3xl w-full relative overflow-hidden">
        <div className="absolute bg-card inset-0 rounded-3xl" />
        <Image
          src="/trade/portfolio-banner.png"
          alt=""
          fill
          className="object-cover opacity-80 rounded-3xl"
          sizes="480px"
        />
      </div>

      <TradeConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        side={side}
        asset={asset}
        usdAmount={usdAmount}
        tokenAmount={tokenAmount}
        slippage={slippage}
        rate={RATE}
      />
    </div>
  );
}

function UsdcChip() {
  return (
    <div className="flex items-center gap-2.5 p-1.5 pr-3">
      <Image src="/trade/usdc.png" alt="USDC" width={32} height={32} className="size-8 rounded-[14px]" />
      <span className="text-foreground text-base">USDC</span>
    </div>
  );
}

type AssetChipProps = {
  asset: (typeof ASSETS)[number];
  open: boolean;
  hovered: boolean;
  onToggle: () => void;
  onHover: (b: boolean) => void;
  refEl: React.RefObject<HTMLDivElement | null>;
  onPick: (sym: string) => void;
  others: typeof ASSETS;
};

function AssetChip({ asset, open, hovered, onToggle, onHover, refEl, onPick, others }: AssetChipProps) {
  const accent = open || hovered;
  return (
    <div ref={refEl} className="relative">
      <button
        onClick={onToggle}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        className={`flex gap-2.5 items-center p-1.5 pr-3 rounded-full transition-all border focus-visible:ring-2 focus-visible:ring-mint focus-visible:outline-none ${
          accent ? "border-mint bg-mint/15" : "border-transparent bg-[#333]"
        }`}
      >
        <Image src={asset.image} alt={asset.symbol} width={32} height={32} className="size-8 rounded-full object-cover" />
        <span className={`text-base transition-colors ${accent ? "text-mint" : "text-foreground"}`}>{asset.symbol}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""} ${accent ? "text-mint" : "text-[#d9d9d9]"}`} />
      </button>
      {open && (
        <div className="absolute top-12 left-0 bg-[#1a1a1a] border border-border rounded-2xl p-2 z-50 min-w-[220px] shadow-lg shadow-black/40">
          {others.map((a) => (
            <button
              key={a.symbol}
              onClick={() => onPick(a.symbol)}
              className="flex gap-2.5 items-center p-2 rounded-xl w-full hover:bg-[#333] transition-colors group text-left"
            >
              <Image src={a.image} alt={a.symbol} width={28} height={28} className="size-7 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <div className="text-foreground text-sm group-hover:text-mint transition-colors">{a.symbol}</div>
                <div className="text-muted-foreground text-xs truncate">{a.name}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
