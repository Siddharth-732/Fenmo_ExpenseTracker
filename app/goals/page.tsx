"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Target, Minus, ArrowRight } from "lucide-react";
import { getGoals, saveGoal as dbSaveGoal, updateGoalAmount as dbUpdateGoalAmount, Goal } from "@/lib/localDb";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const [adjustingGoalId, setAdjustingGoalId] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number | "">("");
  const [isAdjusting, setIsAdjusting] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const data = await getGoals();
      setGoals(data);
    } catch (error) {
      console.error("Failed to load goals", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isAdding) return;
    
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const targetAmount = Number(formData.get("targetAmount"));
    
    if (!title || isNaN(targetAmount) || targetAmount <= 0) return;

    setIsAdding(true);
    try {
      const newGoal = await dbSaveGoal({ title, targetAmount });
      setGoals(prev => [...prev, newGoal]);
      setIsAddModalOpen(false);
    } catch (error) {
      alert("Failed to create goal.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleAdjustGoal = async (goal: Goal, type: 'add' | 'deduct') => {
    if (!adjustAmount || isNaN(Number(adjustAmount))) return;
    
    const amountToAdjust = Number(adjustAmount);
    if (amountToAdjust <= 0) return;

    let newCurrentAmount = goal.currentAmount;
    if (type === 'add') {
      newCurrentAmount += amountToAdjust;
    } else {
      newCurrentAmount = Math.max(0, newCurrentAmount - amountToAdjust);
    }

    setIsAdjusting(true);
    try {
      const updatedGoal = await dbUpdateGoalAmount(goal.id, newCurrentAmount);
      setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
      setAdjustingGoalId(null);
      setAdjustAmount("");
    } catch (error) {
      alert("Failed to update goal.");
    } finally {
      setIsAdjusting(false);
    }
  };

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

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-end justify-between pt-4">
        <div>
          <h2 className="text-4xl font-bold text-[#1a1a2e] tracking-tight">Savings Goals</h2>
          <p className="text-gray-500 mt-2 font-medium">Track your progress and build your savings over time.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#4338ca] hover:bg-[#3730a3] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Goal
        </button>
      </div>

      {/* Global Progress */}
      {goals.length > 0 && (
        <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase mb-2">Total Savings Progress</h3>
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-4xl font-bold text-[#1a1a2e]">{formatCurrency(totalSaved)}</h2>
            <p className="text-gray-500 font-bold mb-1">of {formatCurrency(totalTarget)} target</p>
          </div>
          <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-1000 relative overflow-hidden" 
              style={{ width: `${Math.min((totalSaved / totalTarget) * 100 || 0, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        </div>
      )}

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="bg-white rounded-[24px] p-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-[#4338ca]" />
          </div>
          <h4 className="text-xl font-bold text-[#1a1a2e] mb-2">No saving goals yet</h4>
          <p className="text-gray-500 max-w-md mx-auto mb-6">Create your first goal to start tracking your savings towards big purchases, vacations, or emergencies.</p>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="text-[#4338ca] font-bold px-6 py-3 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map(goal => {
            const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
            const isCompleted = percentage >= 100;
            const isAdjustingThis = adjustingGoalId === goal.id;

            return (
              <div key={goal.id} className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-bold text-[#1a1a2e]">{goal.title}</h3>
                    {isCompleted && (
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">Completed 🎉</span>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-3xl font-bold text-[#1a1a2e]">{formatCurrency(goal.currentAmount)}</span>
                      <span className="text-sm font-bold text-gray-400">/ {formatCurrency(goal.targetAmount)}</span>
                    </div>
                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-emerald-500' : 'bg-[#4338ca]'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-right text-xs font-bold mt-2 text-gray-500">{percentage.toFixed(1)}%</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  {isAdjustingThis ? (
                    <div className="flex items-center gap-2 animate-in slide-in-from-bottom-2">
                      <input 
                        type="number" 
                        value={adjustAmount}
                        onChange={(e) => setAdjustAmount(Number(e.target.value) || "")}
                        placeholder="Amount ₹"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/30"
                      />
                      <button 
                        onClick={() => handleAdjustGoal(goal, 'deduct')}
                        disabled={isAdjusting}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-bold transition-colors disabled:opacity-50"
                        title="Deduct Money"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleAdjustGoal(goal, 'add')}
                        disabled={isAdjusting}
                        className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 font-bold transition-colors disabled:opacity-50"
                        title="Add Money"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => { setAdjustingGoalId(null); setAdjustAmount(""); }}
                        className="text-xs text-gray-400 hover:text-gray-600 font-bold ml-1"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setAdjustingGoalId(goal.id)}
                      className="text-sm font-bold text-[#4338ca] flex items-center gap-2 hover:text-[#3730a3] transition-colors"
                    >
                      Update Progress <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Goal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-2xl font-bold text-[#1a1a2e]">Create New Goal</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors shadow-sm"
              >
                <span className="sr-only">Close</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateGoal} className="p-8 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Goal Name</label>
                <input 
                  name="title"
                  type="text" 
                  required
                  placeholder="e.g. Buy a new car, Emergency Fund"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/30 focus:border-[#4338ca] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Target Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                  <input 
                    name="targetAmount"
                    type="number" 
                    step="1"
                    min="1"
                    required
                    placeholder="e.g. 500000"
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/30 focus:border-[#4338ca] transition-all"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isAdding}
                  className="w-full bg-[#4338ca] hover:bg-[#3730a3] disabled:bg-indigo-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 flex justify-center items-center gap-2"
                >
                  {isAdding && <Loader2 className="w-5 h-5 animate-spin" />}
                  {isAdding ? "Creating..." : "Save Goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
