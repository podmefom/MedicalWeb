import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createAppointmentSchema } from '@/lib/validation';
import { z } from 'zod';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const doctorId = url.searchParams.get('doctorId');
    const status = url.searchParams.get('status');

    const appointments = await prisma.appointment.findMany({
      where: {
        ...(doctorId && { doctorId }),
        ...(status && { status }),
      },
      include: {
        doctor: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('APPOINTMENTS_GET_ERROR:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении записей' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Валидация через Zod
    const validated = createAppointmentSchema.parse(body);

    // Проверяем что врач существует
    const doctor = await prisma.doctor.findUnique({
      where: { id: validated.doctorId },
    });

    if (!doctor) {
      return NextResponse.json(
        { error: 'Врач не найден' },
        { status: 404 }
      );
    }

    // Соединяем дату и время в один объект Date
    const appointmentDate = new Date(`${validated.date}T${validated.slot}:00`);

    // Проверяем что дата в будущем
    if (appointmentDate <= new Date()) {
      return NextResponse.json(
        { error: 'Дата записи должна быть в будущем' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientName: validated.patientName,
        patientPhone: validated.patientPhone,
        patientEmail: validated.patientEmail,
        date: appointmentDate,
        doctorId: validated.doctorId,
        status: 'PENDING',
      } as any,
      include: {
        doctor: true,
      },
    });

    return NextResponse.json(
      { success: true, appointment },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Ошибка валидации',
          details: error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error('APPOINTMENTS_POST_ERROR:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании записи' },
      { status: 500 }
    );
  }
}