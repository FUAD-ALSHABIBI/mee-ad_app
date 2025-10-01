"use client";

import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Settings,
  LogOut,
} from "lucide-react";
import { useIntl } from "react-intl";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/supabase/auth";

interface SidebarProps {
  closeSidebar: () => void;
}

const Sidebar = ({ closeSidebar }: SidebarProps) => {
  const intl = useIntl();
  const pathname = usePathname();

  const navigation = [
    {
      name: intl.formatMessage({ id: "dashboard.overview.title" }),
      href: "/dashboard",
      icon: LayoutDashboard,
      current: pathname === "/dashboard",
    },
    {
      name: intl.formatMessage({ id: "common.appointments" }),
      href: "/dashboard/appointments",
      icon: Calendar,
      current: pathname === "/dashboard/appointments",
    },
    {
      name: intl.formatMessage({ id: "wizard.title" }),
      href: "/dashboard/setup",
      icon: ClipboardList,
      current: pathname === "/dashboard/setup",
    },
    {
      name: intl.formatMessage({ id: "common.settings" }),
      href: "/dashboard/settings",
      icon: Settings,
      current: pathname === "/dashboard/settings",
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      closeSidebar();
    }
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <nav className="space-y-1">
        {navigation.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
              item.current
                ? "bg-primary bg-opacity-10 text-primary"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={closeSidebar}
          >
            <item.icon
              className={`mr-3 h-5 w-5 flex-shrink-0 ${
                item.current
                  ? "text-primary"
                  : "text-gray-500 group-hover:text-gray-600"
              }`}
              aria-hidden="true"
            />
            {item.name}
          </a>
        ))}
      </nav>

      <div className="mt-auto">
        <button
          className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500 group-hover:text-gray-600" />
          {intl.formatMessage({ id: "common.logout" })}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
