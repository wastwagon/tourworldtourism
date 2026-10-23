import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { WhatsAppSupport } from "@/components/WhatsAppSupport";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { JsonLd } from "@/components/JsonLd";
import { buildTravelAgencyJsonLd, buildWebSiteJsonLd } from "@/lib/structured-data";
import { getMetadataBase } from "@/lib/metadata-helpers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#111827",
};

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: "Tourworld Tourism - Ghana Tours & Travel",
  description: "Experience the best of Ghana with Tourworld Tourism. Cultural tours, wildlife safaris, historical adventures, and unforgettable Ghanaian experiences.",
  keywords: ["Ghana tours", "Ghana travel", "cultural tours", "wildlife safaris", "historical tours", "Accra tours", "Cape Coast", "Kumasi", "Ghana tourism"],
  authors: [{ name: "Tourworld Tourism" }],
  creator: "OceanCyber",
  publisher: "Tourworld Tourism",
  other: {
    developer: "https://oceancyber.net/",
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Tourworld Tourism - Ghana Tours & Travel",
    description: "Experience the best of Ghana with cultural tours, wildlife safaris, and historical adventures",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tourworld Tourism - Ghana Tours & Travel",
    description: "Experience the best of Ghana with cultural tours, wildlife safaris, and historical adventures",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    types: {
      "text/plain": "/llms.txt",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="antialiased">
        <JsonLd data={[buildTravelAgencyJsonLd(), buildWebSiteJsonLd()]} />
        <SessionProvider>
          {children}
          <MobileBottomNav />
          <WhatsAppSupport />
        </SessionProvider>
      </body>
    </html>
  );
}
