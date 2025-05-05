import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/hooks/use-translation"
import { InventoryProvider } from "@/hooks/use-inventory"
import { RecipesProvider } from "@/hooks/use-recipes"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cheffy - Your AI Kitchen Assistant",
  description:
    "Manage your inventory, discover recipes, and cook with confidence using our AI-powered kitchen assistant.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <InventoryProvider>
              <RecipesProvider>{children}</RecipesProvider>
            </InventoryProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
