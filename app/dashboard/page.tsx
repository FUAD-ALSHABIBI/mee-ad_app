/*
Component Summary: Loads dashboard data on the server before rendering the interactive client view.
Steps:
1. Uses Supabase auth to verify the current user and redirects to login when unauthenticated.
2. Queries business, service, and appointment tables while collecting error diagnostics.
3. Computes derived metrics and passes results into the DashboardClient component.
Component Dependencies: app/dashboard/components/DashboardClient.tsx
External Libs: next/navigation, @/utils/supabase/server
*/

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import DashboardClient from "./components/DashboardClient";

type BusinessRow = {
  id: string;
  name: string | null;
  description: string | null;
  booking_url: string | null;
};

type ServiceRow = {
  id: string;
  name: string | null;
  duration: number | null;
  price: number | null;
  currency: string | null;
};

type AppointmentRow = {
  id: string;
  appointment_date: string | null;
  appointment_time: string | null;
  status: string | null;
  client_name: string | null;
  client_email: string | null;
  client_phone: string | null;
  service_id: string | null;
  notes: string | null;
};

function toDateTime(date: string | null, time: string | null): Date | null {
  if (!date) return null;

  const normalizedTime = (() => {
    if (!time) return "00:00:00";
    if (time.length === 5) return `${time}:00`;
    if (time.length === 8) return time;
    return "00:00:00";
  })();

  const parsed = new Date(`${date}T${normalizedTime}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export default async function DashboardPage() {
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
    .select("id, name, booking_url, description")
    .eq("user_id", user.id)
    .maybeSingle();

  if (businessError) {
    console.error("Dashboard business fetch error:", businessError.message);
  }

  const business = (businessData ?? null) as BusinessRow | null;

  let services: ServiceRow[] = [];
  let appointments: AppointmentRow[] = [];

  if (business) {
    const [servicesResponse, appointmentsResponse] = await Promise.all([
      supabase
        .from("services")
        .select("id, name, duration, price, currency")
        .eq("business_id", business.id)
        .order("name", { ascending: true }),
      supabase
        .from("appointments")
        .select("id, appointment_date, appointment_time, status, client_name, client_email, client_phone, service_id, notes")
        .eq("business_id", business.id)
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true }),
    ]);

    if (servicesResponse.error) {
      console.error("Dashboard services fetch error:", servicesResponse.error.message);
    } else if (servicesResponse.data) {
      services = servicesResponse.data as ServiceRow[];
    }

    if (appointmentsResponse.error) {
      console.error("Dashboard appointments fetch error:", appointmentsResponse.error.message);
    } else if (appointmentsResponse.data) {
      appointments = appointmentsResponse.data as AppointmentRow[];
    }
  }

  const todayDate = new Date().toISOString().split("T")[0];
  const now = new Date();

  const todayBookingsCount = appointments.filter((appointment) => {
    if (!appointment.appointment_date) return false;
    const status = (appointment.status ?? "").toLowerCase();
    return appointment.appointment_date === todayDate && status !== "cancelled";
  }).length;

  const upcomingAppointmentsRaw = appointments.filter((appointment) => {
    const dateTime = toDateTime(appointment.appointment_date, appointment.appointment_time);
    if (!dateTime) return false;
    const status = (appointment.status ?? "").toLowerCase();
    return status !== "cancelled" && dateTime.getTime() >= now.getTime();
  });

  const upcomingAppointmentsSorted = upcomingAppointmentsRaw
    .sort((a, b) => {
      const aTime = toDateTime(a.appointment_date, a.appointment_time)?.getTime() ?? 0;
      const bTime = toDateTime(b.appointment_date, b.appointment_time)?.getTime() ?? 0;
      return aTime - bTime;
    })
    .slice(0, 5);

  const upcomingAppointments = upcomingAppointmentsSorted.map((appointment) => ({
    id: appointment.id,
    customerName: appointment.client_name ?? null,
    serviceId: appointment.service_id ?? null,
    status: appointment.status ?? null,
    scheduledAt: (() => {
      const value = toDateTime(appointment.appointment_date, appointment.appointment_time);
      return value ? value.toISOString() : null;
    })(),
  }));

  const upcomingAppointmentsCount = upcomingAppointmentsRaw.length;
  const totalBookingsCount = appointments.length;
  const newBookingsCount = appointments.filter(
    (appointment) => (appointment.status ?? "").toLowerCase() === "new"
  ).length;

  const servicesSummary = services.map((service) => ({
    id: service.id,
    name: service.name ?? "",
    duration: service.duration,
    price: service.price,
    currency: service.currency,
  }));

  const serviceNameMap = new Map<string, string | null>(
    services.map((service) => [service.id, service.name ?? null])
  );

  const upcomingAppointmentsWithNames = upcomingAppointments.map((appointment) => ({
    ...appointment,
    serviceName: appointment.serviceId ? serviceNameMap.get(appointment.serviceId) ?? null : null,
  }));

  const bookingLink = business?.booking_url
    ? `https://meead.app/${business.booking_url}`
    : null;

  return (
    <DashboardClient
      userEmail={user.email ?? ""}
      businessName={business?.name ?? null}
      businessDescription={business?.description ?? null}
      bookingLink={bookingLink}
      stats={{
        today: todayBookingsCount,
        upcoming: upcomingAppointmentsCount,
        total: totalBookingsCount,
        new: newBookingsCount,
      }}
      services={servicesSummary.slice(0, 5)}
      hasMoreServices={servicesSummary.length > 5}
      upcomingAppointments={upcomingAppointmentsWithNames}
    />
  );
}

