import DashboardClient from "@/components/dashboard/DashboardClient";

export default function PrintQueueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardClient>{children}</DashboardClient>;
} 