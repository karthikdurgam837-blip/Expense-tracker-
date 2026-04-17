import React from 'react';
import { Budget } from '../types';
import { formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';

interface BudgetOverviewProps {
  budgets: Budget[];
}

export default function BudgetOverview({ budgets }: BudgetOverviewProps) {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-6 flex justify-between items-center">
        Budget Health
        <span className="text-xs font-normal text-gray-400">monthly monitoring</span>
      </h3>

      <div className="space-y-6">
        {budgets.length === 0 ? (
          <p className="text-sm text-gray-400 italic py-4 text-center">Set up category budgets to track progress.</p>
        ) : (
          budgets.map((budget) => {
            const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
            const isCritical = percentage >= 90;
            const isWarning = percentage >= 70 && percentage < 90;

            return (
              <div key={budget.category} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-sm font-bold">{budget.category}</span>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                      {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                    </p>
                  </div>
                  <span className={`text-xs font-mono font-bold ${
                    isCritical ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {Math.round((budget.spent / budget.limit) * 100)}%
                  </span>
                </div>
                
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-black'
                    }`}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
