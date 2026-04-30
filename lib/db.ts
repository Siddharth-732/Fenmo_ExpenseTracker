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
