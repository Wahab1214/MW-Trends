import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import WorldCanvasWrapper from "@/components/world/WorldCanvasWrapper";
import MiniCart from "@/components/shop/MiniCart";
import GlobalNav from "@/components/ui/GlobalNav";
import AnalyticsTracker from "@/lib/analytics/AnalyticsTracker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MW Trends | Digital Luxury Atelier",
  description: "Premium Print-on-Demand Interactive Multi-Floor Luxury Retail Experience",
  keywords: "MW Trends, luxury marketplace, bespoke atelier, 3D retail, custom apparel",
  openGraph: {
    title: "MW Trends | Digital Luxury Atelier",
    description: "Premium Print-on-Demand Interactive Multi-Floor Luxury Retail Experience",
    type: "website",
    locale: "en_US",
    siteName: "MW Trends",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} w-screen h-screen`}>
      <body className="relative w-screen h-screen bg-[#050505] text-[#F7F4ED] overflow-hidden select-none">
        <AnalyticsTracker />
        {/* The 3D World layer (persistent across route changes) */}
        <WorldCanvasWrapper />
        
        {/* The Next.js 2D UI Route layer */}
        <div className="relative z-10 w-full h-full pointer-events-none">
          {children}
        </div>
        
        {/* Global UI Components (Nav, Search, MiniCart) */}
        <div className="relative z-[150] pointer-events-auto">
          <Suspense fallback={null}>
            <GlobalNav />
          </Suspense>
          <MiniCart />
        </div>
      </body>
    </html>
  );
}
