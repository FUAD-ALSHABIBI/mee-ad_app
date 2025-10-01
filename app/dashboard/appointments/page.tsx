import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AppointmentsClient from "./components/AppointmentsClient";
import type { Appointment } from "@/lib/appointment";

export default async function AppointmentsPage() {
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
    .select("id, name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (businessError) {
    console.error("Appointments business fetch error:", businessError.message);
  }

  const businessId = businessData?.id ?? null;

  let appointments: Appointment[] = [];
  let fetchError: string | null = null;

  if (businessId) {
    const {
      data: appointmentsData,
      error: appointmentsError,
    } = await supabase
      .from("appointments")
      .select(
        "id, business_id, service_id, client_name, client_email, client_phone, appointment_date, appointment_time, status, notes"
      )
      .eq("business_id", businessId)
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true });

    if (appointmentsError) {
      console.error("Appointments fetch error:", appointmentsError.message);
      fetchError = appointmentsError.message;
    } else if (appointmentsData) {
      appointments = appointmentsData as Appointment[];
    }
  }

  return (
    <AppointmentsClient
      businessId={businessId}
      businessName={businessData?.name ?? null}
      initialAppointments={appointments}
      fetchError={fetchError}
    />
  );
}
