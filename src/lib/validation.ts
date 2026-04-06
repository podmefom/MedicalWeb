import { z } from 'zod';

export const createAppointmentSchema = z.object({
  doctorId: z.string().cuid('Неверный ID врача'),
  patientName: z
    .string()
    .min(3, 'Имя должно быть минимум 3 символа')
    .max(100, 'Имя не может быть более 100 символов'),
  patientPhone: z
    .string()
    .regex(/^\+?[0-9]{10,}$/, 'Номер телефона должен содержать минимум 10 цифр')
    .transform(v => v.replace(/\D/g, '').slice(-10)),
  patientEmail: z.string().email('Неверный формат email').optional().or(z.literal('')),
  date: z
    .string()
    .refine(
      d => {
        const date = new Date(d);
        return date > new Date();
      },
      'Дата не может быть в прошлом'
    ),
  slot: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Слот должен быть в формате НН:МM')
    .refine(
      slot => {
        const [hours, minutes] = slot.split(':').map(Number);
        return hours >= 9 && hours <= 17 && minutes === 0;
      },
      'Слот может быть только в рабочее время (09:00 - 17:00)'
    ),
});

export const getDoctorSchema = z.object({
  id: z.string().cuid('Неверный ID врача'),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type GetDoctorInput = z.infer<typeof getDoctorSchema>;
