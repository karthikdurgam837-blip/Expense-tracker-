import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Category, Transaction, TransactionType } from '../types';
import { cn } from '../lib/utils';

interface ExpenseFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
  onCancel?: () => void;
}

const CATEGORIES: Category[] = [
  'Food', 'Transport', 'Rent', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Salary', 'Others'
];

export default function ExpenseForm({ onAdd, onCancel }: ExpenseFormProps) {
  const [type, setType] = useState<TransactionType>('Expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    onAdd({
      type,
      amount: Number(amount),
      category,
      description,
      date,
    });

    // Reset form
    setAmount('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Add Transaction</h3>
        {onCancel && (
          <button type="button" onClick={onCancel} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex p-1 bg-gray-100 rounded-lg w-full">
        <button
          type="button"
          onClick={() => setType('Expense')}
          className={cn(
            "flex-1 py-1.5 text-sm font-medium rounded-md transition-all",
            type === 'Expense' ? "bg-white shadow-sm text-red-600" : "text-gray-500 hover:text-gray-700"
          )}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => setType('Income')}
          className={cn(
            "flex-1 py-1.5 text-sm font-medium rounded-md transition-all",
            type === 'Income' ? "bg-white shadow-sm text-green-600" : "text-gray-500 hover:text-gray-700"
          )}
        >
          Income
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount (₹)</label>
          <input
            type="number"
            required
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all font-mono"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all"
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
        <input
          type="text"
          placeholder="What was this for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all"
        />
      </div>

      <button
        type="submit"
        className="w-full btn-primary flex items-center justify-center gap-2 mt-2"
      >
        <Plus size={20} />
        Add {type}
      </button>
    </form>
  );
}
