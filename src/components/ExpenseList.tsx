import React from 'react';
import { Download, Activity, TrendingUp, Filter, Trash2, ArrowUpRight, ArrowDownLeft, Tag } from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency, cn, exportToCSV } from '../lib/utils';
import { format, parseISO } from 'date-fns';

interface ExpenseListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export default function ExpenseList({ transactions, onDelete }: ExpenseListProps) {
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleExport = () => {
    exportToCSV(transactions, 'expenses_report.csv');
  };

  return (
    <div className="glass-card">
      <div className="p-6 border-bottom border-gray-100 flex justify-between items-center bg-white">
        <div>
          <h3 className="text-lg font-semibold">Transaction History</h3>
          <p className="text-xs text-gray-400">Manage and export your log</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExport}
            className="btn-secondary text-xs flex items-center gap-2 py-1.5"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-y border-gray-100 bg-gray-50/50">
              <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
              <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Details</th>
              <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
              <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Amount</th>
              <th className="px-6 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm italic font-serif">
                  No transactions yet. Start by adding one above.
                </td>
              </tr>
            ) : (
              sortedTransactions.map((t) => (
                <tr key={t.id} className="group hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      t.type === 'Income' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    )}>
                      {t.type === 'Income' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-sm">{t.description || t.category}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[200px]">{t.description ? t.category : 'No description'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-100 w-fit px-2 py-1 rounded-md">
                      <Tag size={12} />
                      {t.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-400">
                    {format(parseISO(t.date), 'MMM dd, yyyy')}
                  </td>
                  <td className={cn(
                    "px-6 py-4 text-right font-bold font-mono tracking-tighter",
                    t.type === 'Income' ? "text-green-600" : "text-red-600"
                  )}>
                    {t.type === 'Income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onDelete(t.id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
