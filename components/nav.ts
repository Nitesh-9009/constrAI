import {
  LayoutDashboard,
  PackageSearch,
  CalendarRange,
  Truck,
  FileStack,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  section?: string;
}

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Control Tower", icon: LayoutDashboard },
  { href: "/dashboard#materials", label: "Materials", icon: PackageSearch },
  { href: "/dashboard#schedule", label: "Schedule Impact", icon: CalendarRange },
  { href: "/dashboard#logistics", label: "Logistics", icon: Truck },
  { href: "/dashboard#documents", label: "Documents", icon: FileStack },
];
