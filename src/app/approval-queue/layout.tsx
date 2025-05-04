import DashboardClient from "@/components/dashboard/DashboardClient";

export default function ApprovalQueueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardClient>{children}</DashboardClient>;
} 