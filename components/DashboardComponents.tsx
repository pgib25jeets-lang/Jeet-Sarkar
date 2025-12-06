import React from 'react';
import { Loader2, TrendingUp, TrendingDown, AlertTriangle, Info } from 'lucide-react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; action?: React.ReactNode }> = ({ children, className = "", title, action }) => (
  <div className={`bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg flex flex-col ${className}`}>
    {(title || action) && (
      <div className="flex justify-between items-center mb-4">
        {title && <h3 className="text-slate-200 font-semibold text-lg">{title}</h3>}
        {action}
      </div>
    )}
    <div className="flex-1 min-h-0">
      {children}
    </div>
  </div>
);

export const KpiCard: React.FC<{ label: string; value: string; trend?: number; icon?: React.ReactNode }> = ({ label, value, trend, icon }) => (
  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-400 text-sm">{label}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
      {icon && <div className="text-indigo-400">{icon}</div>}
    </div>
    {trend !== undefined && (
      <div className={`flex items-center mt-2 text-xs font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
        {trend >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
        {Math.abs(trend)}% vs last mo
      </div>
    )}
  </div>
);

export const AILoadingState: React.FC = () => (
  <div className="flex items-center justify-center p-4 text-indigo-300 animate-pulse">
    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
    <span className="text-sm">Gemini is analyzing scenarios...</span>
  </div>
);

export const InsightBox: React.FC<{ text: string | null; onAnalyze: () => void; isLoading: boolean; title?: string }> = ({ text, onAnalyze, isLoading, title = "AI Strategy Insight" }) => (
  <div className="mt-4 bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4">
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center text-indigo-300">
        <Info className="w-4 h-4 mr-2" />
        <span className="text-sm font-semibold tracking-wider uppercase">{title}</span>
      </div>
      {!text && !isLoading && (
        <button 
          onClick={onAnalyze}
          className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded transition-colors"
        >
          Generate Analysis
        </button>
      )}
    </div>
    {isLoading ? (
      <AILoadingState />
    ) : (
      <p className="text-slate-300 text-sm leading-relaxed">
        {text || "Click generate to receive strategic AI insights based on current data signals."}
      </p>
    )}
  </div>
);
