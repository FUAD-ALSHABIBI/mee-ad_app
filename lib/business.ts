"use client";

import { getSupabaseBrowserClient } from "./supabase/supa";
import type { Business, Service } from "./interfaces";

const supabase = getSupabaseBrowserClient();

export async function createBusiness(
  business: Omit<Business, "id">
): Promise<Business | null> {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) {
    console.error(
      "Error fetching auth user for business create:",
      authError?.message
    );
    return null;
  }

  const payload = { ...business, user_id: authData.user.id } as Record<
    string,
    unknown
  >;

  const { data, error } = await supabase
    .from("businesses")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("Error creating business:", error.message);
    return null;
  }

  return data as Business;
}

export async function getBusinessById(id: string): Promise<Business | null> {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching business:", error.message);
    return null;
  }

  return data as Business;
}

export type BusinessUpdateInput = Partial<
  Pick<
    Business,
    "name" | "description" | "address" | "phone" | "email" | "website"
  >
>;

export async function updateBusinessDetails(
  id: string,
  updates: BusinessUpdateInput
): Promise<Business | null> {
  const payload = Object.fromEntries(
    Object.entries(updates).filter(([, value]) => value !== undefined)
  );

  if (Object.keys(payload).length === 0) {
    return getBusinessById(id);
  }

  const { data, error } = await supabase
    .from("businesses")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating business:", error.message);
    return null;
  }

  return data as Business;
}

export async function getBusinessByUrl(
  bookingUrl: string
): Promise<Business | null> {
  if (!bookingUrl) {
    return null;
  }

  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("booking_url", bookingUrl)
    .maybeSingle();

  if (error) {
    console.error("Error fetching business by url:", error.message);
    return null;
  }

  return (data as Business) ?? null;
}

export async function getBusinessServices(
  businessId: string
): Promise<Service[]> {
  if (!businessId) {
    return [];
  }

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("business_id", businessId);

  if (error) {
    console.error("Error fetching business services:", error.message);
    return [];
  }

  return (data ?? []).map((service) => ({
    id: service.id,
    name: service.name ?? "",
    description: service.description ?? "",
    duration: typeof service.duration === "number" ? service.duration : 0,
    price: typeof service.price === "number" ? service.price : 0,
    currency: service.currency ?? "",
    category: service.category ?? undefined,
  })) as Service[];
}
