import { NextResponse } from 'next/server';
import { getBudget, saveBudget } from '@/lib/db';

export async function GET() {
  try {
    const budget = getBudget();
    return NextResponse.json({ amount: budget });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch budget' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount } = body;
    
    if (amount === undefined || isNaN(amount) || amount < 0) {
      return NextResponse.json({ error: 'Invalid budget amount' }, { status: 400 });
    }

    saveBudget(Number(amount));
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json({ amount: Number(amount) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save budget' }, { status: 500 });
  }
}
