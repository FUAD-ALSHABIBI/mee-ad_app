"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useIntl } from "react-intl";
import { Calendar, Menu, X } from "lucide-react";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

interface HeaderProps {
  isAuthenticated?: boolean;
}

export default function Header({ isAuthenticated }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const intl = useIntl();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Calendar className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900">Mee&apos;ad</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link
                href="/pricing"
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === "/pricing"
                    ? "text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {intl.formatMessage({ id: "common.pricing", defaultMessage: "Pricing" })}
              </Link>

              <LanguageSwitcher />

              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className={`rounded-md px-3 py-2 text-sm font-medium ${
                      pathname.startsWith("/dashboard")
                        ? "text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {intl.formatMessage({ id: "common.dashboard", defaultMessage: "Dashboard" })}
                  </Link>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="btn btn-primary"
                  >
                    {intl.formatMessage({
                      id: "dashboard.overview.title",
                      defaultMessage: "Overview",
                    })}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    {intl.formatMessage({ id: "common.login", defaultMessage: "Login" })}
                  </Link>
                  <Link
                    href="/auth/register"
                    className="btn btn-primary"
                  >
                    {intl.formatMessage({ id: "common.register", defaultMessage: "Register" })}
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            <Link
              href="/pricing"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              {intl.formatMessage({ id: "common.pricing", defaultMessage: "Pricing" })}
            </Link>

            <div className="flex items-center px-3 py-2">
              <LanguageSwitcher />
            </div>

            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {intl.formatMessage({ id: "common.dashboard", defaultMessage: "Dashboard" })}
                </Link>
                <Link
                  href="/appointments"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {intl.formatMessage({ id: "common.appointments", defaultMessage: "Appointments" })}
                </Link>
                <Link
                  href="/settings"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {intl.formatMessage({ id: "common.settings", defaultMessage: "Settings" })}
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {intl.formatMessage({ id: "common.login", defaultMessage: "Login" })}
                </Link>
                <Link
                  href="/auth/register"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {intl.formatMessage({ id: "common.register", defaultMessage: "Register" })}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}


