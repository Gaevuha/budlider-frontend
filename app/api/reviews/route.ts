import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const productId = searchParams.get('productId');
  
  // TODO: Отримати відгуки з бази даних
  const reviews = [];
  
  return NextResponse.json(reviews);
}

export async function POST(request: NextRequest) {
  const review = await request.json();
  
  // TODO: Зберегти відгук у базі даних
  
  return NextResponse.json({ success: true, id: Date.now().toString() }, { status: 201 });
}
