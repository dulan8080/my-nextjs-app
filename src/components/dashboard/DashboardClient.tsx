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

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  bgClass: string;
}

export default function DashboardClient({
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
    {
      name: "Dashboard",
      href: "/dashboard",
      bgClass: "bg-gradient-to-r from-blue-500 to-indigo-600",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Jobs",
      href: "/dashboard/jobs",
      bgClass: "bg-gradient-to-r from-purple-500 to-purple-700",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "New Job",
      href: "/dashboard/jobs/new",
      bgClass: "bg-gradient-to-r from-green-500 to-emerald-600",
      icon: <FilePlus2 className="h-5 w-5" />,
    },
    {
      name: "Customers",
      href: "/dashboard/customers",
      bgClass: "bg-gradient-to-r from-orange-500 to-orange-700",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Print Queue",
      href: "/dashboard/print-queue",
      bgClass: "bg-gradient-to-r from-cyan-500 to-cyan-700",
      icon: <Printer className="h-5 w-5" />,
    },
    {
      name: "Approval Queue",
      href: "/dashboard/approval-queue",
      bgClass: "bg-gradient-to-r from-pink-500 to-pink-700",
      icon: <CheckCircle className="h-5 w-5" />,
    },
    {
      name: "Reports",
      href: "/dashboard/reports",
      bgClass: "bg-gradient-to-r from-violet-500 to-violet-700",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      bgClass: "bg-gradient-to-r from-gray-500 to-gray-700",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  // Don't render the full UI until client-side hydration is complete
  if (!mounted) {
    return <div className="min-h-screen bg-gray-100 dark:bg-gray-950"></div>;
  }

  // Get current page title based on the pathname - only run on client
  const getCurrentPageTitle = () => {
    if (!mounted) return "Dashboard";
    const currentNav = navigation.find(item => 
      pathname === item.href || pathname.startsWith(`${item.href}/`)
    );
    return currentNav?.name || "Dashboard";
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-white dark:bg-gray-900 lg:block lg:w-72">
        <div className="flex h-full flex-col">
          <div className="space-y-4 py-4">
            <div className="px-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600 shadow-lg">
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="white" 
                    className="h-8 w-8"
                  >
                    <path d="M6.925 16.875Q5.2 16.875 4 15.675Q2.8 14.475 2.8 12.75Q2.8 11.025 4 9.825Q5.2 8.625 6.925 8.625H17.075Q18.8 8.625 20 9.825Q21.2 11.025 21.2 12.75Q21.2 14.475 20 15.675Q18.8 16.875 17.075 16.875H15.9V15.375H17.075Q18.1 15.375 18.825 14.65Q19.55 13.925 19.55 12.9Q19.55 11.875 18.825 11.15Q18.1 10.425 17.075 10.425H6.925Q5.9 10.425 5.175 11.15Q4.45 11.875 4.45 12.9Q4.45 13.925 5.175 14.65Q5.9 15.375 6.925 15.375H9V16.875Z" />
                    <path d="M8.5 20.5V5H10V20.5ZM14 20.5V5H15.5V20.5Z" />
                  </svg>
                </div>
              </div>
              
              <h1 className="text-center font-bold text-xl tracking-tight mb-6">
                ZynkPrint
              </h1>
              
              <Separator className="my-4" />
              
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                      (pathname === item.href || pathname.startsWith(`${item.href}/`)) 
                        ? "bg-gray-100 dark:bg-gray-800" 
                        : "transparent"
                    )}
                  >
                    <div className={cn("mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white shadow-sm", item.bgClass)}>
                      {item.icon}
                    </div>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-auto p-4">
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">Admin User</p>
                  <p className="text-muted-foreground">admin@zynkprint.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <div className="flex flex-col flex-1">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-900 lg:hidden">
            <h1 className="text-xl font-bold">{getCurrentPageTitle()}</h1>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
          </div>
          
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex h-full flex-col">
              <div className="space-y-4 py-4">
                <div className="px-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="flex h-14 w-14 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600 shadow-lg">
                      <svg 
                        viewBox="0 0 24 24" 
                        fill="white" 
                        className="h-8 w-8"
                      >
                        <path d="M6.925 16.875Q5.2 16.875 4 15.675Q2.8 14.475 2.8 12.75Q2.8 11.025 4 9.825Q5.2 8.625 6.925 8.625H17.075Q18.8 8.625 20 9.825Q21.2 11.025 21.2 12.75Q21.2 14.475 20 15.675Q18.8 16.875 17.075 16.875H15.9V15.375H17.075Q18.1 15.375 18.825 14.65Q19.55 13.925 19.55 12.9Q19.55 11.875 18.825 11.15Q18.1 10.425 17.075 10.425H6.925Q5.9 10.425 5.175 11.15Q4.45 11.875 4.45 12.9Q4.45 13.925 5.175 14.65Q5.9 15.375 6.925 15.375H9V16.875Z" />
                        <path d="M8.5 20.5V5H10V20.5ZM14 20.5V5H15.5V20.5Z" />
                      </svg>
                    </div>
                  </div>
                  
                  <h1 className="text-center font-bold text-xl tracking-tight mb-6">
                    ZynkPrint
                  </h1>
                  
                  <Separator className="my-4" />
                  
                  <ScrollArea className="h-[calc(100vh-200px)]">
                    <div className="space-y-1">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                            (pathname === item.href || pathname.startsWith(`${item.href}/`)) 
                              ? "bg-gray-100 dark:bg-gray-800" 
                              : "transparent"
                          )}
                        >
                          <div className={cn("mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white shadow-sm", item.bgClass)}>
                            {item.icon}
                          </div>
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
              <div className="mt-auto p-4">
                <Separator className="my-4" />
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">Admin User</p>
                    <p className="text-muted-foreground">admin@zynkprint.com</p>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
          
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </Sheet>
    </div>
  );
} 