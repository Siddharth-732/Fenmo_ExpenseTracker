"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  ArrowUpRight, 
  Flame, 
  Star, 
  Trophy, 
  Target, 
  Building2, 
  ArrowRight,
  ShoppingCart,
  Zap,
  Car,
  Briefcase,
  Utensils,
  Home,
  Film,
  Plane,
  ShoppingBag,
  Loader2,
  Receipt
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

const CATEGORY_MAP: Record<string, { icon: React.ElementType, color: string }> = {
  "Food & Dining": { icon: Utensils, color: "#4ade80" },
  "Housing": { icon: Home, color: "#4338ca" },
  "Transportation": { icon: Car, color: "#8b4513" },
  "Entertainment": { icon: Film, color: "#f59e0b" },
  "Travel": { icon: Plane, color: "#06b6d4" },
  "Shopping": { icon: ShoppingBag, color: "#a855f7" }
};

export default function FinancialOverview() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch("/api/expenses");
        if (res.ok) {
          const data = await res.json();
          setExpenses(data);
        }
      } catch (error) {
        console.error("Failed to fetch expenses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const { filteredTotal, filteredCount } = useMemo(() => {
    let t = 0;
    let count = 0;
    
    expenses.forEach(exp => {
      let include = true;
      const expDate = new Date(exp.date);
      expDate.setHours(0,0,0,0);
      
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0,0,0,0);
        if (expDate < start) include = false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(0,0,0,0);
        if (expDate > end) include = false;
      }
      
      if (include) {
        t += exp.amount;
        count += 1;
      }
    });
    return { filteredTotal: t, filteredCount: count };
  }, [expenses, startDate, endDate]);

  const { total, categoryTotals, topCategory, recentTx, trend, maxTrend, xLabels } = useMemo(() => {
    let t = 0;
    const catTotals: Record<string, number> = {};
    
    // Sort descending by date
    const sorted = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    sorted.forEach(exp => {
      t += exp.amount;
      catTotals[exp.category] = (catTotals[exp.category] || 0) + exp.amount;
    });

    let topCat = { name: "N/A", amount: 0, percentage: 0 };
    Object.entries(catTotals).forEach(([cat, amount]) => {
      if (amount > topCat.amount) {
        topCat = { name: cat, amount, percentage: t > 0 ? (amount / t) * 100 : 0 };
      }
    });

    const trend = Array(30).fill(0);
    const today = new Date();
    today.setHours(0,0,0,0);
    
    expenses.forEach(exp => {
      const expDate = new Date(exp.date);
      expDate.setHours(0,0,0,0);
      const diffTime = today.getTime() - expDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
      if (diffDays >= 0 && diffDays < 30) {
        trend[29 - diffDays] += exp.amount;
      }
    });
    
    const maxTrend = Math.max(...trend, 1);
    const normalizedTrend = trend.map(val => (val / maxTrend) * 100);

    const xLabels = [];
    for (let i = 0; i < 30; i += 7) {
      const d = new Date(today);
      d.setDate(d.getDate() - (29 - i));
      xLabels.push({ index: i, label: format(d, 'MMM d') });
    }
    if (xLabels[xLabels.length - 1].index !== 29) {
      xLabels.push({ index: 29, label: format(today, 'MMM d') });
    }

    return { total: t, categoryTotals: catTotals, topCategory: topCat, recentTx: sorted.slice(0, 5), trend: normalizedTrend, maxTrend, xLabels };
  }, [expenses]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center pt-32">
        <Loader2 className="w-8 h-8 animate-spin text-[#4338ca]" />
      </div>
    );
  }

  // Calculate SVGs for donut chart
  let currentOffset = 0;
  const circumference = 251.2; // 2 * pi * 40

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-[#1a1a2e] tracking-tight">Financial Overview</h2>
        <p className="text-gray-500 mt-2 font-medium">Here is your spending summary based on your logged expenses.</p>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Expenses */}
        <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase">Total Expenses</h3>
              <div className="flex items-center gap-2">
                <input 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-xs font-bold text-[#4338ca] bg-indigo-50 border-none rounded-lg py-1 px-2 focus:ring-0 cursor-pointer outline-none hover:bg-indigo-100 transition-colors"
                />
                <span className="text-xs font-bold text-gray-400">to</span>
                <input 
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-xs font-bold text-[#4338ca] bg-indigo-50 border-none rounded-lg py-1 px-2 focus:ring-0 cursor-pointer outline-none hover:bg-indigo-100 transition-colors"
                />
              </div>
            </div>
            <div className="flex items-start justify-between mt-2">
              <h2 className="text-4xl font-bold text-[#1a1a2e] tracking-tight">{formatCurrency(filteredTotal)}</h2>
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <span className="bg-gray-50 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              {filteredCount} Records
            </span>
          </div>
        </div>

        {/* Savings Streak */}
        <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Top Category</h3>
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-bold text-[#1a1a2e] tracking-tight">{topCategory.name}</h2>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-[#4338ca] shadow-sm">
              <Trophy className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-6 flex justify-between items-center gap-2">
            <div className="flex flex-col items-start gap-1">
              <span className="text-lg font-bold text-[#1a1a2e]">{formatCurrency(topCategory.amount)}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{Math.round(topCategory.percentage)}% of total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Monthly Spending Trend */}
        <div className="md:col-span-2 bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-[#1a1a2e]">Monthly Spending Trend</h3>
            <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">Last 30 Days</span>
          </div>
          
          <div className="h-64 relative pl-12 pb-6 mt-4">
            {/* Y-Axis Labels */}
            <div className="absolute left-0 top-0 bottom-6 w-10 flex flex-col justify-between text-[10px] font-bold text-gray-400 text-right pr-2">
              <span>{formatCurrency(maxTrend).split('.')[0]}</span>
              <span>{formatCurrency(maxTrend / 2).split('.')[0]}</span>
              <span>₹0</span>
            </div>
            
            <div className="absolute inset-0 left-12 bottom-6 flex flex-col justify-between pointer-events-none">
              <div className="w-full h-px bg-gray-100"></div>
              <div className="w-full h-px bg-gray-100"></div>
              <div className="w-full h-px bg-gray-100"></div>
            </div>
            
            <div className="relative w-full h-full">
              <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible z-10" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4338ca" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#4338ca" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline 
                  points={trend.map((h, i) => `${(i / 29) * 300},${100 - h}`).join(' ')} 
                  fill="none" 
                  stroke="#4338ca" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <polygon 
                  points={`0,100 ${trend.map((h, i) => `${(i / 29) * 300},${100 - h}`).join(' ')} 300,100`} 
                  fill="url(#trendGradient)" 
                />
              </svg>
            </div>

            {/* X-Axis Labels */}
            <div className="absolute left-12 right-0 bottom-0 h-4 mt-2">
              {xLabels.map((xl) => (
                <span 
                  key={xl.index} 
                  className="absolute text-[10px] font-bold text-gray-400 -translate-x-1/2 whitespace-nowrap"
                  style={{ left: `${(xl.index / 29) * 100}%` }}
                >
                  {xl.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h3 className="text-lg font-bold text-[#1a1a2e] mb-6">Category Distribution</h3>
          
          {total === 0 ? (
            <div className="text-center text-gray-400 py-12">No data yet</div>
          ) : (
            <>
              <div className="relative w-40 h-40 mx-auto mb-8">
                <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f3f4f6" strokeWidth="12" />
                  {Object.entries(categoryTotals).map(([cat, amount], idx) => {
                    const percentage = amount / total;
                    const dashArray = circumference;
                    const dashOffset = circumference - (percentage * circumference);
                    const rotation = (currentOffset / total) * 360;
                    currentOffset += amount;
                    
                    return (
                      <circle 
                        key={cat}
                        cx="50" cy="50" r="40" 
                        fill="transparent" 
                        stroke={CATEGORY_MAP[cat]?.color || "#4338ca"} 
                        strokeWidth="12" 
                        strokeDasharray={dashArray} 
                        strokeDashoffset={dashOffset} 
                        className="origin-center"
                        style={{ transform: `rotate(${rotation}deg)` }}
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Top Exp</span>
                  <span className="text-sm font-bold text-[#1a1a2e]">{topCategory.name === "Food & Dining" ? "Food" : topCategory.name}</span>
                </div>
              </div>

              <div className="space-y-3 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                {Object.entries(categoryTotals)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, amount]) => (
                  <div key={cat} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2 font-semibold text-[#1a1a2e] truncate max-w-[120px]">
                      <span className="w-2.5 h-2.5 rounded-full min-w-[10px]" style={{ backgroundColor: CATEGORY_MAP[cat]?.color || "#4338ca" }}></span> {cat}
                    </div>
                    <span className="text-gray-500 font-medium">{Math.round((amount / total) * 100)}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-[#1a1a2e]">Recent Transactions</h3>
          <a href="/expenses" className="text-sm font-bold text-[#4338ca] hover:text-[#3730a3]">View All</a>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-8 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase">Merchant</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase">Category</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase">Date</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase text-right">Amount</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 tracking-wider uppercase text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentTx.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-8 text-center text-gray-400">No recent transactions. Add an expense!</td>
                </tr>
              ) : recentTx.map((tx) => {
                const Icon = CATEGORY_MAP[tx.category]?.icon || Receipt;
                return (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-[#1a1a2e]">{tx.description}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-gray-500 font-medium">{tx.category}</td>
                    <td className="px-8 py-5 text-gray-500 font-medium">{format(new Date(tx.date), "MMM d, yyyy")}</td>
                    <td className="px-8 py-5 font-bold text-right text-[#1a1a2e]">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
                        Complete
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
