import type { Metadata } from "next";
import { Cairo, IBM_Plex_Sans_Arabic } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "DTAP | منصة تقييم التحول الرقمي",
  description: "Digital Transformation Assessment Platform",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${ibmPlexArabic.variable} ${cairo.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
