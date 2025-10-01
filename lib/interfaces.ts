// types/interfaces.ts
export interface TimeSlot {
  start: string; // "09:00"
  end: string; // "17:00"
}

export interface DaySchedule {
  isOpen: boolean;
  slots: TimeSlot[];
}

export interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number; // minutes
  price: number;
  currency: string;
  category?: string;
}

export interface Business {
  id: string;
  name: string;
  business_type: string;
  booking_url: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  user_id?: string; // owner user id
  services?: Service[];
}

export interface BookingConfirmation {
  method: "automatic" | "manual";
  notifications: Array<"email" | "sms" | "whatsapp">;
}

export interface BusinessSetupData {
  businessType: string;
  services: Service[];
  workingHours: WorkingHours;
  bookingConfirmation: BookingConfirmation;
  bookingUrl: string;
}
