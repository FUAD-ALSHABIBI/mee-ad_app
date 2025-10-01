"use client";

/*
Component Summary: Renders the dashboard top bar with language toggle, notifications, and user menu.
Steps:
1. Loads the current user via Supabase helpers to derive a display name for the avatar menu.
2. Manages dropdown visibility with click-outside and escape key listeners.
3. Exposes language switching, profile links, and logout actions in the user menu.
Component Dependencies: components/common/LanguageSwitcher.tsx
External Libs: react, react-intl, lucide-react, next/link, @/lib/supabase/auth, @supabase/supabase-js
*/

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

  // Ø§ØºÙ„Ø§Ù‚ Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© Ø¹Ù†Ø¯ Ø§Ù„Ø¶ØºØ· Ø®Ø§Ø±Ø¬Ù‡Ø§
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

  // Ø§ØºÙ„Ø§Ù‚ Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© Ø¹Ù†Ø¯ Ø§Ù„Ø¶ØºØ· Ø¹Ù„Ù‰ Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setUserMenuOpen(false);
    };

    if (userMenuOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [userMenuOpen]);

  // Ø¬Ù„Ø¨ Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…
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

  // ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø®Ø±ÙˆØ¬
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
      {/* ØªØºÙŠÙŠØ± Ø§Ù„Ù„ØºØ© */}
      <div className="hidden sm:block">
        <LanguageSwitcher />
      </div>

      {/* Ø§Ù„Ø¥Ø´Ø¹Ø§Ø±Ø§Øª */}
      <button
        type="button"
        className="rounded-full bg-white p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-150"
        aria-label={intl.formatMessage({ id: "common.notifications" })}
        title={intl.formatMessage({ id: "common.notifications" })}
      >
        <Bell size={18} className="sm:w-5 sm:h-5" />
      </button>

      {/* Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ù…Ù†Ø³Ø¯Ù„Ø© Ù„Ù„Ù…Ø³ØªØ®Ø¯Ù… */}
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
            {/* Ø§Ù„Ù„ØºØ© Ù„Ù„Ù…ÙˆØ¨Ø§ÙŠÙ„ */}
            <div className="block sm:hidden border-b border-gray-100 pb-2 mb-2">
              <div className="px-4 py-2">
                <LanguageSwitcher />
              </div>
            </div>

            {/* Ø§Ø³Ù… Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù… Ù„Ù„Ù…ÙˆØ¨Ø§ÙŠÙ„ */}
            <div className="block md:hidden px-4 py-2 border-b border-gray-100 mb-2">
              <p className="text-sm font-medium text-gray-900 truncate">
                {isLoading
                  ? intl.formatMessage({ id: "common.loading" })
                  : userName}
              </p>
            </div>

            {/* Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª */}
            <Link
              href="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              onClick={() => setUserMenuOpen(false)}
            >
              <Settings size={16} className="mr-3" />
              {intl.formatMessage({ id: "common.settings" })}
            </Link>

            {/* ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø®Ø±ÙˆØ¬ */}
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

