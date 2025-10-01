/*
Component Summary: Defines the shared HTML structure and providers for every route in the app directory.
Steps:
1. Reads the NEXT_LOCALE cookie from Next headers to determine language and direction.
2. Configures the <html> element with lang/dir attributes and global styling.
3. Wraps page content with the Intl provider, marketing header, and footer components.
Component Dependencies: app/providers/IntlProvider.tsx, components/layout/Header.tsx, components/layout/Footer.tsx
External Libs: next/headers
*/

import "./globals.css";
import { cookies } from "next/headers";
import IntlProviderWrapper from "./providers/IntlProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Meead - Organize My Booking",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "ar";

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>
        <IntlProviderWrapper locale={locale}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </IntlProviderWrapper>
      </body>
    </html>
  );
}

