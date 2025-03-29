"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  X,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/lib/authContext";

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
  const router = useRouter();
  const { logOut } = useAuth();
  
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

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await logOut();
      router.push('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">Admin User</p>
                  <p className="text-muted-foreground">admin@zynkprint.com</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign Out">
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Sign Out</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Settings</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="flex lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 z-10 h-16 items-center border-b px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <div className="flex h-16 items-center justify-between border-b px-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600">
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="white" 
                    className="h-6 w-6"
                  >
                    <path d="M6.925 16.875Q5.2 16.875 4 15.675Q2.8 14.475 2.8 12.75Q2.8 11.025 4 9.825Q5.2 8.625 6.925 8.625H17.075Q18.8 8.625 20 9.825Q21.2 11.025 21.2 12.75Q21.2 14.475 20 15.675Q18.8 16.875 17.075 16.875H15.9V15.375H17.075Q18.1 15.375 18.825 14.65Q19.55 13.925 19.55 12.9Q19.55 11.875 18.825 11.15Q18.1 10.425 17.075 10.425H6.925Q5.9 10.425 5.175 11.15Q4.45 11.875 4.45 12.9Q4.45 13.925 5.175 14.65Q5.9 15.375 6.925 15.375H9V16.875Z" />
                    <path d="M8.5 20.5V5H10V20.5ZM14 20.5V5H15.5V20.5Z" />
                  </svg>
                </div>
                <span className="font-bold text-lg">ZynkPrint</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-64px)]">
              <div className="space-y-1 p-4">
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
                    <div className={cn("mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white", item.bgClass)}>
                      {item.icon}
                    </div>
                    <span>{item.name}</span>
                  </Link>
                ))}
                
                {/* Add a separator and sign out button */}
                <div className="pt-4 mt-6 border-t border-gray-200">
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-100 text-red-600">
                      <LogOut className="h-5 w-5" />
                    </div>
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
        
        <span className="flex items-center space-x-2">
          <span className="font-medium">ZynkPrint</span>
        </span>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar for larger screens */}
        <header className="hidden lg:flex h-16 items-center border-b bg-white dark:bg-gray-900 px-6">
          <h1 className="text-xl font-semibold">{getCurrentPageTitle()}</h1>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="sm">
              Help
            </Button>
            <div className="relative group">
              <button className="flex items-center space-x-1">
                <Avatar>
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 invisible group-hover:visible z-50">
                <div className="px-4 py-3">
                  <p className="text-sm">Signed in as</p>
                  <p className="text-sm font-medium text-gray-900 truncate">admin@zynkprint.com</p>
                </div>
                <div className="border-t border-gray-100"></div>
                <button 
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 pt-[80px] lg:pt-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 