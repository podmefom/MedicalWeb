import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { doctorId, patientName, date, slot, phone } = body;

    // Валидация данных на сервере (security first)
    if (!doctorId || !patientName || !date || !slot || !phone) {
      return NextResponse.json({ error: 'MISSING_REQUIRED_FIELDS' }, { status: 400 });
    }

    // Создаем запись в базе данных через Prisma
    const appointment = await prisma.appointment.create({
      data: {
        patient: patientName,
        date: new Date(`${date}T${slot}:00`),
        doctorId: doctorId,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, appointmentId: appointment.id }, { status: 201 });
  } catch (error) {
    console.error('DATABASE_ERROR:', error);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}