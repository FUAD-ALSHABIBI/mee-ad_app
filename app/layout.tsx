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
