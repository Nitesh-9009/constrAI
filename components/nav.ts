import {
  Home,
  Boxes,
  Truck,
  Bell,
  MessageCircleQuestion,
  Building2,
  FolderKanban,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  group?: "main" | "manage";
}

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Today", icon: Home, group: "main" },
  { href: "/dashboard/materials", label: "My Materials", icon: Boxes, group: "main" },
  { href: "/dashboard/deliveries", label: "Deliveries", icon: Truck, group: "main" },
  { href: "/dashboard/alerts", label: "Needs Attention", icon: Bell, group: "main" },
  { href: "/dashboard/help", label: "Ask for Help", icon: MessageCircleQuestion, group: "main" },
  { href: "/dashboard/suppliers", label: "Suppliers", icon: Building2, group: "manage" },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban, group: "manage" },
  { href: "/dashboard/team", label: "Team", icon: Users, group: "manage" },
];
