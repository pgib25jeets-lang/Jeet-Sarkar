import { MonthlyData, EarlyWarningMetric, ScenarioResult } from '../types';

export const generateHistoricalData = (): MonthlyData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const baseOnline = 45000;
  const baseOffline = 60000;
  
  return months.map((m, i) => {
    // Volatility simulation
    const volatility = Math.random() * 0.4 - 0.2; // +/- 20%
    const seasonal = (m === 'Aug' || m === 'Sep') ? 1.4 : 1.0; // Back to school peak
    
    const onlineVal = Math.floor(baseOnline * (1 + (i * 0.02)) * (1 + volatility) * seasonal);
    const offlineVal = Math.floor(baseOffline * (1 - (i * 0.01)) * (1 + (volatility * 0.5)) * seasonal);
    
    return {
      month: `${m}-${i < 12 ? '23' : '24'}`,
      onlineSales: onlineVal,
      offlineSales: offlineVal,
      totalSales: onlineVal + offlineVal,
      onlineGrowth: Math.floor(Math.random() * 10 - 2),
      offlineGrowth: Math.floor(Math.random() * 10 - 5),
      uncertaintyIndex: Math.floor(Math.random() * 100),
      seasonalFactor: seasonal
    };
  });
};

export const earlyWarningMetrics: EarlyWarningMetric[] = [
  { name: 'Website Traffic', value: 78, trend: 'up', category: 'online' },
  { name: 'Store Footfall', value: 42, trend: 'down', category: 'offline' },
  { name: 'Online Search Volume', value: 85, trend: 'up', category: 'online' },
  { name: 'Competitor Discounts', value: 65, trend: 'stable', category: 'offline' },
];

export const getScenarios = (): { online: ScenarioResult, offline: ScenarioResult } => ({
  online: {
    name: "Scenario A: Digital Surge",
    revenueProj: 1200000,
    costProj: 450000,
    roi: 166,
    riskScore: 65,
    description: "Assumes 20% growth in e-commerce adoption. High initial marketing spend."
  },
  offline: {
    name: "Scenario B: Retail Recovery",
    revenueProj: 950000,
    costProj: 300000,
    roi: 216,
    riskScore: 40,
    description: "Assumes +10% footfall return. Lower CapEx but capped upside."
  }
});
