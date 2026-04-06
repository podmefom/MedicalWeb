import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const { id: appointmentId } = await params;
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Запись не найдена' },
        { status: 404 }
      );
    }

    // Проверяем права: пациент может удалить только свою запись, админ может все
    const userRole = token.role as string;
    if (userRole === 'PATIENT' && appointment.patientId !== token.id) {
      return NextResponse.json(
        { error: 'Нет прав для удаления' },
        { status: 403 }
      );
    }

    // Удаляем запись
    await prisma.appointment.delete({
      where: { id: appointmentId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('APPOINTMENT_DELETE_ERROR:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении записи' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    // Только админ может обновлять статус
    const userRole = token.role as string;
    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Нет прав для обновления' },
        { status: 403 }
      );
    }

    const { id: appointmentId } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Статус обязателен' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
        patient: true,
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('APPOINTMENT_PATCH_ERROR:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении записи' },
      { status: 500 }
    );
  }
}
