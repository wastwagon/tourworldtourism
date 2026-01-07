import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { WhatsAppSupport } from "@/components/WhatsAppSupport";

export const metadata: Metadata = {
  title: "Tourworld Tourism - Ghana Tours & Travel",
  description: "Experience the best of Ghana with Tourworld Tourism. Cultural tours, wildlife safaris, historical adventures, and unforgettable Ghanaian experiences.",
  keywords: ["Ghana tours", "Ghana travel", "cultural tours", "wildlife safaris", "historical tours", "Accra tours", "Cape Coast", "Kumasi", "Ghana tourism"],
  authors: [{ name: "Tourworld Tourism" }],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProvider>
          {children}
          <WhatsAppSupport />
        </SessionProvider>
      </body>
    </html>
  );
}
