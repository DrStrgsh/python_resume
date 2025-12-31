import type { Metadata } from "next"
import { Inter, Orbitron } from "next/font/google"
import AuthHeader from "@/features/auth/AuthHeader"
import Footer from "@/components/Footer"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
})

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weights: [400, 500, 600, 700]
})

export const metadata: Metadata = {
  title: "Resume App",
  description: "Space-style resume platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`min-h-dvh flex flex-col ${inter.variable} ${orbitron.variable} antialiased`}
      >
        <AuthHeader />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
