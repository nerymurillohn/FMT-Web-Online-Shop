import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const title = "Forestal MT | Exporting Nature Without Borders";
const description =
  "Forestal MT connects ancestral Honduran botanicals with the world through a transparent, ethical supply chain.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title,
    description
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-forest-950 text-forest-50 antialiased">
        {children}
      </body>
    </html>
  );
}
