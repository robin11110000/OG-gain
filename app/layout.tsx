import type { Metadata } from "next"
import { Unbounded } from "next/font/google"
import "./globals.css"
import RootClientLayout from "./RootClientLayout"

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Mantle-Gain | Cross-Chain Yield Aggregator",
  description:
    "Maximize your returns with our AI-powered cross-chain yield aggregator. Automatically allocate funds to the highest-yielding opportunities across multiple blockchains.",
  generator: 'Mantle-Gain.cc',
  metadataBase: new URL('https://Mantle-Gain.cc'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://Mantle-Gain.cc',
    title: 'Mantle-Gain | Cross-Chain Yield Aggregator',
    description: 'Maximize your returns with our AI-powered cross-chain yield aggregator. Automatically allocate funds to the highest-yielding opportunities across multiple blockchains.',
    siteName: 'Mantle-Gain',
    images: [
      {
        url: '/RBITYIELD.png',
        width: 1200,
        height: 630,
        alt: 'Mantle-Gain | Cross-Chain Yield Aggregator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mantle-Gain | Cross-Chain Yield Aggregator',
    description: 'Maximize your returns with our AI-powered cross-chain yield aggregator.',
    images: ['/RBITYIELD.png'],
    creator: '@Mantle-Gain',
  },
  icons: {
    icon: '/favicon.ico',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${unbounded.variable} font-sans`}>
        <RootClientLayout>{children}</RootClientLayout>
      </body>
    </html>
  )
}