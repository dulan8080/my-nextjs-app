import DashboardClient from "@/components/dashboard/DashboardClient";

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardClient>{children}</DashboardClient>;
} 