import type { Metadata } from "next";
import { Caveat, Cormorant_Garamond, DM_Sans } from 'next/font/google';
import "./globals.css";

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"]
})

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"]
})

const dmSans = DM_Sans({ 
  variable: "--font-dm-sans",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Thank You!",
  description: "A virtual thank you card.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${caveat.variable} ${cormorant.variable} ${dmSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
