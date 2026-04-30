"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
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
  Sun,
  HelpCircle,
  X,
  Loader2,
  Utensils,
  Home,
  Car,
  Film,
  Plane,
  ShoppingBag,
} from "lucide-react";
import { saveExpense } from "@/lib/localDb";

const CATEGORIES = [
  {
    name: "Food & Dining",
    icon: Utensils,
    color: "bg-red-500",
    light: "bg-red-100",
    text: "text-red-600",
  },
  {
    name: "Housing",
    icon: Home,
    color: "bg-emerald-500",
    light: "bg-emerald-100",
    text: "text-emerald-600",
  },
  {
    name: "Transportation",
    icon: Car,
    color: "bg-blue-500",
    light: "bg-blue-100",
    text: "text-blue-600",
  },
  {
    name: "Entertainment",
    icon: Film,
    color: "bg-amber-500",
    light: "bg-amber-100",
    text: "text-amber-600",
  },
  {
    name: "Travel",
    icon: Plane,
    color: "bg-cyan-500",
    light: "bg-cyan-100",
    text: "text-cyan-600",
  },
  {
    name: "Shopping",
    icon: ShoppingBag,
    color: "bg-purple-500",
    light: "bg-purple-100",
    text: "text-purple-600",
  },
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  React.useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setIsDarkMode(true);
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
      await saveExpense({
        amount: Number(amount),
        category: category.toString(),
        description: description.toString(),
        date: date.toString()
      });

      // Optionally trigger a re-fetch of expenses here if we had a global context
      setIsAddModalOpen(false);
      window.location.reload(); // Quick way to refresh data for this simple app
    } catch (err) {
      alert("Failed to save expense. It might be a network issue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const query = e.currentTarget.value.trim();
      if (query) {
        router.push(`/expenses?search=${encodeURIComponent(query)}`);
      } else {
        router.push(`/expenses`);
      }
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Expenses", href: "/expenses", icon: Receipt },
    { name: "Goals", href: "/goals", icon: Target },
  ];

  return (
    <div className="flex flex-1 min-h-screen w-full bg-[#f4f7fe]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-20 hidden md:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4338ca] to-[#3b82f6] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
            M
          </div>
          <div>
            <h1 className="font-bold text-xl text-[#1a1a2e] tracking-tight">
              My Expense
            </h1>
            <p className="text-xs text-gray-500 font-medium">Premium Finance</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#f0f4ff] text-[#4338ca]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
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

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col h-full overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-br from-[#eef2ff] via-[#f0f4ff] to-[#f4f7fe] -z-10" />

        {/* Topbar */}
        <header className="h-20 bg-transparent flex items-center justify-between px-8 z-10">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions... (Press Enter)"
              onKeyDown={handleSearch}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#4338ca]/20 shadow-sm border border-transparent transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2.5 text-gray-500 hover:text-gray-900 bg-white rounded-full shadow-sm transition-colors hover:shadow"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-500 ml-2 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold">
              JD
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto px-8 pb-12">{children}</div>
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
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                    ₹
                  </span>
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
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/30 focus:border-[#4338ca] transition-all appearance-none"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Description
                </label>
                <input
                  name="description"
                  type="text"
                  required
                  placeholder="What was this for?"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/30 focus:border-[#4338ca] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Date
                </label>
                <input
                  name="date"
                  type="date"
                  required
                  defaultValue={new Date().toISOString().split("T")[0]}
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
