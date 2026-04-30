export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  createdAt: string;
}

const isClient = typeof window !== 'undefined';

export const getExpenses = async (): Promise<Expense[]> => {
  if (!isClient) return [];
  const data = localStorage.getItem('expenses');
  return data ? JSON.parse(data) : [];
};

export const saveExpense = async (expense: Omit<Expense, 'id' | 'created_at'>): Promise<Expense> => {
  if (!isClient) throw new Error("Not client");
  const expenses = await getExpenses();
  const newExpense = {
    ...expense,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString()
  };
  expenses.push(newExpense);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  return newExpense;
};

export const updateExpense = async (id: string, updatedData: Partial<Expense>): Promise<Expense> => {
  if (!isClient) throw new Error("Not client");
  const expenses = await getExpenses();
  const index = expenses.findIndex(e => e.id === id);
  if (index === -1) throw new Error("Not found");
  
  expenses[index] = { ...expenses[index], ...updatedData };
  localStorage.setItem('expenses', JSON.stringify(expenses));
  return expenses[index];
};

export const getBudget = async (): Promise<number> => {
  if (!isClient) return 1000;
  const data = localStorage.getItem('budget');
  return data ? Number(data) : 1000;
};

export const saveBudget = async (amount: number): Promise<void> => {
  if (!isClient) return;
  localStorage.setItem('budget', amount.toString());
};

export const getGoals = async (): Promise<Goal[]> => {
  if (!isClient) return [];
  const data = localStorage.getItem('goals');
  return data ? JSON.parse(data) : [];
};

export const saveGoal = async (goal: Omit<Goal, 'id' | 'currentAmount' | 'createdAt'>): Promise<Goal> => {
  if (!isClient) throw new Error("Not client");
  const goals = await getGoals();
  const newGoal = {
    ...goal,
    id: crypto.randomUUID(),
    currentAmount: 0,
    createdAt: new Date().toISOString()
  };
  goals.push(newGoal);
  localStorage.setItem('goals', JSON.stringify(goals));
  return newGoal;
};

export const updateGoalAmount = async (id: string, newAmount: number): Promise<Goal> => {
  if (!isClient) throw new Error("Not client");
  const goals = await getGoals();
  const index = goals.findIndex(g => g.id === id);
  if (index === -1) throw new Error("Not found");
  
  goals[index].currentAmount = Math.max(0, newAmount);
  localStorage.setItem('goals', JSON.stringify(goals));
  return goals[index];
};
