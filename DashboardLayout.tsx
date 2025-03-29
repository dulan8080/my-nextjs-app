"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard,
  FileText,
  FilePlus2,
  Users,
  Printer,
  CheckCircle,
  BarChart3,
  Settings,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import HydrationGuard from "@/components/HydrationGuard";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  bgClass: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  
  // Prevent hydration mismatch by only rendering after component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const navigation: NavItem[] = [
    // ... existing code ...
  ];

  // Only compute current page title on the client side
  const currentPageTitle = mounted ? (() => {
    const currentNav = navigation.find(item => 
      pathname === item.href || pathname.startsWith(`${item.href}/`)
    );
    return currentNav?.name || "Dashboard";
  })() : "Dashboard"; // Default value for server render

  // Create a consistent initial UI for both server and client
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
        {/* Simple loading skeleton */}
        <div className="hidden lg:block lg:w-72 h-full bg-white dark:bg-gray-900 border-r"></div>
      </div>
    );
  }

  // ... rest of your component remains the same ...

  return (
    <HydrationGuard>
      <div className="ml-auto flex items-center space-x-4">
        {/* Dynamic content here */}
      </div>
    </HydrationGuard>
  );
} 