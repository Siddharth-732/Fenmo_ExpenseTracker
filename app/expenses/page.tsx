"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Receipt, 
  AlertTriangle,
  CheckCircle2,
  Utensils,
  Home,
  Car,
  Film,
  Plane,
  ShoppingBag,
  Filter,
  Loader2
} from "lucide-react";
import { format } from "date-fns";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
}

const CATEGORIES = [
  { name: "Food & Dining", icon: Utensils, color: "bg-red-500", light: "bg-red-100", text: "text-red-600" },
  { name: "Housing", icon: Home, color: "bg-emerald-500", light: "bg-emerald-100", text: "text-emerald-600" },
  { name: "Transportation", icon: Car, color: "bg-blue-500", light: "bg-blue-100", text: "text-blue-600" },
  { name: "Entertainment", icon: Film, color: "bg-amber-500", light: "bg-amber-100", text: "text-amber-600" },
  { name: "Travel", icon: Plane, color: "bg-cyan-500", light: "bg-cyan-100", text: "text-cyan-600" },
  { name: "Shopping", icon: ShoppingBag, color: "bg-purple-500", light: "bg-purple-100", text: "text-purple-600" },
];

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [budget, setBudget] = useState<number>(0);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isBudgetSubmitting, setIsBudgetSubmitting] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    setError("");
    try {
      const [expRes, budgetRes] = await Promise.all([
        fetch("/api/expenses"),
        fetch("/api/budget")
      ]);
      
      if (!expRes.ok) throw new Error("Failed to fetch expenses");
      const data = await expRes.json();
      setExpenses(data);

      if (budgetRes.ok) {
        const budgetData = await budgetRes.json();
        setBudget(budgetData.amount || 0);
      }
    } catch (err) {
      setError("Failed to load expenses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const { filteredAndSorted, totalVisible, highestCategory } = useMemo(() => {
    let result = [...expenses];
    if (filterCategory !== "All") {
      result = result.filter(e => e.category === filterCategory);
    }
    result.sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });

    const total = result.reduce((sum, e) => sum + e.amount, 0);

    const catTotals: Record<string, number> = {};
    expenses.forEach(exp => {
      catTotals[exp.category] = (catTotals[exp.category] || 0) + exp.amount;
    });
    let highestCat = "N/A";
    let maxAmount = 0;
    Object.entries(catTotals).forEach(([cat, amount]) => {
      if (amount > maxAmount) {
        maxAmount = amount;
        highestCat = cat;
      }
    });

    return { filteredAndSorted: result, totalVisible: total, highestCategory: highestCat };
  }, [expenses, filterCategory, sortOrder]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  const handleEditExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEditSubmitting || !editingExpense) return;

    const formData = new FormData(e.currentTarget);
    const amount = formData.get("amount");
    const category = formData.get("category");
    const description = formData.get("description");
    const date = formData.get("date");

    if (!amount || !category || !description || !date) return;

    setIsEditSubmitting(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingExpense.id, amount, category, description, date }),
      });

      if (!res.ok) throw new Error("Failed to edit expense");
      
      const updatedExp = await res.json();
      setExpenses((prev) => prev.map(exp => exp.id === updatedExp.id ? updatedExp : exp));
      setEditingExpense(null);
    } catch (err) {
      alert("Failed to update expense.");
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleSetBudget = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isBudgetSubmitting) return;

    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get("budget"));
    if (isNaN(amount) || amount <= 0) return;

    setIsBudgetSubmitting(true);
    try {
      const res = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      if (!res.ok) throw new Error("Failed to save budget");
      
      setBudget(amount);
      setIsBudgetModalOpen(false);
    } catch (err) {
      alert("Failed to save budget.");
    } finally {
      setIsBudgetSubmitting(false);
    }
  };

  const budgetPercentage = budget > 0 ? Math.min((totalVisible / budget) * 100, 100) : 0;
  const isOverBudget = totalVisible >= budget && budget > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex items-end justify-between pt-4">
        <div>
          <h2 className="text-4xl font-bold text-[#1a1a2e] tracking-tight">Expenses Overview</h2>
          <p className="text-gray-500 mt-2 font-medium">Track and manage your spending across categories.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="appearance-none bg-white border border-gray-100 text-[#1a1a2e] font-semibold py-2.5 pl-4 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4338ca]/20"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
            <Filter className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="bg-white border border-gray-100 text-[#1a1a2e] font-semibold py-2.5 px-4 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4338ca]/20"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <h3 className="text-xl font-bold text-[#1a1a2e]">Current View Total</h3>
              <p className="text-gray-500 font-medium text-sm mt-1">{filterCategory === 'All' ? 'All expenses' : `Filtered by ${filterCategory}`}</p>
            </div>
            <div className="bg-[#f0f4ff] text-[#4338ca] text-xs font-bold px-3 py-1.5 rounded-full">
              {filteredAndSorted.length} Transactions
            </div>
          </div>
          <div className="flex items-end gap-4 relative z-10 justify-between">
            <div>
              <h2 className="text-5xl font-bold text-[#1a1a2e] tracking-tight">{formatCurrency(totalVisible)}</h2>
              <p className="text-gray-500 font-medium text-sm mt-2">
                Monthly Budget: <span className="font-bold text-[#1a1a2e]">{formatCurrency(budget)}</span>
              </p>
            </div>
            <button 
              onClick={() => setIsBudgetModalOpen(true)}
              className="text-sm font-bold text-[#4338ca] hover:text-[#3730a3] transition-colors bg-indigo-50 px-4 py-2 rounded-xl"
            >
              Set Budget
            </button>
          </div>
          <div className="mt-8 h-3 w-full bg-gray-100 rounded-full overflow-hidden relative z-10">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${isOverBudget ? 'bg-red-500' : 'bg-gradient-to-r from-[#4338ca] to-[#3b82f6]'}`} 
              style={{ width: `${budgetPercentage}%` }} 
            />
          </div>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 group-hover:bg-indigo-100 transition-colors duration-500" />
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-[24px] p-6 flex items-center gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">Highest Category</p>
              <p className="text-lg font-bold text-[#1a1a2e]">{highestCategory}</p>
            </div>
          </div>
          <div className="bg-white rounded-[24px] p-6 flex items-center gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">Total Entries</p>
              <p className="text-lg font-bold text-[#1a1a2e]">{expenses.length} Records</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-[#1a1a2e]">Recent Transactions</h3>
        </div>
        
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#4338ca] mb-4" />
            <p className="font-medium">Loading your expenses...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 font-medium">
            {error}
          </div>
        ) : filteredAndSorted.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 text-gray-300" />
            </div>
            <h4 className="text-lg font-bold text-[#1a1a2e] mb-1">No expenses found</h4>
            <p className="text-gray-500">Add an expense to get started with your tracking.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredAndSorted.map((expense) => {
              const catInfo = CATEGORIES.find(c => c.name === expense.category) || CATEGORIES[0];
              const Icon = catInfo.icon;
              return (
                <div key={expense.id} className="px-8 py-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors group">
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl ${catInfo.light} flex items-center justify-center ${catInfo.text}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[#1a1a2e] font-bold text-base">{expense.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold text-gray-500">{expense.category}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-sm text-gray-400">{format(new Date(expense.date), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setEditingExpense(expense)}
                      className="text-sm font-bold text-[#4338ca] transition-opacity px-3 py-1.5 rounded-lg hover:bg-indigo-50"
                    >
                      Edit
                    </button>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#1a1a2e]">{formatCurrency(expense.amount)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Expense Modal */}
      {editingExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-2xl font-bold text-[#1a1a2e]">Edit Expense</h3>
              <button 
                onClick={() => setEditingExpense(null)}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors shadow-sm"
              >
                <span className="sr-only">Close</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleEditExpense} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                  <input 
                    name="amount"
                    type="number" 
                    step="0.01"
                    min="0.01"
                    defaultValue={editingExpense.amount}
                    required
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/30 focus:border-[#4338ca] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <select 
                  name="category"
                  defaultValue={editingExpense.category}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/30 focus:border-[#4338ca] transition-all appearance-none"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <input 
                  name="description"
                  type="text" 
                  defaultValue={editingExpense.description}
                  required
                  placeholder="What was this for?"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/30 focus:border-[#4338ca] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                <input 
                  name="date"
                  type="date" 
                  defaultValue={editingExpense.date}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/30 focus:border-[#4338ca] transition-all"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isEditSubmitting}
                  className="w-full bg-[#4338ca] hover:bg-[#3730a3] disabled:bg-indigo-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 flex justify-center items-center gap-2"
                >
                  {isEditSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                  {isEditSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Set Budget Modal */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-2xl font-bold text-[#1a1a2e]">Set Monthly Budget</h3>
              <button 
                onClick={() => setIsBudgetModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors shadow-sm"
              >
                <span className="sr-only">Close</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSetBudget} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Budget Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                  <input 
                    name="budget"
                    type="number" 
                    step="1"
                    min="1"
                    defaultValue={budget || ''}
                    required
                    placeholder="e.g. 5000"
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/30 focus:border-[#4338ca] transition-all"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Set your total spending limit for the month.</p>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isBudgetSubmitting}
                  className="w-full bg-[#4338ca] hover:bg-[#3730a3] disabled:bg-indigo-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 flex justify-center items-center gap-2"
                >
                  {isBudgetSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                  {isBudgetSubmitting ? "Saving..." : "Save Budget"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
