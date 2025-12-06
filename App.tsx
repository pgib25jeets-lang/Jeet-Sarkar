import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart 
} from 'recharts';
import { LayoutDashboard, Zap, Activity, AlertOctagon, GitMerge } from 'lucide-react';
import { generateHistoricalData, earlyWarningMetrics, getScenarios } from './utils/mockData';
import { Card, KpiCard, InsightBox, AILoadingState } from './components/DashboardComponents';
import { getStrategicInsight } from './services/geminiService';
import { AnalysisType, MonthlyData } from './types';

const App: React.FC = () => {
  // State
  const [data, setData] = useState<MonthlyData[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'scenarios' | 'decision'>('overview');
  
  // AI Insights State
  const [snapshotInsight, setSnapshotInsight] = useState<string | null>(null);
  const [trendInsight, setTrendInsight] = useState<string | null>(null);
  const [scenarioInsight, setScenarioInsight] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState<string | null>(null);

  useEffect(() => {
    setData(generateHistoricalData());
  }, []);

  const scenarios = getScenarios();

  // Handlers for AI
  const handleAnalyze = async (type: AnalysisType, context: any, setter: (val: string) => void) => {
    setLoadingAI(type);
    const contextStr = JSON.stringify(context, null, 2);
    const insight = await getStrategicInsight(type, contextStr);
    setter(insight);
    setLoadingAI(null);
  };

  // Derived metrics
  const lastMonth = data[data.length - 1];
  const onlineTotal = data.reduce((acc, curr) => acc + curr.onlineSales, 0);
  const offlineTotal = data.reduce((acc, curr) => acc + curr.offlineSales, 0);
  const volatilityScore = data.reduce((acc, curr) => acc + curr.uncertaintyIndex, 0) / data.length;

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center">
              <LayoutDashboard className="w-6 h-6 mr-3 text-indigo-500" />
              Strategic Decision Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">Theme: "The Future Nobody Can See" — School Bags Market</p>
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            {[
              { id: 'overview', label: 'Market Overview', icon: Activity },
              { id: 'scenarios', label: 'Scenario Planning', icon: GitMerge },
              { id: 'decision', label: 'Decision Matrix', icon: AlertOctagon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all ${
                  activeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-indigo-500/20 shadow-lg' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        
        {/* VIEW: OVERVIEW */}
        {activeTab === 'overview' && (
          <>
            {/* Section 1: Sales Snapshot */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <KpiCard label="Last Month Total" value={`$${(lastMonth?.totalSales || 0).toLocaleString()}`} trend={2.4} />
              <KpiCard label="Online Contribution" value={`${Math.round((lastMonth?.onlineSales / lastMonth?.totalSales) * 100)}%`} trend={5.1} icon={<Zap className="w-4 h-4" />} />
              <KpiCard label="Volatility Index" value={`${Math.round(volatilityScore)}/100`} trend={-1.2} />
              <KpiCard label="Active Month" value={lastMonth?.month || 'N/A'} icon={<Activity className="w-4 h-4" />} />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2" title="Section 1: Current Sales & Volatility">
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickMargin={10} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                        itemStyle={{ color: '#f8fafc' }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="onlineSales" name="Online Sales" stroke="#6366f1" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                      <Line type="monotone" dataKey="offlineSales" name="Offline Sales" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <InsightBox 
                  text={snapshotInsight} 
                  isLoading={loadingAI === AnalysisType.SNAPSHOT}
                  onAnalyze={() => handleAnalyze(AnalysisType.SNAPSHOT, { onlineTotal, offlineTotal, volatilityScore, lastMonth }, setSnapshotInsight)}
                />
              </Card>

              <Card title="Section 2: Trend Uncertainty" className="flex flex-col">
                 <div className="h-64 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={data}>
                        <defs>
                          <linearGradient id="colorUncertainty" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="month" hide />
                        <YAxis hide />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                        <Area type="monotone" dataKey="uncertaintyIndex" name="Market Uncertainty" stroke="#f43f5e" fillOpacity={1} fill="url(#colorUncertainty)" />
                     </AreaChart>
                   </ResponsiveContainer>
                 </div>
                 <div className="mt-2 text-sm text-slate-400 text-center">
                    Higher peaks indicate unpredictable demand periods.
                 </div>
                 <InsightBox 
                  title="Trend Analysis"
                  text={trendInsight} 
                  isLoading={loadingAI === AnalysisType.TREND}
                  onAnalyze={() => handleAnalyze(AnalysisType.TREND, data.map(d => ({ m: d.month, u: d.uncertaintyIndex })), setTrendInsight)}
                />
              </Card>
            </div>

            {/* Section 4: Early Warnings */}
            <Card title="Section 4: Early-Warning Indicators" className="mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {earlyWarningMetrics.map((metric) => (
                  <div key={metric.name} className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-200 bg-indigo-900/50">
                          {metric.category} Signal
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-slate-300">
                          {metric.value}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-700">
                      <div 
                        style={{ width: `${metric.value}%` }} 
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                          metric.category === 'online' ? 'bg-indigo-500' : 'bg-emerald-500'
                        }`}
                      ></div>
                    </div>
                    <p className="text-sm text-slate-400 font-medium">{metric.name}</p>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {/* VIEW: SCENARIOS */}
        {activeTab === 'scenarios' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Scenario A */}
              <Card title={scenarios.online.name} className="border-indigo-500/50">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-4xl font-bold text-indigo-400">${(scenarios.online.revenueProj / 1000).toFixed(0)}k</p>
                    <p className="text-sm text-slate-400">Projected Revenue</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-emerald-400">{scenarios.online.roi}%</p>
                    <p className="text-sm text-slate-400">Exp. ROI</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-6">{scenarios.online.description}</p>
                
                <div className="h-48 w-full">
                  <ResponsiveContainer>
                    <BarChart data={[
                      { name: 'Revenue', val: scenarios.online.revenueProj, fill: '#6366f1' },
                      { name: 'Cost', val: scenarios.online.costProj, fill: '#f43f5e' }
                    ]} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                      <XAxis type="number" stroke="#94a3b8" hide />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" width={60} />
                      <Tooltip cursor={{fill: '#334155', opacity: 0.2}} contentStyle={{backgroundColor: '#1e293b'}} />
                      <Bar dataKey="val" radius={[0, 4, 4, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Scenario B */}
              <Card title={scenarios.offline.name} className="border-emerald-500/50">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-4xl font-bold text-emerald-400">${(scenarios.offline.revenueProj / 1000).toFixed(0)}k</p>
                    <p className="text-sm text-slate-400">Projected Revenue</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-emerald-400">{scenarios.offline.roi}%</p>
                    <p className="text-sm text-slate-400">Exp. ROI</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-6">{scenarios.offline.description}</p>
                
                <div className="h-48 w-full">
                  <ResponsiveContainer>
                    <BarChart data={[
                      { name: 'Revenue', val: scenarios.offline.revenueProj, fill: '#10b981' },
                      { name: 'Cost', val: scenarios.offline.costProj, fill: '#f43f5e' }
                    ]} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                      <XAxis type="number" stroke="#94a3b8" hide />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" width={60} />
                      <Tooltip cursor={{fill: '#334155', opacity: 0.2}} contentStyle={{backgroundColor: '#1e293b'}} />
                      <Bar dataKey="val" radius={[0, 4, 4, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <Card className="bg-slate-800/50">
               <InsightBox 
                  title="Scenario Analysis AI"
                  text={scenarioInsight} 
                  isLoading={loadingAI === AnalysisType.SCENARIO}
                  onAnalyze={() => handleAnalyze(AnalysisType.SCENARIO, scenarios, setScenarioInsight)}
                />
            </Card>
          </>
        )}

        {/* VIEW: DECISION */}
        {activeTab === 'decision' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card title="Section 5: Risk Radar" className="col-span-1">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                    { subject: 'Market Volatility', A: 80, B: 50, fullMark: 100 },
                    { subject: 'Cost Risk', A: 70, B: 40, fullMark: 100 },
                    { subject: 'Comp. Pressure', A: 90, B: 60, fullMark: 100 },
                    { subject: 'Ops Complexity', A: 50, B: 85, fullMark: 100 },
                    { subject: 'Upside Potential', A: 95, B: 45, fullMark: 100 },
                  ]}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" />
                    <Radar name="Online" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                    <Radar name="Offline" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                    <Legend />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="col-span-1 lg:col-span-2 space-y-6">
               <Card title="Section 6: Strategic Summary Panel" className="bg-slate-800 border-l-4 border-l-indigo-500">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 bg-slate-700/30 p-4 rounded-lg">
                      <h4 className="text-indigo-400 font-bold mb-2">Option 1: Digital Aggression</h4>
                      <ul className="text-sm text-slate-300 space-y-2 list-disc pl-4">
                         <li>High ROI Potential ({scenarios.online.roi}%)</li>
                         <li>High Initial CAPEX Risk</li>
                         <li>Mitigation: Start with regional A/B testing</li>
                      </ul>
                    </div>
                    <div className="flex-1 bg-slate-700/30 p-4 rounded-lg">
                      <h4 className="text-emerald-400 font-bold mb-2">Option 2: Physical Consolidation</h4>
                      <ul className="text-sm text-slate-300 space-y-2 list-disc pl-4">
                         <li>Lower ROI ({scenarios.offline.roi}%) but safer</li>
                         <li>Dependent on footfall recovery</li>
                         <li>Mitigation: Short-term leases only</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-slate-700 pt-4">
                     <h3 className="text-white font-semibold flex items-center mb-2">
                        <Zap className="w-4 h-4 text-yellow-400 mr-2" />
                        AI Strategic Recommendation
                     </h3>
                     {loadingAI === AnalysisType.FINAL_DECISION ? (
                       <AILoadingState />
                     ) : (
                       <div className="bg-slate-900 p-4 rounded text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                         {snapshotInsight ? 
                           snapshotInsight.replace(/^/gm, '> ') : // Re-using snapshot variable for demo simplicity, in real app use dedicated state
                           "The AI is ready to synthesize all data points (Sales, Scenarios, Risks) into a final executive decision."}
                       </div>
                     )}
                     <button 
                        onClick={() => handleAnalyze(AnalysisType.FINAL_DECISION, { sales: lastMonth, scenarios, risk: 'High Volatility in Q3' }, setSnapshotInsight)}
                        className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded transition-all"
                      >
                        Generate Final Executive Decision
                      </button>
                  </div>
               </Card>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;