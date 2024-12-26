import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import GoogleAdsense from "@/components/GoogleAdsense";
import HomeNav from "@/components/HomeNav";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Lifty - Compare Ski Resort Lift Ticket Prices",
  description:
    "Compare lift ticket prices across ski resorts in real-time. Find the best deals on ski lift tickets and plan your next mountain adventure with Lifty.",
  keywords:
    "ski lift tickets, lift ticket prices, ski resort comparison, ski deals, skiing",
  metadataBase: new URL("https://lifty.us"),
  openGraph: {
    title: "Lifty - Compare Ski Resort Lift Ticket Prices",
    description:
      "Find and compare the best ski lift ticket prices in real-time",
    url: "https://lifty.us",
    siteName: "Lifty",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lifty - Compare Ski Resort Lift Ticket Prices",
    description:
      "Find and compare the best ski lift ticket prices in real-time",
  },
  alternates: {
    canonical: "https://lifty.us",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleAdsense />
      </head>
      <body className={`${roboto.variable} antialiased`}>
        <div className="flex w-full flex-col items-center justify-center">
          <HomeNav />
          {children}
        </div>
      </body>
    </html>
  );
}
