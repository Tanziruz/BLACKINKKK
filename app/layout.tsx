import type { Metadata } from "next";
import "./globals.css";
import NavWrapper from "@/components/NavWrapper";
import Footer from "@/components/Home/Footer";
import LayoutShell from "@/components/LayoutShell";
import {Analytics} from "@vercel/analytics/next";

import TopLoader from "@/components/TopLoader";

export const metadata: Metadata = {
  title: "BLACKINKKK",
  description: "Redefining streetwear with premium oversized t-shirts. Comfort meets style in every piece.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Cloudinary so first image request skips TCP+TLS handshake */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body suppressHydrationWarning>
        <TopLoader />
        <LayoutShell nav={<NavWrapper />} footer={<Footer />}>
          {children}
          <Analytics />  
        </LayoutShell>
      </body>
    </html>
  );
}
