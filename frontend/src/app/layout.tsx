import type { Metadata } from "next";
import {ClerkProvider} from '@clerk/nextjs'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalHeader from "@/components/global/global-header";
import { Toaster } from "@/components/ui/sonner";
import ToasterWrapper from "@/components/global/toast-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CompressFlow",
  description: "Easily compress or decompress your files",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <GlobalHeader />
          {children}
          <ToasterWrapper />
        </body>
      </html>
    </ClerkProvider>
  );
}
