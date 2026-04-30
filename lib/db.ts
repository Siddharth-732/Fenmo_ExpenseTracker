import fs from 'fs';
import path from 'path';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
}

const dbFilePath = path.join(process.cwd(), 'expenses.json');

// Initialize the file if it doesn't exist
if (!fs.existsSync(dbFilePath)) {
  fs.writeFileSync(dbFilePath, JSON.stringify([]));
}

export const getExpenses = (): Expense[] => {
  try {
    const data = fs.readFileSync(dbFilePath, 'utf-8');
    return JSON.parse(data) as Expense[];
  } catch (error) {
    console.error("Error reading database", error);
    return [];
  }
};

export const saveExpense = (expense: Expense): void => {
  const expenses = getExpenses();
  expenses.push(expense);
  fs.writeFileSync(dbFilePath, JSON.stringify(expenses, null, 2));
};

export const updateExpense = (id: string, updatedData: Partial<Expense>): Expense | null => {
  const expenses = getExpenses();
  const index = expenses.findIndex(e => e.id === id);
  if (index !== -1) {
    expenses[index] = { ...expenses[index], ...updatedData };
    fs.writeFileSync(dbFilePath, JSON.stringify(expenses, null, 2));
    return expenses[index];
  }
  return null;
};

const budgetFilePath = path.join(process.cwd(), 'budget.json');

if (!fs.existsSync(budgetFilePath)) {
  fs.writeFileSync(budgetFilePath, JSON.stringify({ amount: 1000 }));
}

export const getBudget = (): number => {
  try {
    const data = fs.readFileSync(budgetFilePath, 'utf-8');
    return JSON.parse(data).amount || 0;
  } catch (error) {
    return 1000;
  }
};

export const saveBudget = (amount: number): void => {
  fs.writeFileSync(budgetFilePath, JSON.stringify({ amount }, null, 2));
};

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  createdAt: string;
}

const goalsFilePath = path.join(process.cwd(), 'goals.json');

if (!fs.existsSync(goalsFilePath)) {
  fs.writeFileSync(goalsFilePath, JSON.stringify([]));
}

export const getGoals = (): Goal[] => {
  try {
    const data = fs.readFileSync(goalsFilePath, 'utf-8');
    return JSON.parse(data) as Goal[];
  } catch (error) {
    return [];
  }
};

export const saveGoal = (goal: Goal): void => {
  const goals = getGoals();
  goals.push(goal);
  fs.writeFileSync(goalsFilePath, JSON.stringify(goals, null, 2));
};

export const updateGoalAmount = (id: string, newAmount: number): Goal | null => {
  const goals = getGoals();
  const index = goals.findIndex(g => g.id === id);
  if (index !== -1) {
    goals[index].currentAmount = Math.max(0, newAmount);
    fs.writeFileSync(goalsFilePath, JSON.stringify(goals, null, 2));
    return goals[index];
  }
  return null;
};
