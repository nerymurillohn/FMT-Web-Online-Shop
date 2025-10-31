import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { logEnvironmentStatus } from "../lib/env";
import { fraunces, libreBaskerville, cormorantGaramond } from './fonts'
import { FloatingIcons } from "@/components/FloatingIcons";
import { CTA } from "@/components/CTA";
import { JsonLd } from "@/components/JsonLd";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Log environment status in development
if (process.env.NODE_ENV === 'development') {
  logEnvironmentStatus();
}

export const metadata: Metadata = {
  title: "Forestal MT | Exporting Nature Without Borders",
  description:
    "Forestal Murillo Tejada shares Honduras' ethnobotanical heritage with the world through authentic, traceable natural products.",
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${libreBaskerville.variable} ${cormorantGaramond.variable}`}>
      <body>
        <JsonLd />
        <Header />
        <main>{children}</main>
        <CTA />
        <Footer />
        <FloatingIcons />
      </body>
    </html>
  );
}
