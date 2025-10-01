/*
Component Summary: Loads profile and service data for the dashboard settings experience.
Steps:
1. Authenticates the current user via Supabase and redirects unauthenticated visitors to login.
2. Retrieves business metadata and service definitions from the database.
3. Passes normalized results down to the SettingsClient component for rendering and edits.
Component Dependencies: app/dashboard/settings/components/SettingsClient.tsx
External Libs: next/navigation, @/utils/supabase/server
*/

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import SettingsClient, {
  SettingsBusiness,
  SettingsService,
} from "./components/SettingsClient";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: userResult,
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !userResult?.user) {
    redirect("/auth/login");
  }

  const user = userResult.user;

  const {
    data: businessData,
    error: businessError,
  } = await supabase
    .from("businesses")
    .select(
      "id, name, description, business_type, booking_url, address, phone, email, website"
    )
    .eq("user_id", user.id)
    .maybeSingle();

  if (businessError) {
    console.error("Settings business fetch error:", businessError.message);
  }

  const business: SettingsBusiness | null = businessData
    ? {
        id: businessData.id,
        name: businessData.name ?? null,
        description: businessData.description ?? null,
        business_type: businessData.business_type ?? null,
        booking_url: businessData.booking_url ?? null,
        address: businessData.address ?? null,
        phone: businessData.phone ?? null,
        email: businessData.email ?? null,
        website: businessData.website ?? null,
      }
    : null;

  let services: SettingsService[] = [];

  if (business) {
    const {
      data: servicesData,
      error: servicesError,
    } = await supabase
      .from("services")
      .select("id, name, duration, price, currency, category")
      .eq("business_id", business.id)
      .order("name", { ascending: true });

    if (servicesError) {
      console.error("Settings services fetch error:", servicesError.message);
    } else if (servicesData) {
      services = servicesData.map((service) => ({
        id: service.id,
        name: service.name ?? null,
        duration: service.duration ?? null,
        price: service.price ?? null,
        currency: service.currency ?? null,
        category: service.category ?? null,
      }));
    }
  }

  return (
    <SettingsClient
      business={business}
      services={services}
      userEmail={user.email ?? null}
    />
  );
}

