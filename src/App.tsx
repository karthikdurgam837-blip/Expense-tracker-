/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Plus, 
  History, 
  PieChart as ChartIcon, 
  Sparkles,
  LayoutDashboard,
  Settings,
  Bell,
  Search,
  ChevronRight,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction } from './types';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Dashboard from './components/Dashboard';
import AiInsights from './components/AiInsights';
import AiForecaster from './components/AiForecaster';
import BudgetOverview from './components/BudgetOverview';
import SyntheticDataGenerator from './components/SyntheticDataGenerator';
import { cn } from './lib/utils';
import { Category, Budget } from './types';

const DEFAULT_BUDGETS: Budget[] = [
  { category: 'Food', limit: 8000, spent: 0 },
  { category: 'Transport', limit: 3000, spent: 0 },
  { category: 'Rent', limit: 25000, spent: 0 },
  { category: 'Entertainment', limit: 5000, spent: 0 },
  { category: 'Shopping', limit: 10000, spent: 0 },
];

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>(DEFAULT_BUDGETS);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'insights' | 'budget'>('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Calculate current month's spending per category
  useEffect(() => {
    const now = new Date();
    const currentMonthTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.type === 'Expense';
    });

    const updatedBudgets = budgets.map(b => ({
      ...b,
      spent: currentMonthTransactions
        .filter(t => t.category === b.category)
        .reduce((sum, t) => sum + t.amount, 0)
    }));

    setBudgets(updatedBudgets);
  }, [transactions]);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('insightspend_data');
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved data', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('insightspend_data', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...t,
      id: Math.random().toString(36).substr(2, 9)
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setIsFormOpen(false);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const generateData = (data: Transaction[]) => {
    setTransactions(data);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-100 p-6 flex flex-col gap-8 hidden md:flex">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <Wallet className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">InsightSpend</h1>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">AI Tracker</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
          />
          <NavItem 
            active={activeTab === 'transactions'} 
            onClick={() => setActiveTab('transactions')}
            icon={<History size={20} />}
            label="Transactions"
          />
          <NavItem 
            active={activeTab === 'insights'} 
            onClick={() => setActiveTab('insights')}
            icon={<Sparkles size={20} />}
            label="AI Insights"
          />
          <NavItem 
            active={activeTab === 'budget'} 
            onClick={() => setActiveTab('budget')}
            icon={<Target size={20} />}
            label="Budgets"
          />
        </nav>

        <div className="mt-auto space-y-2">
          <NavItem icon={<Settings size={20} />} label="Settings" />
          <div className="p-4 bg-gray-50 rounded-2xl">
            <p className="text-xs font-bold text-gray-500 mb-2">PRO PLAN</p>
            <p className="text-[10px] text-gray-400 mb-3">Get advanced forecasting & multi-device sync.</p>
            <button className="w-full py-2 bg-black text-white text-xs font-bold rounded-lg hover:scale-105 transition-all">Upgrade Now</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold font-serif capitalize">{activeTab}</h2>
            <p className="text-sm text-gray-400 tracking-tight">Overview of your personal finances and trends.</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search history..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
              />
            </div>
            <button className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-black transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add Transaction</span>
            </button>
          </div>
        </header>

        {/* Content Tabs */}
        <div className="space-y-8">
          {activeTab === 'dashboard' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {transactions.length === 0 && <SyntheticDataGenerator onGenerate={generateData} />}
              <Dashboard transactions={transactions} budgets={budgets} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <ExpenseList transactions={transactions.slice(0, 5)} onDelete={deleteTransaction} />
                </div>
                <div className="space-y-8">
                  <BudgetOverview budgets={budgets} />
                  <AiForecaster transactions={transactions} />
                  <AiInsights transactions={transactions} />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'budget' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <BudgetOverview budgets={budgets} />
                <div className="glass-card p-8 flex flex-col justify-center items-center text-center space-y-6">
                  <div className="w-20 h-20 bg-black text-white rounded-3xl flex items-center justify-center rotate-3 shadow-xl">
                    <Target size={32} />
                  </div>
                  <h3 className="text-2xl font-bold font-serif">Smart Budgeting</h3>
                  <p className="text-sm text-gray-400 max-w-xs">Our AI analyzes your limits vs actual spending to suggest optimized budgets for next month.</p>
                  <button className="btn-primary w-full">Apply AI Optimization</button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'transactions' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ExpenseList transactions={transactions} onDelete={deleteTransaction} />
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AiInsights transactions={transactions} />
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-8 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                    <ChartIcon size={32} />
                  </div>
                  <h3 className="font-bold text-xl">Spending Habits</h3>
                  <p className="text-sm text-gray-400">View detailed reports on your weekly and monthly recurring habits.</p>
                  <button className="btn-secondary w-full">Detailed Report</button>
                </div>
                <div className="glass-card p-8 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
                    <LayoutDashboard size={32} />
                  </div>
                  <h3 className="font-bold text-xl">Budget Goals</h3>
                  <p className="text-sm text-gray-400">Set and track savings goals for specific categories like travel or tech.</p>
                  <button className="btn-secondary w-full">Set Goal</button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Floating Add Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-all"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[480px] bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
            >
              <ExpenseForm onAdd={addTransaction} onCancel={() => setIsFormOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Nav - Mobile */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 h-16 bg-black/90 backdrop-blur-md rounded-2xl flex items-center justify-around px-4 z-40 shadow-xl border border-white/10">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={cn("p-2 rounded-xl transition-all", activeTab === 'dashboard' ? "bg-white text-black" : "text-white/60")}
        >
          <LayoutDashboard size={20} />
        </button>
        <button 
          onClick={() => setActiveTab('transactions')}
          className={cn("p-2 rounded-xl transition-all", activeTab === 'transactions' ? "bg-white text-black" : "text-white/60")}
        >
          <History size={20} />
        </button>
        <button 
          onClick={() => setActiveTab('insights')}
          className={cn("p-2 rounded-xl transition-all", activeTab === 'insights' ? "bg-white text-black" : "text-white/60")}
        >
          <Sparkles size={20} />
        </button>
        <div className="w-[1px] h-6 bg-white/20 mx-2" />
        <button 
          onClick={() => setIsFormOpen(true)}
          className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center active:scale-95 transition-all"
        >
          <Plus size={20} />
        </button>
      </nav>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
        active 
          ? "bg-black text-white shadow-lg shadow-black/10" 
          : "text-gray-500 hover:bg-gray-50 hover:text-black"
      )}
    >
      <span className={cn("transition-colors", active ? "text-white" : "text-gray-400 group-hover:text-black")}>
        {icon}
      </span>
      <span className="text-sm font-semibold">{label}</span>
      {active && <motion.div layoutId="nav-pill" className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
    </button>
  );
}

