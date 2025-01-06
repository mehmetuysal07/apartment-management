import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const now = new Date();

    // Önce mevcut daireyi bul
    const currentApartment = await prisma.apartment.findUnique({
      where: { id }
    });

    if (!currentApartment) {
      return new Response(
        JSON.stringify({
          error: 'Not Found',
          details: 'Daire bulunamadı'
        }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Ödeme durumunu tersine çevir
    const apartment = await prisma.apartment.update({
      where: { id },
      data: {
        paid: !currentApartment.paid,
        paymentDate: !currentApartment.paid ? now.toLocaleDateString('tr-TR') : null,
        paymentMonth: !currentApartment.paid ? now.getMonth() + 1 : null,
        paymentYear: !currentApartment.paid ? now.getFullYear() : null
      }
    });

    return new Response(
      JSON.stringify(apartment),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('PUT error:', error);
    return new Response(
      JSON.stringify({
        error: 'Server Error',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 