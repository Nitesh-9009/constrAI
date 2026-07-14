import {
  Home,
  Boxes,
  Truck,
  Bell,
  MessageCircleQuestion,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  section?: string;
}

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Today", icon: Home },
  { href: "/dashboard/materials", label: "My Materials", icon: Boxes },
  { href: "/dashboard/deliveries", label: "Deliveries", icon: Truck },
  { href: "/dashboard/alerts", label: "Needs Attention", icon: Bell },
  { href: "/dashboard/help", label: "Ask for Help", icon: MessageCircleQuestion },
];
