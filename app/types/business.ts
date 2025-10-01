export interface TimeSlot {
  start: string;
  end: string;
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
  duration: number;
  price: number;
  currency: string;
  category?: string;
}

export interface BookingConfirmation {
  method: 'automatic' | 'manual';
  notifications: string[];
}

export interface BusinessSetupData {
  businessType: string;
  services: Service[];
  workingHours: WorkingHours;
  bookingConfirmation: BookingConfirmation;
  bookingUrl: string;
}

export interface Appointment {
  id: string;
  businessId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'new' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
}