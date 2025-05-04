import DashboardClient from "@/components/dashboard/DashboardClient";

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardClient>{children}</DashboardClient>;
} 