import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Tour World Tourism - Ghana Tours & Travel",
  description: "Experience the best of Ghana with Tour World Tourism. Cultural tours, wildlife safaris, historical adventures, and unforgettable Ghanaian experiences.",
  keywords: ["Ghana tours", "Ghana travel", "cultural tours", "wildlife safaris", "historical tours", "Accra tours", "Cape Coast", "Kumasi", "Ghana tourism"],
  authors: [{ name: "Tour World Tourism" }],
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Tour World Tourism - Ghana Tours & Travel",
    description: "Experience the best of Ghana with cultural tours, wildlife safaris, and historical adventures",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tour World Tourism - Ghana Tours & Travel",
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
        </SessionProvider>
      </body>
    </html>
  );
}
