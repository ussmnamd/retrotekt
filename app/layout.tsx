import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});
import Footer from "@/components/Footer";
import { LiveProjectsTicker } from "@/components/LiveProjectsTicker";

export const metadata: Metadata = {
  title:
    "Retrotekt | 3D Architectural Rendering Services for Contractors & Developers",
  description:
    "Photorealistic 3D renders, walkthroughs, floor plans, and aerial views — built for US contractors, remodelers, and real estate developers. Fast delivery. Studio quality. Starting from $200/render.",
  metadataBase: new URL("https://retrotekt.com"),
  openGraph: {
    siteName: "Retrotekt",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F0E3",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Retrotekt",
  url: "https://retrotekt.com",
  logo: {
    "@type": "ImageObject",
    url: "https://retrotekt.com/logo-mark.png",
  },
  description:
    "Photorealistic 3D architectural rendering studio serving US contractors, remodelers, real estate developers, and interior designers.",
  email: "shahan@retrotekt.com",
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
  serviceType: "3D Architectural Visualization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-body bg-[#2C1F14] text-primary antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <LiveProjectsTicker />
        <Navbar />
        <div className="flex min-h-screen">
          <aside className="frame-strip-left" aria-hidden="true" />
          <div className="flex-1 min-w-0 rounded-xl overflow-hidden">
            <Suspense fallback={null}>{children}</Suspense>
          </div>
          <aside className="frame-strip-right" aria-hidden="true" />
        </div>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
