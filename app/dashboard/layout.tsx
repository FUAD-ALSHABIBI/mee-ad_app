import type { ReactNode } from "react";
import DashboardLayout from "./components/dashboardLayout";

export const metadata = {
  title: "Mee'ad - Organize My Booking | Dashboard",
};

export default function DashLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
