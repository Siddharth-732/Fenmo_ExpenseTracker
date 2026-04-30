"use client";

import React from "react";
import { Target } from "lucide-react";

export default function Goals() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8 flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mb-4">
        <Target className="w-12 h-12 text-amber-500" />
      </div>
      <h2 className="text-4xl font-bold text-[#1a1a2e]">Goals</h2>
      <p className="text-xl text-gray-500 max-w-lg">Set financial targets and track your progress towards a secure future.</p>
      <div className="mt-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
        <p className="font-semibold text-gray-400 uppercase tracking-widest text-sm">Coming Soon</p>
      </div>
    </div>
  );
}
