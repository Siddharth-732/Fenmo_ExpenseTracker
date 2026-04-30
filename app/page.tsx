"use client";

import React from "react";
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
  Briefcase
} from "lucide-react";

export default function FinancialOverview() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-[#1a1a2e] tracking-tight">Financial Overview</h2>
        <p className="text-gray-500 mt-2 font-medium">Here is your spending summary for October 2023.</p>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Expenses */}
        <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Total Expenses</h3>
            <div className="flex items-start justify-between">
              <h2 className="text-4xl font-bold text-[#1a1a2e] tracking-tight">$4,250.00</h2>
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <span className="bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> 12%
            </span>
            <span className="text-gray-400 text-sm font-medium">vs last month</span>
          </div>
        </div>

        {/* Savings Streak */}
        <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Savings Streak</h3>
              <div className="flex items-baseline gap-2">
                <h2 className="text-4xl font-bold text-emerald-500 tracking-tight">14</h2>
                <span className="text-gray-400 font-bold text-lg">Days</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 shadow-sm shadow-emerald-200">
              <Flame className="w-6 h-6 fill-current" />
            </div>
          </div>
          <div className="mt-6 flex justify-between items-center gap-2">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#4338ca] text-white flex items-center justify-center shadow-md">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Under Budget</span>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-50">
              <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">30 Day Streak</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md">
                <Target className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Goal Met</span>
            </div>
          </div>
        </div>

        {/* Transfer Funds */}
        <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-6">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">Transfer Funds</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">Move money between accounts instantly.</p>
          </div>
          <button className="mt-6 text-[#4338ca] font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
            Initialize Transfer <ArrowRight className="w-4 h-4" />
          </button>
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
          
          <div className="h-48 flex items-end justify-between gap-4 relative">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="w-full h-px bg-gray-100"></div>
              <div className="w-full h-px bg-gray-100"></div>
              <div className="w-full h-px bg-gray-100"></div>
            </div>
            
            {/* Mock Bars */}
            {[40, 60, 30, 85, 45, 65, 90].map((height, i) => (
              <div key={i} className="w-full flex justify-center group relative z-10">
                <div 
                  className={`w-full max-w-[40px] rounded-t-sm transition-all duration-300 group-hover:opacity-80 ${i === 6 ? 'bg-red-200 border-t-2 border-red-500' : 'bg-indigo-200'}`}
                  style={{ height: `${height}%` }}
                >
                  {i === 3 && <div className="absolute top-0 left-0 w-full border-t-2 border-indigo-500"></div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h3 className="text-lg font-bold text-[#1a1a2e] mb-6">Category Distribution</h3>
          
          <div className="relative w-40 h-40 mx-auto mb-8">
            {/* Mock Donut Chart with SVG */}
            <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f3f4f6" strokeWidth="12" />
              {/* Transportation (Brown) 15% */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8b4513" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="213.52" />
              {/* Food & Dining (Mint) 25% */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#4ade80" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="150.72" className="transform origin-center rotate-[54deg]" />
              {/* Housing (Blue) 45% */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#4338ca" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="138.16" className="transform origin-center rotate-[144deg]" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Top Exp</span>
              <span className="text-sm font-bold text-[#1a1a2e]">Housing</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 font-semibold text-[#1a1a2e]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4338ca]"></span> Housing
              </div>
              <span className="text-gray-500 font-medium">45%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 font-semibold text-[#1a1a2e]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80]"></span> Food & Dining
              </div>
              <span className="text-gray-500 font-medium">25%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 font-semibold text-[#1a1a2e]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8b4513]"></span> Transportation
              </div>
              <span className="text-gray-500 font-medium">15%</span>
            </div>
          </div>
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
              {[
                { merchant: "Whole Foods Market", cat: "Groceries", date: "Oct 24, 2023", amount: "-$142.50", status: "Complete", icon: ShoppingCart },
                { merchant: "Pacific Gas & Electric", cat: "Utilities", date: "Oct 22, 2023", amount: "-$85.20", status: "Complete", icon: Zap },
                { merchant: "Uber Rides", cat: "Transportation", date: "Oct 21, 2023", amount: "-$24.90", status: "Pending", icon: Car },
                { merchant: "TechCorp Inc. Salary", cat: "Income", date: "Oct 15, 2023", amount: "+$3,250.00", status: "Complete", icon: Briefcase, positive: true },
              ].map((tx, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
                        <tx.icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-[#1a1a2e]">{tx.merchant}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-gray-500 font-medium">{tx.cat}</td>
                  <td className="px-8 py-5 text-gray-500 font-medium">{tx.date}</td>
                  <td className={`px-8 py-5 font-bold text-right ${tx.positive ? 'text-emerald-500' : 'text-[#1a1a2e]'}`}>
                    {tx.amount}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      tx.status === 'Complete' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
