"use client";

import { getSupabaseBrowserClient } from "./supabase/supa";
import type { Appointment, AppointmentInput } from "./types/appointment";

export type { Appointment, AppointmentInput } from "./types/appointment";

const supabase = getSupabaseBrowserClient();

const APPOINTMENT_COLUMNS = "id, business_id, service_id, client_name, client_email, client_phone, appointment_date, appointment_time, status, notes, created_at, updated_at";

export async function createAppointment(
  appointment: AppointmentInput
): Promise<Appointment | null> {
  const { data, error } = await supabase
    .from("appointments")
    .insert([appointment])
    .select(APPOINTMENT_COLUMNS)
    .single();

  if (error) {
    console.error("Error creating appointment:", error.message);
    return null;
  }

  return data as Appointment;
}

export async function getAppointments(
  businessId: string
): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from("appointments")
    .select(APPOINTMENT_COLUMNS)
    .eq("business_id", businessId)
    .order("appointment_date", { ascending: true })
    .order("appointment_time", { ascending: true });

  if (error) {
    console.error("Error fetching appointments:", error.message);
    return [];
  }

  return (data || []) as Appointment[];
}

export async function updateAppointmentStatus(
  id: string,
  status: Appointment["status"]
): Promise<Appointment | null> {
  const { data, error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id)
    .select(APPOINTMENT_COLUMNS)
    .single();

  if (error) {
    console.error("Error updating appointment status:", error.message);
    return null;
  }

  return data as Appointment;
}
