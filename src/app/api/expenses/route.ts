import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: {
        date: 'desc'
      }
    });
    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json({ error: 'Masraflar yüklenirken hata oluştu' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const date = new Date(data.date);
    
    const expense = await prisma.expense.create({
      data: {
        name: data.name,
        amount: data.amount,
        date: data.date,
        category: data.category,
        description: data.description,
        month: date.getMonth() + 1,
        year: date.getFullYear()
      }
    });

    return NextResponse.json(expense);
  } catch (error) {
    return NextResponse.json({ error: 'Masraf eklenirken hata oluştu' }, { status: 500 });
  }
} 