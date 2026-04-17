import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, AlertCircle, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Transaction, SpendingInsight } from '../types';
import { formatCurrency } from '../lib/utils';

interface AiInsightsProps {
  transactions: Transaction[];
}

export default function AiInsights({ transactions }: AiInsightsProps) {
  const [insights, setInsights] = useState<SpendingInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsights = async () => {
    if (transactions.length < 3) {
      setInsights([{
        title: "More Data Needed",
        content: "Add at least 3 transactions to unlock AI-powered personal financial insights.",
        type: 'info'
      }]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const summary = transactions.map(t => 
        `${t.date}: ${t.type} ${formatCurrency(t.amount)} for ${t.category} (${t.description})`
      ).join('\n');

      const prompt = `Analyze this list of financial transactions and provide 3 specific, actionable spending insights for the user. 
      Keep each insight brief and professional.
      Format the response as a JSON array of objects with fields: title, content, type (must be 'warning', 'info', or 'success').
      
      Transactions:
      ${summary}
      
      Insight Examples:
      - title: "High Food Spending", content: "You spent 40% more on food this week compared to last week.", type: "warning"
      - title: "Stable Transport", content: "Your transport costs are consistent, suggesting a good routine.", type: "success"
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text || '[]');
      setInsights(result);
    } catch (err: any) {
      console.error('AI Insight Error:', err);
      setError("Failed to generate AI insights. Please check your connection or try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateInsights();
  }, [transactions.length]);

  return (
    <div className="glass-card p-6 min-h-[150px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="text-purple-500 fill-purple-500/20" size={20} />
          AI Financial Insights
        </h3>
        <button 
          onClick={generateInsights} 
          disabled={loading || transactions.length < 3}
          className="text-xs font-semibold text-purple-600 hover:underline disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Refresh Insights'}
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-8 gap-4">
          <Loader2 className="animate-spin text-purple-500" size={24} />
          <p className="text-xs text-gray-500 font-mono italic animate-pulse">Deep scanning financial patterns...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3 text-red-600">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((insight, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-xl border flex flex-col gap-2 transition-all hover:translate-y-[-2px] hover:shadow-md ${
                insight.type === 'warning' ? 'bg-amber-50 border-amber-100' :
                insight.type === 'success' ? 'bg-emerald-50 border-emerald-100' :
                'bg-blue-50 border-blue-100'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {insight.type === 'warning' && <TrendingUp className="text-amber-600" size={16} />}
                {insight.type === 'success' && <TrendingDown className="text-emerald-600" size={16} />}
                {insight.type === 'info' && <Info className="text-blue-600" size={16} />}
                <h4 className={`text-xs font-bold uppercase tracking-wider ${
                  insight.type === 'warning' ? 'text-amber-800' :
                  insight.type === 'success' ? 'text-emerald-800' :
                  'text-blue-800'
                }`}>
                  {insight.title}
                </h4>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed font-serif">
                {insight.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
