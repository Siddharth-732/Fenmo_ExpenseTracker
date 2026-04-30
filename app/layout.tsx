import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WealthGlass | Expense Tracker",
  description: "Track and manage your spending.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased bg-[#f0f2fa]">
      <body className={`${inter.className} min-h-full flex text-[#1a1a2e]`}>
        {children}
      </body>
    </html>
  );
}
