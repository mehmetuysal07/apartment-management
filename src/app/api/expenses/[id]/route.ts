import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Masrafın var olup olmadığını kontrol et
    const expense = await prisma.expense.findUnique({
      where: { id }
    });

    if (!expense) {
      return new Response(
        JSON.stringify({
          error: 'Not Found',
          details: 'Masraf bulunamadı'
        }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Masrafı sil
    await prisma.expense.delete({
      where: { id }
    });

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('DELETE error:', error);
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