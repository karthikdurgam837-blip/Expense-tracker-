import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  LineChart, Line
} from 'recharts';
import { Activity, ShieldCheck, Zap } from 'lucide-react';
import { Transaction, Budget } from '../types';
import { formatCurrency, calculateFinancialScore } from '../lib/utils';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

interface DashboardProps {
  transactions: Transaction[];
  budgets: Budget[];
}

const COLORS = ['#141414', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#71717a'];

export default function Dashboard({ transactions, budgets }: DashboardProps) {
  const healthScore = calculateFinancialScore(transactions, budgets);
  // 1. Prepare Category Data for Pie Chart
  const categoryData = transactions
    .filter(t => t.type === 'Expense')
    .reduce((acc, curr) => {
      const existing = acc.find(item => item.name === curr.category);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: curr.category, value: curr.amount });
      }
      return acc;
    }, [] as { name: string, value: number }[])
    .sort((a, b) => b.value - a.value);

  // 2. Prepare Trend Data for Line Chart (Current Month)
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  const daysInMonth = eachDayOfInterval({ start, end });

  const trendData = daysInMonth.map(day => {
    const dailyTotal = transactions
      .filter(t => t.type === 'Expense' && isSameDay(parseISO(t.date), day))
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      date: format(day, 'dd'),
      amount: dailyTotal
    };
  });

  // Summary stats
  const totalIncome = transactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 border-l-4 border-purple-500 bg-gradient-to-br from-white to-purple-50/30">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-1 flex items-center gap-1">
            <Activity size={12} />
            Financial Health
          </p>
          <div className="flex items-end gap-2">
            <h2 className="text-3xl font-bold font-mono">{healthScore}</h2>
            <span className="text-xs font-bold text-gray-400 mb-1">/100</span>
          </div>
        </div>
        <div className="glass-card p-6 border-l-4 border-black">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-1">Total Balance</p>
          <h2 className="text-3xl font-bold font-mono">{formatCurrency(balance)}</h2>
        </div>
        <div className="glass-card p-6 border-l-4 border-green-500">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-1">Total Income</p>
          <h2 className="text-3xl font-bold font-mono text-green-600">+{formatCurrency(totalIncome)}</h2>
        </div>
        <div className="glass-card p-6 border-l-4 border-red-500">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-1">Total Expense</p>
          <h2 className="text-3xl font-bold font-mono text-red-600">-{formatCurrency(totalExpense)}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center justify-between">
            Expense Breakdown
            <span className="text-xs font-normal text-gray-400">by category</span>
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center justify-between">
            Monthly Spending Trend
            <span className="text-xs font-normal text-gray-400">{format(now, 'MMMM yyyy')}</span>
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }} 
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#141414" 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 6, fill: '#141414' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
