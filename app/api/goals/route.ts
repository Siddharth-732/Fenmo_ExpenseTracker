import { NextResponse } from 'next/server';
import { getGoals, saveGoal, updateGoalAmount } from '@/lib/db';

export async function GET() {
  try {
    const goals = getGoals();
    return NextResponse.json(goals);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, targetAmount } = body;
    
    if (!title || typeof targetAmount !== 'number' || targetAmount <= 0) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const newGoal = {
      id: crypto.randomUUID(),
      title,
      targetAmount,
      currentAmount: 0,
      createdAt: new Date().toISOString()
    };
    
    saveGoal(newGoal);
    return NextResponse.json(newGoal, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, currentAmount } = body;
    
    if (!id || typeof currentAmount !== 'number') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const updatedGoal = updateGoalAmount(id, currentAmount);
    if (!updatedGoal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    return NextResponse.json(updatedGoal, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 });
  }
}
