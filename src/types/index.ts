export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  bio: string;
  image?: string;
};

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export type Appointment = {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  date: Date;
  doctorId: string;
  doctor?: Doctor;
  status: AppointmentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateAppointmentInput = {
  doctorId: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  date: string;
  slot: string;
  status?: AppointmentStatus;
  notes?: string;
};
