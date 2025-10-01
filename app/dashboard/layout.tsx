/*
Component Summary: Applies the shared dashboard shell to every route under /dashboard.
Steps:
1. Declares dashboard-specific metadata such as the document title.
2. Receives child route content as a typed ReactNode prop.
3. Wraps children with the DashboardLayout component to render navigation and chrome.
Component Dependencies: app/dashboard/components/dashboardLayout.tsx
External Libs: react
*/

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

