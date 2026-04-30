"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  LayoutDashboard, 
  Receipt, 
  Wallet, 
  Target, 
  Settings, 
  Plus, 
  Search, 
  Bell, 
  Moon, 
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Utensils,
  Home,
  Car,
  Film,
  Plane,
  ShoppingBag,
  Filter,
  X,
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

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleAddExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(e.currentTarget);
    const amount = formData.get("amount");
    const category = formData.get("category");
    const description = formData.get("description");
    const date = formData.get("date");

    if (!amount || !category || !description || !date) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, category, description, date }),
      });

      if (!res.ok) throw new Error("Failed to add expense");
      
      const newExp = await res.json();
      setExpenses((prev) => [...prev, newExp]);
      setIsAddModalOpen(false);
    } catch (err) {
      alert("Failed to save expense. It might be a network issue.");
    } finally {
      setIsSubmitting(false);
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
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  // UI Components
  const Sidebar = () => (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-10 hidden md:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4338ca] to-[#3b82f6] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
          W
        </div>
        <div>
          <h1 className="font-bold text-xl text-[#1a1a2e] tracking-tight">WealthGlass</h1>
          <p className="text-xs text-gray-500 font-medium">Premium Finance</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {[
          { name: "Dashboard", icon: LayoutDashboard },
          { name: "Expenses", icon: Receipt, active: true },
          { name: "Budgets", icon: Wallet },
          { name: "Goals", icon: Target },
          { name: "Settings", icon: Settings },
        ].map((item) => (
          <a
            key={item.name}
            href="#"
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-medium transition-all duration-200 ${
              item.active
                ? "bg-[#f0f4ff] text-[#4338ca]"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </a>
        ))}
      </nav>

      <div className="p-4">
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="w-full bg-[#4338ca] hover:bg-[#3730a3] text-white flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold transition-all duration-200 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Quick Add Expense
        </button>
      </div>
    </aside>
  );

  const Topbar = () => (
    <header className="h-20 bg-transparent flex items-center justify-between px-8 z-0">
      <div className="relative w-96">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search expenses..."
          className="w-full pl-12 pr-4 py-3 bg-white rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#4338ca]/20 shadow-sm border border-transparent transition-all placeholder:text-gray-400"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2.5 text-gray-500 hover:text-gray-900 bg-white rounded-full shadow-sm transition-colors hover:shadow">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2.5 text-gray-500 hover:text-gray-900 bg-white rounded-full shadow-sm transition-colors hover:shadow">
          <Moon className="w-5 h-5" />
        </button>
        <button className="p-2.5 text-gray-500 hover:text-gray-900 bg-white rounded-full shadow-sm transition-colors hover:shadow">
          <HelpCircle className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-500 ml-2 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold">
          JD
        </div>
      </div>
    </header>
  );

  return (
    <div className="flex h-full w-full bg-[#f4f7fe]">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 flex flex-col h-full overflow-hidden relative">
        {/* Abstract Background Gradient similar to design */}
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-br from-[#eef2ff] via-[#f0f4ff] to-[#f4f7fe] -z-10" />
        
        <Topbar />

        <div className="flex-1 overflow-auto px-8 pb-12">
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
                {/* Decorative blob */}
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
        </div>
      </main>

      {/* Add Expense Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-2xl font-bold text-[#1a1a2e]">New Expense</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddExpense} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                  <input 
                    name="amount"
                    type="number" 
                    step="0.01"
                    min="0.01"
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
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/30 focus:border-[#4338ca] transition-all"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#4338ca] hover:bg-[#3730a3] disabled:bg-indigo-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 flex justify-center items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                  {isSubmitting ? "Saving..." : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
