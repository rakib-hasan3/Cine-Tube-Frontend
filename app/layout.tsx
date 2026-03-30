import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // তোমার গ্লোবাল সিএসএস ফাইল

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CineTube | Next-Gen Media Platform",
  description: "Watch and manage your favorite movies and shows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}