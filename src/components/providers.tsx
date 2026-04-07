"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, getDefaultConfig, darkTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, base, arbitrum, optimism } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";

const config = getDefaultConfig({
  appName: "Shift RWA",
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "shift_demo_project_id",
  chains: [mainnet, base, arbitrum, optimism],
  ssr: true,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#00cccc",
            accentColorForeground: "#001414",
            borderRadius: "large",
            overlayBlur: "small",
          })}
        >
          <TooltipProvider>
            {children}
            <Toaster
              theme="dark"
              position="top-right"
              richColors
              toastOptions={{
                classNames: {
                  toast: "bg-card border-border",
                  title: "text-foreground",
                  description: "text-muted-foreground",
                },
              }}
            />
          </TooltipProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
