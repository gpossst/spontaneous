import type { Metadata } from "next";
import { Roboto, Pacifico } from "next/font/google";
import "./globals.css";
import GoogleAdsense from "@/components/GoogleAdsense";
import HomeNav from "@/components/HomeNav";
import { Analytics } from "@vercel/analytics/react";
import MessageDropdown from "./components/MessageDropdown";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  weight: "400",
  subsets: ["latin"],
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
    images: [
      {
        url: "https://utfs.io/f/7tcovZG9cuXOo2hVZTrpg7DeA6iL4s9mNdqVU3aWuF1MkxtB",
        width: 1200,
        height: 630,
      },
    ],
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
      <body className={`${roboto.variable} ${pacifico.variable} antialiased`}>
        <div className="flex w-full flex-col items-center justify-center">
          <MessageDropdown message="🚨 We're currently working on adding Epic Pass resorts. They use queues that make our job more difficult. Thanks for your patience! 🚨" />
          <HomeNav />
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
