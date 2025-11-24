"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ShoppingCart, Users, Package, Tags, MessageSquare, Settings, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: ShoppingCart, label: "Order Lists", href: "/dashboard/orders" },
  { icon: ShoppingCart, label: "Delivered Orders", href: "/dashboard/delivered-orders" },
  { icon: Users, label: "Customer Lists", href: "/dashboard/customers" },
  { icon: Package, label: "Product Lists", href: "/dashboard/products" },
  { icon: Tags, label: "Category Lists", href: "/dashboard/categories" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" }
]

export function DashboardSidebar({ user }: { user: any }) {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-6 border-b border-gray-200">
        <Image src="/logo.png" alt="User Avatar" width={160} height={80} className="rounded-full w-[160px] h-[80px]" />
      </div>

      <nav className="space-y-2 px-4 flex-1 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/dashboard/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive ? "bg-[#5B9FED] text-white font-medium" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="w-full justify-start gap-3 bg-red-50 text-red-600 hover:bg-red-100 text-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  )
}
