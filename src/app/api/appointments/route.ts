import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: { doctor: true }, // Сразу подтягиваем инфо о враче
      orderBy: { date: 'asc' }
    });
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: 'DB_FETCH_ERROR' }, { status: 500 });
  }
}