export interface Appointment {
  id: string;
  business_id: string;
  service_id: string;
  client_name: string;
  client_email: string;
  client_phone?: string | null;
  appointment_date: string;
  appointment_time: string;
  status: "new" | "confirmed" | "cancelled" | "completed";
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type AppointmentInput = Omit<Appointment, "id" | "created_at" | "updated_at">;
