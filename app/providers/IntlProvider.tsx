"use client";

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
