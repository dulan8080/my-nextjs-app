import DashboardClient from "@/components/dashboard/DashboardClient";
import AuthWrapper from "@/components/auth/AuthWrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthWrapper>
      <DashboardClient>
        {children}
      </DashboardClient>
    </AuthWrapper>
  );
} 