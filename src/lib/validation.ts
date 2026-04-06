import { z } from 'zod';

export const createAppointmentSchema = z.object({
  doctorId: z.string().min(1, 'ID врача обязателен'),
  patientName: z
    .string()
    .min(3, 'Имя должно быть минимум 3 символа')
    .max(100, 'Имя не может быть более 100 символов'),
  patientPhone: z
    .string()
    .min(10, 'Номер телефона слишком короткий')
    .regex(/[0-9]/, 'Номер телефона ненормален'),
  patientEmail: z.string().email('Неверный формат email').optional().or(z.literal('')),
  date: z
    .string()
    .refine(
      d => {
        try {
          const date = new Date(d);
          return date > new Date();
        } catch {
          return false;
        }
      },
      'Дата не может быть в прошлом'
    ),
  slot: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Слот должен быть в формате НН:МM'),
});

export const getDoctorSchema = z.object({
  id: z.string().min(1, 'ID врача обязателен'),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type GetDoctorInput = z.infer<typeof getDoctorSchema>;
