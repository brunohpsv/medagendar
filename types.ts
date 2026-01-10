
export interface DaySchedule {
  date: string;
  label: string;
  slots: string[];
}

export interface WorkConfig {
  daysOfWeek: number[]; // 0-6
  startTime: string;
  endTime: string;
  slotDuration: number; // em minutos
  breaks: {
    lunch: { start: string; end: string; active: boolean };
    dinner: { start: string; end: string; active: boolean };
  };
}

export interface Doctor {
  id: string;
  name: string;
  specialties: string[]; // Mudado para array
  rating: number;
  reviews: number;
  location: string;
  clinicAddress: string;
  image: string;
  bio: string;
  fullBio: string;
  price: number;
  priceType: 'fixed' | 'combined' | 'clinic';
  acceptsOnline: boolean;
  education: string[];
  schedule: DaySchedule[];
  workConfig: WorkConfig;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  patientName: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export type ViewState = 'home' | 'professional_signup' | 'professional_dashboard' | 'admin_dashboard';
