import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const specialty = url.searchParams.get('specialty');

    const doctors = await prisma.doctor.findMany({
      where: {
        ...(specialty && { specialty }),
      },
      select: {
        id: true,
        name: true,
        specialty: true,
        experience: true,
        bio: true,
        image: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(doctors);
  } catch (error) {
    console.error('DOCTORS_GET_ERROR:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении списка врачей' },
      { status: 500 }
    );
  }
}
