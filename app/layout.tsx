import type { Metadata } from "next";
import "./globals.css";
import NavWrapper from "@/components/NavWrapper";
import Footer from "@/components/Home/Footer";
import LayoutShell from "@/components/LayoutShell";

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
      <body>
        <LayoutShell nav={<NavWrapper />} footer={<Footer />}>
          {children}
        </LayoutShell>
      </body>
    </html>
  );
}
