import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/providers/Web3Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "wBTC Converter",
  description: "Convert USD to Wrapped Bitcoin (wBTC)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className + " bg-app-background text-text-primary"}>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
