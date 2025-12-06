export interface MonthlyData {
  month: string;
  onlineSales: number;
  offlineSales: number;
  totalSales: number;
  onlineGrowth: number;
  offlineGrowth: number;
  uncertaintyIndex: number; // 0-100
  seasonalFactor: number;
}

export interface ScenarioResult {
  name: string;
  revenueProj: number;
  costProj: number;
  roi: number;
  riskScore: number;
  description: string;
}

export interface EarlyWarningMetric {
  name: string;
  value: number; // 0-100 normalized
  trend: 'up' | 'down' | 'stable';
  category: 'online' | 'offline';
}

export enum AnalysisType {
  SNAPSHOT = 'SNAPSHOT',
  TREND = 'TREND',
  SCENARIO = 'SCENARIO',
  RISK = 'RISK',
  FINAL_DECISION = 'FINAL_DECISION'
}
