import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const apartments = await prisma.apartment.findMany({
      include: {
        residents: true
      }
    });
    return NextResponse.json(apartments);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Daireler yüklenirken hata oluştu' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Veri doğrulama
    if (!data.number || !data.floor || !data.size) {
      return new Response(
        JSON.stringify({
          error: 'Validation Error',
          details: 'Daire numarası, kat ve büyüklük zorunludur'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Veri dönüşümü
    const apartmentData = {
      number: String(data.number),
      floor: String(data.floor),
      size: Number(data.size),
      status: data.status || 'vacant',
      paid: false
    };

    // Veri doğrulama - sayısal değerler
    if (isNaN(apartmentData.size)) {
      return new Response(
        JSON.stringify({
          error: 'Validation Error',
          details: 'Daire büyüklüğü geçerli bir sayı olmalıdır'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const apartment = await prisma.apartment.create({
      data: apartmentData
    });

    return new Response(
      JSON.stringify(apartment),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('POST error:', error);
    return new Response(
      JSON.stringify({
        error: 'Server Error',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 