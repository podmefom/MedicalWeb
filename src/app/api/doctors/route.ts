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
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        user: {
          name: 'asc',
        },
      },
    });

    // Transform to flatten the user data
    const formattedDoctors = doctors.map((doctor) => ({
      id: doctor.id,
      name: doctor.user.name,
      email: doctor.user.email,
      phone: doctor.user.phone,
      specialty: doctor.specialty,
      experience: doctor.experience,
      bio: doctor.bio,
      image: doctor.image,
    }));

    return NextResponse.json(formattedDoctors);
  } catch (error) {
    console.error('DOCTORS_GET_ERROR:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении списка врачей' },
      { status: 500 }
    );
  }
}
