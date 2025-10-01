"use client";

// lib/services.ts
import { getSupabaseBrowserClient } from "./supabase/supa";
import { Business, Service } from "./interfaces";

const supabase = getSupabaseBrowserClient();

// Create new service
export async function createService(business: Business, service: Service): Promise<Service | null> {
  // Drop the client-generated id so Supabase can assign its uuid
  const { id: _discardedId, ...serviceData } = service;
  void _discardedId;

  const { data, error } = await supabase
    .from("services")
    .insert([{ ...serviceData, business_id: business.id }])
    .select()
    .single();

  if (error) {
    console.error("Error creating service:", error.message);
    return null;
  }

  return data as Service;
}

// Get services for a business
export async function getServices(businessId: string): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("business_id", businessId);

  if (error) {
    console.error("Error fetching services:", error.message);
    return [];
  }

  return (data || []) as Service[];
}
