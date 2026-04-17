import React from 'react';
import { Database, Zap } from 'lucide-react';
import { Transaction, Category } from '../types';
import { subDays, format } from 'date-fns';

interface SyntheticDataGeneratorProps {
  onGenerate: (data: Transaction[]) => void;
}

const CATEGORIES: Category[] = [
  'Food', 'Transport', 'Rent', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Others'
];

export default function SyntheticDataGenerator({ onGenerate }: SyntheticDataGeneratorProps) {
  const generateData = () => {
    const data: Transaction[] = [];
    
    // Add a salary
    data.push({
      id: Math.random().toString(36).substr(2, 9),
      date: format(subDays(new Date(), 25), 'yyyy-MM-dd'),
      category: 'Salary',
      amount: 65000,
      type: 'Income',
      description: 'Monthly Salary'
    });

    // Add random expenses for the last 30 days
    for (let i = 0; i < 40; i++) {
      const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      const date = format(subDays(new Date(), Math.floor(Math.random() * 30)), 'yyyy-MM-dd');
      const amount = Math.floor(Math.random() * 1500) + 50;
      
      data.push({
        id: Math.random().toString(36).substr(2, 9),
        date,
        category,
        amount,
        type: 'Expense',
        description: `Random ${category} expense`
      });
    }

    // Add some big expenses
    data.push({
      id: Math.random().toString(36).substr(2, 9),
      date: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
      category: 'Rent',
      amount: 25000,
      type: 'Expense',
      description: 'Monthly House Rent'
    });

    onGenerate(data);
  };

  return (
    <div className="bg-black text-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 opacity-10 scale-150 rotate-12">
        <Database size={200} />
      </div>
      
      <div className="relative z-10 flex gap-4 items-center">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
          <Database size={24} className="text-white" />
        </div>
        <div>
          <h4 className="font-bold text-lg">Simulation Mode</h4>
          <p className="text-sm text-gray-400">Populate your dashboard with 40+ synthetic transactions for analysis.</p>
        </div>
      </div>

      <button 
        onClick={generateData}
        className="relative z-10 btn-secondary border-none flex items-center gap-2 hover:bg-white active:scale-95"
      >
        <Zap size={18} fill="currentColor" />
        Generate Data
      </button>
    </div>
  );
}
