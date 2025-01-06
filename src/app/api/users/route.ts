import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import * as bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, password, name, role } = await request.json();

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        role
      }
    });

    return new Response(
      JSON.stringify({
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('User creation error:', error);
    return new Response(
      JSON.stringify({ error: 'Kullanıcı oluşturulurken bir hata oluştu' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 