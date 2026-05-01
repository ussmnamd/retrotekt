import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title:
    "3D Visualization & Rendering Services — Retrotekt",
  description:
    "Boutique 3D visualization for elite builders, developers, and designers. Pre-sale concepts, photorealistic renders, cinematic walkthroughs, and strategic design support. Custom quotes in 24 hours. Zero upfront payment.",
  keywords: [
    "photorealistic interior renders",
    "exterior 3D rendering",
    "architectural still renders",
    "rendering for building permits",
    "permit-ready architectural renders",
    "3D walkthrough animation",
    "architectural walkthrough video",
    "virtual tour for construction",
    "floor plan rendering services",
    "3D floor plan for contractors",
    "aerial rendering services",
    "360 degree architectural render",
  ],
  openGraph: {
    title: "3D Architectural Rendering Services — Retrotekt",
    description:
      "Everything a contractor or developer needs to visualize a project. Still renders, animations, floor plans, aerials — delivered in 3–5 days.",
    url: "https://retrotekt.com/services",
    images: [
      {
        url: "/og/services.png",
        width: 1200,
        height: 630,
        alt: "Retrotekt 3D Rendering Services",
      },
    ],
  },
  alternates: {
    canonical: "https://retrotekt.com/services",
  },
};

const servicesCatalogSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "3D Architectural Rendering Services",
  provider: {
    "@type": "Organization",
    name: "Retrotekt",
    url: "https://retrotekt.com",
  },
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "3D Rendering Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Still Renders",
          description:
            "Photorealistic interior and exterior architectural renders. HD, print-ready, permit-compatible.",
          url: "https://retrotekt.com/services#renders",
        },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: 200,
          priceCurrency: "USD",
          unitText: "per render",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Walkthrough Animations",
          description:
            "Cinematic 3D walkthrough animations — room walkthroughs, full interior tours, exterior flyovers.",
          url: "https://retrotekt.com/services#walkthroughs",
        },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: 800,
          priceCurrency: "USD",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Floor Plan Renders",
          description:
            "Clean architectural floor plan renders for permit applications and client proposals.",
          url: "https://retrotekt.com/services#floor-plans",
        },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: 150,
          priceCurrency: "USD",
          unitText: "per floor",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Aerial & Bird's-Eye Views",
          description:
            "Drone-perspective site overviews and aerial renders for developer pitch decks.",
          url: "https://retrotekt.com/services#aerial",
        },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: 200,
          priceCurrency: "USD",
          unitText: "per view",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "360° Panorama Views",
          description:
            "Fully immersive 360-degree room renders clients can explore on any device.",
          url: "https://retrotekt.com/services#panoramas",
        },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: 300,
          priceCurrency: "USD",
          unitText: "per room",
        },
      },
    ],
  },
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(servicesCatalogSchema),
        }}
      />
      <ServicesClient />
    </>
  );
}
