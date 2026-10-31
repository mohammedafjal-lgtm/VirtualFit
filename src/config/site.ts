import {
    LayoutDashboard,
    Shirt,
    User,
    Sparkles,
    History,
    type LucideIcon,
  } from "lucide-react";
  
  export const site = {
    name: "VirtualFit",
    description: "AI-powered virtual try-on",
  };
  
  export type NavItem = {
    href: string;
    label: string;
    icon: LucideIcon;
  };
  
  export const dashboardNav: NavItem[] = [
    { href: "/dashboard",           label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/wardrobe",  label: "Wardrobe", icon: Shirt },
    { href: "/dashboard/portraits", label: "Portraits", icon: User },
    { href: "/dashboard/try-on",    label: "Try-on",   icon: Sparkles },
    { href: "/dashboard/history",   label: "History",  icon: History },
  ];