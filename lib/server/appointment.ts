"use server";

import type { Appointment, AppointmentInput } from "@/lib/types/appointment";
import { createClient } from "@/utils/supabase/server";

export async function createAppointmentServer(
  appointment: AppointmentInput
): Promise<{ appointment: Appointment | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .insert([appointment])
    .select()
    .single();

  if (error) {
    console.error("Error creating appointment (server):", error.message);
    return { appointment: null, error: error.message };
  }

  return { appointment: data as Appointment, error: null };
}
