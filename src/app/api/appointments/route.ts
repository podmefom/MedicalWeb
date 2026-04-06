import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';
import { createAppointmentSchema } from '@/lib/validation';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const doctorId = url.searchParams.get('doctorId');
    const status = url.searchParams.get('status');
    const userId = token.id as string;
    const userRole = token.role as string;

    // Получаем записи в зависимости от роли пользователя
    let whereClause: any = {};

    if (userRole === 'PATIENT') {
      // Пациенты видят только свои записи
      whereClause.patientId = userId;
    } else if (userRole === 'DOCTOR') {
      // Врачи видят записи к ним
      const doctor = await prisma.doctor.findFirst({
        where: { userId },
      });
      if (doctor) {
        whereClause.doctorId = doctor.id;
      }
    }
    // ADMIN видит все записи

    if (doctorId) whereClause.doctorId = doctorId;
    if (status) whereClause.status = status;

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
        patient: true,
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

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

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
        patientId: token.id as string,
        patientPhone: validated.patientPhone,
        patientEmail: validated.patientEmail,
        date: appointmentDate,
        doctorId: validated.doctorId,
        status: 'PENDING',
      },
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
        patient: true,
      },
    });

    return NextResponse.json(
      { success: true, appointment },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('VALIDATION_ERROR:', error.issues);
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
      { error: 'Ошибка при создании записи', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}