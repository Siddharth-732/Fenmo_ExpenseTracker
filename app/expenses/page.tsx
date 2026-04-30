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

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/expenses");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      setError("Failed to load expenses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...expenses];
    if (filterCategory !== "All") {
      result = result.filter(e => e.category === filterCategory);
    }
    result.sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });
    return result;
  }, [expenses, filterCategory, sortOrder]);

  const totalVisible = filteredAndSorted.reduce((sum, e) => sum + e.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

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
          <div className="flex items-end gap-4 relative z-10">
            <h2 className="text-5xl font-bold text-[#1a1a2e] tracking-tight">{formatCurrency(totalVisible)}</h2>
          </div>
          <div className="mt-8 h-3 w-full bg-gray-100 rounded-full overflow-hidden relative z-10">
            <div className="h-full bg-gradient-to-r from-[#4338ca] to-[#3b82f6] w-[70%] rounded-full" />
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
              <p className="text-lg font-bold text-[#1a1a2e]">Housing</p>
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
                <div key={expense.id} className="px-8 py-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
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
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#1a1a2e]">{formatCurrency(expense.amount)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
