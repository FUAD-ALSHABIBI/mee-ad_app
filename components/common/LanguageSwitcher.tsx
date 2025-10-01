"use client";

/*
Component Summary: Provides a locale dropdown that persists the chosen language in a cookie.
Steps:
1. Reads the active locale from NEXT_LOCALE cookies and prepares translated labels.
2. Toggles a popover menu with React state to list available languages.
3. Persists the selection with js-cookie and reloads to refresh SSR content.
Component Dependencies: None
External Libs: react, react-intl, js-cookie, lucide-react
*/

/*
Component Summary: Provides a locale dropdown that persists the chosen language in a cookie.
Steps:
1. Reads the active locale from NEXT_LOCALE cookies and prepares translated labels.
2. Toggles a popover menu with React state to list available languages.
3. Persists the selection with js-cookie and reloads to refresh SSR content.
Dependent Components: components/layout/Header.tsx, app/dashboard/components/DashboardHeader.tsx
External Libs: react, react-intl, js-cookie, lucide-react
*/

import { useState } from "react";
import { Globe } from "lucide-react";
import Cookies from "js-cookie";
import { useIntl } from "react-intl";

export default function LanguageSwitcher() {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);
  const current = (Cookies.get("NEXT_LOCALE") || "en") as "en" | "ar";

  const englishLabel = intl.formatMessage({
    id: "common.languageEnglish",
    defaultMessage: "English",
  });
  const arabicLabel = intl.formatMessage({
    id: "common.languageArabic",
    defaultMessage: "Arabic",
  });

  const changeLanguage = (lng: "en" | "ar") => {
    Cookies.set("NEXT_LOCALE", lng, { expires: 365 });
    setIsOpen(false);
    window.location.reload(); // force reload so SSR layout uses new cookie
  };

  const currentLabel = current === "en" ? englishLabel : arabicLabel;

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe size={18} className="mr-2" />
        <span className="hidden sm:inline">{currentLabel}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-36 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu">
            <button
              className={`block w-full px-4 py-2 text-left text-sm ${
                current === "en"
                  ? "bg-gray-100 font-medium text-gray-900"
                  : "text-gray-700"
              }`}
              onClick={() => changeLanguage("en")}
            >
              {englishLabel}
            </button>
            <button
              className={`block w-full px-4 py-2 text-left text-sm ${
                current === "ar"
                  ? "bg-gray-100 font-medium text-gray-900"
                  : "text-gray-700"
              }`}
              onClick={() => changeLanguage("ar")}
            >
              {arabicLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


