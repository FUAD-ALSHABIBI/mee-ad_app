"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useIntl } from "react-intl";
import type { User } from "@supabase/supabase-js";
import { Bell, UserCircle, ChevronDown, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { logout, getUser } from "@/lib/supabase/auth";

const DashboardHeader = () => {
  const intl = useIntl();
  const defaultUserName = intl.formatMessage({ id: "common.defaultUser" });

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string>(defaultUserName);
  const [isLoading, setIsLoading] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // اغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  // اغلاق القائمة عند الضغط على Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setUserMenuOpen(false);
    };

    if (userMenuOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [userMenuOpen]);

  // جلب بيانات المستخدم
  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const user = (await getUser()) as User | null;

        if (!isMounted) return;

        const displayName =
          user?.user_metadata?.name ||
          user?.email?.split("@")[0] ||
          defaultUserName;

        setUserName(displayName);
      } catch (error) {
        console.error("Error fetching user:", error);
        if (isMounted) setUserName(defaultUserName);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchUser();
    return () => {
      isMounted = false;
    };
  }, [defaultUserName]);

  // تسجيل الخروج
  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setUserMenuOpen(false);
    }
  }, []);

  return (
    <header className="flex items-center justify-end space-x-2 sm:space-x-4">
      {/* تغيير اللغة */}
      <div className="hidden sm:block">
        <LanguageSwitcher />
      </div>

      {/* الإشعارات */}
      <button
        type="button"
        className="rounded-full bg-white p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-150"
        aria-label={intl.formatMessage({ id: "common.notifications" })}
        title={intl.formatMessage({ id: "common.notifications" })}
      >
        <Bell size={18} className="sm:w-5 sm:h-5" />
      </button>

      {/* القائمة المنسدلة للمستخدم */}
      <div className="relative" ref={dropdownRef}>
        <button
          ref={buttonRef}
          type="button"
          className="flex items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-150 hover:bg-gray-50 px-2 py-1"
          onClick={() => setUserMenuOpen((prev) => !prev)}
          aria-haspopup="true"
          aria-expanded={userMenuOpen}
          aria-label={intl.formatMessage({ id: "common.userMenu" })}
        >
          <UserCircle size={28} className="text-gray-500 sm:w-8 sm:h-8" />
          <span className="mx-2 hidden text-sm font-medium text-gray-700 md:block truncate max-w-24">
            {isLoading ? (
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            ) : (
              userName
            )}
          </span>
          <ChevronDown
            size={14}
            className={`text-gray-500 hidden sm:block transition-transform duration-200 ${
              userMenuOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {userMenuOpen && (
          <div
            className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 animate-in fade-in-0 zoom-in-95"
            role="menu"
          >
            {/* اللغة للموبايل */}
            <div className="block sm:hidden border-b border-gray-100 pb-2 mb-2">
              <div className="px-4 py-2">
                <LanguageSwitcher />
              </div>
            </div>

            {/* اسم المستخدم للموبايل */}
            <div className="block md:hidden px-4 py-2 border-b border-gray-100 mb-2">
              <p className="text-sm font-medium text-gray-900 truncate">
                {isLoading
                  ? intl.formatMessage({ id: "common.loading" })
                  : userName}
              </p>
            </div>

            {/* الإعدادات */}
            <Link
              href="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              onClick={() => setUserMenuOpen(false)}
            >
              <Settings size={16} className="mr-3" />
              {intl.formatMessage({ id: "common.settings" })}
            </Link>

            {/* تسجيل الخروج */}
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <LogOut size={16} className="mr-3" />
              {intl.formatMessage({ id: "common.logout" })}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
