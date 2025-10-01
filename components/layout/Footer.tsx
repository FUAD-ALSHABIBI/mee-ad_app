"use client";

/*
Component Summary: Renders the public marketing footer with localized link sections and social links.
Steps:
1. Exits early on dashboard routes to avoid duplicate layouts.
2. Groups navigation and auth links with react-intl copy.
3. Shows social icons and the current year for brand presence.
Component Dependencies: None
External Libs: next/link, next/navigation, react-intl, lucide-react
*/

/*
Component Summary: Renders the public marketing footer with localized link sections and social links.
Steps:
1. Exits early on dashboard routes to avoid duplicate layouts.
2. Groups navigation and auth links with react-intl copy.
3. Shows social icons and the current year for brand presence.
Dependent Components: app/layout.tsx
External Libs: next/link, next/navigation, react-intl, lucide-react
*/

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIntl } from "react-intl";
import { Calendar, Instagram, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  const intl = useIntl();
  const pathname = usePathname();

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand + tagline */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-primary-light" />
              <span className="ml-2 text-xl font-bold">Mee&apos;ad</span>
            </div>
            <p className="text-gray-400 max-w-xs">
              {intl.formatMessage({ id: "common.tagline", defaultMessage: "Organize your bookings easily" })}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Dashboard Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              {intl.formatMessage({ id: "common.dashboard", defaultMessage: "Dashboard" })}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-white">
                  {intl.formatMessage({ id: "dashboard.overview.title", defaultMessage: "Overview" })}
                </Link>
              </li>
              <li>
                <Link href="/appointments" className="text-gray-400 hover:text-white">
                  {intl.formatMessage({ id: "common.appointments", defaultMessage: "Appointments" })}
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-gray-400 hover:text-white">
                  {intl.formatMessage({ id: "common.settings", defaultMessage: "Settings" })}
                </Link>
              </li>
            </ul>
          </div>

          {/* Profile / Auth Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              {intl.formatMessage({ id: "common.profile", defaultMessage: "Profile" })}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white">
                  {intl.formatMessage({ id: "common.pricing", defaultMessage: "Pricing" })}
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-gray-400 hover:text-white">
                  {intl.formatMessage({ id: "common.login", defaultMessage: "Login" })}
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-gray-400 hover:text-white">
                  {intl.formatMessage({ id: "common.register", defaultMessage: "Register" })}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              {intl.formatMessage({ id: "common.settings", defaultMessage: "Settings" })}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  {intl.formatMessage({ id: "dashboard.settings.privacy", defaultMessage: "Privacy Policy" })}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  {intl.formatMessage({ id: "dashboard.settings.terms", defaultMessage: "Terms & Conditions" })}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-center text-sm text-gray-400">
            &copy; {year} Mee&apos;ad.{" "}
            {intl.formatMessage({ id: "home.footer.rights", defaultMessage: "All rights reserved." })}
          </p>
        </div>
      </div>
    </footer>
  );
}










