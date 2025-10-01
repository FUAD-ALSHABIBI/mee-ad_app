"use server";

import type { Business } from "@/lib/interfaces";
import type { Service } from "@/app/types/business";
import { createClient } from "@/utils/supabase/server";

export async function getBusinessByUrlServer(
  bookingUrl: string
): Promise<{ business: Business | null; error: string | null }> {
  if (!bookingUrl) {
    return { business: null, error: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("booking_url", bookingUrl)
    .maybeSingle();

  if (error) {
    console.error("Error fetching business by url (server):", error.message);
    return { business: null, error: error.message };
  }

  return { business: (data as Business) ?? null, error: null };
}

export async function getBusinessServicesServer(
  businessId: string
): Promise<{ services: Service[]; error: string | null }> {
  if (!businessId) {
    return { services: [], error: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("business_id", businessId);

  if (error) {
    console.error(
      "Error fetching business services (server):",
      error.message
    );
    return { services: [], error: error.message };
  }

  const services = (data ?? []).map((service) => ({
    id: service.id,
    name: service.name ?? "",
    description: service.description ?? "",
    duration: typeof service.duration === "number" ? service.duration : 0,
    price: typeof service.price === "number" ? service.price : 0,
    currency: service.currency ?? "",
    category: service.category ?? undefined,
  }));

  return { services, error: null };
}
