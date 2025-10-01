"use client";

/*
Component Summary: Supplies a flattened react-intl provider for the selected locale.
Steps:
1. Flattens nested locale JSON files into key-value pairs for react-intl consumption.
2. Chooses the provided locale with a safe fallback to English.
3. Wraps children with IntlProvider so translations are available throughout the tree.
Component Dependencies: None
External Libs: react-intl, @/i18n/locales/en.json, @/i18n/locales/ar.json
*/

import { IntlProvider } from "react-intl";
import en from "@/i18n/locales/en.json";
import ar from "@/i18n/locales/ar.json";

function flattenMessages(nested: any, prefix = ""): Record<string, string> {
  return Object.keys(nested).reduce((acc: Record<string, string>, key) => {
    const value = nested[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "string") {
      acc[prefixedKey] = value;
    } else if (value && typeof value === "object") {
      Object.assign(acc, flattenMessages(value, prefixedKey));
    }

    return acc;
  }, {});
}

const messages = {
  en: flattenMessages(en),
  ar: flattenMessages(ar),
};

export default function IntlProviderWrapper({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: "en" | "ar";
}) {
  const selectedLocale = locale === "ar" ? "ar" : "en";

  return (
    <IntlProvider
      locale={selectedLocale}
      messages={messages[selectedLocale]}
      defaultLocale="en"
    >
      {children}
    </IntlProvider>
  );
}

