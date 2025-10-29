import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ChatWidget } from "../components/ChatWidget";
import { logEnvironmentStatus } from "../lib/env";

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
    <html lang="en">
      <body>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
