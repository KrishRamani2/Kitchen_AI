"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { ChefHat, ShoppingCart, Utensils, MessageSquare, User, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { useTranslation } from "@/hooks/use-translation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { t } = useTranslation()

  // Simple auth check - in a real app, this would be more robust
  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("Cheffy_user")
    if (!user) {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem("Cheffy_user")
    // Redirect to login
    router.push("/login")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <ChefHat className="h-6 w-6" />
              <span className="text-xl font-bold">Cheffy</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard">
                    <ShoppingCart />
                    <span>{t("dashboard.inventory", "Inventory")}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard/recipes">
                    <Utensils />
                    <span>{t("dashboard.recipes", "Recipes")}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard/chat">
                    <MessageSquare />
                    <span>{t("dashboard.chat", "Recipe Assistant")}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarSeparator />
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard/profile">
                    <User />
                    <span>{t("dashboard.profile", "Profile")}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut />
                  <span>{t("dashboard.logout", "Logout")}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center justify-between p-4">
              <ThemeToggle />
              <LanguageSelector />
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1">
          <header className="border-b">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
              <SidebarTrigger />
              <div className="ml-auto flex items-center gap-4">
                <div className="md:hidden flex items-center gap-2">
                  <ThemeToggle />
                  <LanguageSelector />
                </div>
              </div>
            </div>
          </header>
          <main className="container p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
