import type React from "react";
import {
  LayoutDashboard,
  Settings,
  Users,
  HelpCircle,
  CircleGauge,
  User,
  Shield,
  Menu,
  Contact,
  Store,
  List,
  Lock,
  ShieldCheck,
  Package,
  ShoppingCart,
  Truck,
  FileText,
  Database,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Settings,
  Users,
  CircleGauge,
  User,
  Shield,
  Menu,
  Contact,
  Store,
  List,
  Lock,
  ShieldCheck,
  Package,
  ShoppingCart,
  Truck,
  FileText,
  Database,
};

const DynamicIcon = ({ name, ...props }: { name?: string } & Omit<React.ComponentProps<LucideIcon>, "name">) => {
  const IconComponent = iconMap[name ?? ""] ?? HelpCircle;
  return <IconComponent {...props} />;
};

export default DynamicIcon;
