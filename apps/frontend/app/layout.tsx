import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tarkov Map Explorer",
  description:
    "Interactive map explorer for Escape from Tarkov — browse markers, extractions, keys, loot, quests and more across all maps.",
  generator: "v0.app",
  keywords: ["tarkov", "map", "markers", "extractions", "keys", "loot"],
}

export const viewport: Viewport = {
  themeColor: "#1a1c21",
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
