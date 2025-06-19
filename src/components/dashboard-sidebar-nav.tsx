"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { UserRole } from "@/lib/types"
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  ListOrdered,
  ShieldCheck,
  BarChart3,
  Settings,
  LifeBuoy,
  Wallet,
  Landmark,
  Briefcase,
  MessageSquare,
  UserCircle,
} from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  roles: UserRole[]
  subItems?: NavItem[]
  disabled?: boolean
  isNew?: boolean
}

const navItems: NavItem[] = [
  // Agent Routes
  { href: "/dashboard", label: "Home", icon: Home, roles: ["agent"] },
  { href: "/dashboard/bundles", label: "Order Bundles", icon: Package, roles: ["agent"] },
  { href: "/dashboard/orders", label: "My Bundle Orders", icon: ListOrdered, roles: ["agent"] },
  { href: "/dashboard/gigs", label: "Order Gigs", icon: Briefcase, roles: ["agent"], isNew: true },
  { href: "/dashboard/gig-orders", label: "My Gig Orders", icon: ShoppingCart, roles: ["agent"], isNew: true },
  { href: "/dashboard/subscription", label: "Subscription", icon: CreditCard, roles: ["agent"] },
  { href: "/dashboard/commission", label: "My Commissions", icon: Wallet, roles: ["agent"] },
  { href: "/dashboard/profile", label: "My Profile", icon: UserCircle, roles: ["agent"] },

  // Admin Routes
  { href: "/admin", label: "Overview", icon: BarChart3, roles: ["admin"] },
  { href: "/admin/agents", label: "Manage Agents", icon: Users, roles: ["admin"] },
  { href: "/admin/data-bundles", label: "Manage Bundles", icon: Package, roles: ["admin"] },
  { href: "/admin/orders", label: "Bundle Orders", icon: ShoppingCart, roles: ["admin"] },
  { href: "/admin/gigs", label: "Manage Gigs", icon: Briefcase, roles: ["admin"], isNew: true },
  { href: "/admin/gig-orders", label: "Gig Orders", icon: ListOrdered, roles: ["admin"], isNew: true },
  { href: "/admin/subscriptions", label: "Subscriptions Log", icon: ShieldCheck, roles: ["admin"] },
  { href: "/admin/cashouts", label: "Agent Cashouts", icon: Landmark, roles: ["admin"] },
  { href: "/admin/platform-messages", label: "Platform Messages", icon: MessageSquare, roles: ["admin"], isNew: true },
  { href: "/admin/settings", label: "Platform Settings", icon: Settings, roles: ["admin"] },
]

const bottomNavItems: NavItem[] = [
  { href: "/dashboard/help", label: "Help & Support", icon: LifeBuoy, roles: ["agent", "admin"], disabled: true },
]

export function DashboardSidebarNav({
  role,
  isAgentApproved,
  agentSubscriptionStatus,
}: { role: UserRole; isAgentApproved?: boolean; agentSubscriptionStatus?: string }) {
  const pathname = usePathname()

  const renderNavItem = (item: NavItem, isSubItem = false) => {
    const isActive =
      pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + (item.subItems ? "" : "/")))

    let itemDisabled = item.disabled
    if (role === "agent" && !isAgentApproved) {
      const allowedPathsForPending = ["/dashboard", "/dashboard/subscription", "/dashboard/help", "/dashboard/profile"]
      if (!allowedPathsForPending.includes(item.href)) {
        itemDisabled = true
      }
    }

    if (role === "agent" && isAgentApproved) {
      if (agentSubscriptionStatus !== "active") {
        const pathsRequiringActiveSub = ["/dashboard/bundles", "/dashboard/gigs"]
        if (pathsRequiringActiveSub.includes(item.href)) {
          itemDisabled = true
        }
      }
    }

    if (item.subItems) {
      return (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton isActive={isActive} disabled={itemDisabled}>
            <item.icon />
            <span>{item.label}</span>
            {item.isNew && (
              <Badge
                variant="outline"
                className="ml-auto h-5 px-1.5 text-xs bg-primary/20 text-primary border-primary/50 group-data-[collapsible=icon]:hidden"
              >
                New
              </Badge>
            )}
          </SidebarMenuButton>
          <SidebarMenuSub>{item.subItems.map((subItem) => renderNavItem(subItem, true))}</SidebarMenuSub>
        </SidebarMenuItem>
      )
    }

    const ButtonComponent = isSubItem ? SidebarMenuSubButton : SidebarMenuButton
    const ItemComponent = isSubItem ? SidebarMenuSubItem : SidebarMenuItem
    const linkAsChild = isSubItem

    return (
      <ItemComponent key={item.href}>
        {linkAsChild ? (
          <Link href={itemDisabled ? "#" : item.href}>
            <ButtonComponent
              isActive={isActive}
              aria-disabled={itemDisabled}
              disabled={itemDisabled}
              tooltip={item.label}
              asChild
            >
              <item.icon />
              <span>{item.label}</span>
              {item.isNew && (
                <Badge
                  variant="outline"
                  className="ml-auto h-5 px-1.5 text-xs bg-primary/20 text-primary border-primary/50 group-data-[collapsible=icon]:hidden"
                >
                  New
                </Badge>
              )}
            </ButtonComponent>
          </Link>
        ) : (
          <Link href={itemDisabled ? "#" : item.href}>
            <ButtonComponent
              isActive={isActive}
              aria-disabled={itemDisabled}
              disabled={itemDisabled}
              tooltip={item.label}
            >
              <item.icon />
              <span>{item.label}</span>
              {item.isNew && (
                <Badge
                  variant="outline"
                  className="ml-auto h-5 px-1.5 text-xs bg-primary/20 text-primary border-primary/50 group-data-[collapsible=icon]:hidden"
                >
                  New
                </Badge>
              )}
            </ButtonComponent>
          </Link>
        )}
      </ItemComponent>
    )
  }

  const filteredNavItems = navItems.filter((item) => item.roles.includes(role))
  const filteredBottomNavItems = bottomNavItems.filter((item) => item.roles.includes(role))

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
        <SidebarMenu>{filteredNavItems.map((item) => renderNavItem(item))}</SidebarMenu>
      </SidebarGroup>
      {filteredBottomNavItems.length > 0 && (
        <>
          <div className="mt-auto" />
          <SidebarGroup>
            <SidebarGroupLabel>Support</SidebarGroupLabel>
            <SidebarMenu>{filteredBottomNavItems.map((item) => renderNavItem(item))}</SidebarMenu>
          </SidebarGroup>
        </>
      )}
    </>
  )
}
