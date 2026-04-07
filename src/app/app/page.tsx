import type { Metadata } from "next";
import { PhoneHome } from "@/components/home/phone-home";

export const metadata: Metadata = {
  title: "App",
  description:
    "Your SHIFT dashboard — net worth, top movers, and quick access to every bi-directional leveraged market.",
  alternates: { canonical: "/app" },
  robots: { index: false, follow: false },
};

export default function AppDashboard() {
  return <PhoneHome />;
}
