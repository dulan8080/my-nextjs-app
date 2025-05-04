import DashboardClient from "@/components/dashboard/DashboardClient";

export default function CustomersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardClient>{children}</DashboardClient>;
} 