import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Target, AlertTriangle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Transaction, FinancialForecast } from '../types';
import { formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';

interface AiForecasterProps {
  transactions: Transaction[];
}

export default function AiForecaster({ transactions }: AiForecasterProps) {
  const [forecast, setForecast] = useState<FinancialForecast | null>(null);
  const [loading, setLoading] = useState(false);

  const generateForecast = async () => {
    if (transactions.length < 10) return;

    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const summary = transactions.map(t => `${t.date}: ${t.type} ${t.amount} (${t.category})`).join('\n');

      const prompt = `Based on these past transactions, forecast the total spending for the NEXT month. 
      Analyze recurring patterns (rent, salary) vs erratic spending.
      Return JSON with: nextMonthTotal (number), confidence (0-1), explanation (string), riskFactors (string array).
      
      Data:
      ${summary}`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      setForecast(JSON.parse(response.text || '{}'));
    } catch (err) {
      console.error('Forecasting Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateForecast();
  }, [transactions.length]);

  if (transactions.length < 10) {
    return (
      <div className="glass-card p-6 bg-gray-50 border-dashed">
        <div className="flex items-center gap-3 text-gray-400">
          <Target size={20} />
          <p className="text-xs font-medium italic">Forecasting unlocks after 10+ transactions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 bg-black text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full -mr-16 -mt-16" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Target className="text-purple-400" size={20} />
          Predictive Analysis
        </h3>
        {loading && <Loader2 className="animate-spin text-purple-400" size={16} />}
      </div>

      {!loading && forecast && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 relative z-10"
        >
          <div className="flex items-end gap-3">
            <h2 className="text-3xl font-bold font-mono text-purple-400">{formatCurrency(forecast.nextMonthTotal)}</h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Projected Next Month</p>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs leading-relaxed text-gray-300 italic">"{forecast.explanation}"</p>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle size={12} className="text-amber-500" />
              Risk Factors
            </p>
            <div className="flex flex-wrap gap-2">
              {forecast.riskFactors.map((risk, i) => (
                <span key={i} className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] rounded-md font-medium">
                  {risk}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <div className="flex justify-between items-center mb-1 text-[10px]">
              <span className="text-gray-500 uppercase font-bold tracking-widest">Confidence Score</span>
              <span className="font-mono text-purple-400">{Math.round(forecast.confidence * 100)}%</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${forecast.confidence * 100}%` }}
                className="h-full bg-purple-500"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
