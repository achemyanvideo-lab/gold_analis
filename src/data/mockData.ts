// GOLD QUANT — Demo Data
// Все данные помечены как DEMO. Реальные данные поступают из MT5 через Python backend.
// В веб-интерфейсе отображаются симулированные значения для демонстрации UI.

export interface SystemStatus {
  mode: 'RESEARCH' | 'BACKTEST' | 'PAPER' | 'LIVE';
  liveTrading: boolean;
  mt5Connected: boolean;
  dataFeed: 'LIVE' | 'DELAYED' | 'STALE' | 'UNAVAILABLE' | 'DEMO';
  database: 'OK' | 'ERROR' | 'UNAVAILABLE';
  externalData: 'OK' | 'DEGRADED' | 'UNAVAILABLE' | 'DEMO';
}

export interface MarketData {
  symbol: string;
  symbolDetected: string;
  bid: number;
  ask: number;
  spread: number;
  spreadPoints: number;
  lastPrice: number;
  tickVolume: number;
  realVolume: 'UNAVAILABLE' | number;
  point: number;
  digits: number;
  contractSize: number;
  minLot: number;
  maxLot: number;
  lotStep: number;
  stopsLevel: number;
  freezeLevel: number;
  timestamp: string;
  dataStatus: 'VALID' | 'STALE' | 'MISSING' | 'DEMO';
}

export interface RegimeState {
  regime: string;
  structure: string;
  momentum: string;
  volatility: string;
  volume: string;
  liquidity: string;
  confidence: number;
  timestamp: string;
}

export interface SignalData {
  direction: 'BUY' | 'SELL' | 'WAIT' | 'NO_TRADE';
  strategy: string;
  strategyVersion: string;
  entryZone: string;
  invalidation: string;
  stopLoss: number;
  takeProfit: number;
  riskReward: number;
  setupScore: number;
  regime: string;
  reasons: string[];
  conditionsMet: string[];
  conditionsFailed: string[];
  riskDecision: 'APPROVED' | 'REJECTED' | 'PENDING';
  riskReason?: string;
  finalDecision: string;
  timestamp: string;
}

export interface RiskMetrics {
  riskPerTrade: number;
  dailyRiskUsed: number;
  dailyRiskLimit: number;
  weeklyRiskUsed: number;
  weeklyRiskLimit: number;
  maxDrawdown: number;
  maxDrawdownLimit: number;
  currentDrawdown: number;
  consecutiveLosses: number;
  maxConsecutiveLosses: number;
  openPositions: number;
  maxOpenPositions: number;
  positionSize: number;
  accountEquity: number;
  killSwitchActive: boolean;
  tradingHalted: boolean;
  capitalMode: 'NORMAL' | 'REDUCED_RISK' | 'HALTED' | 'RECOVERY';
}

export interface BacktestResult {
  netProfit: number;
  grossProfit: number;
  grossLoss: number;
  profitFactor: number;
  expectancy: number;
  expectancyAfterCosts: number;
  winRate: number;
  averageWin: number;
  averageLoss: number;
  maxDrawdown: number;
  avgDrawdown: number;
  recoveryFactor: number;
  sharpe: number;
  sortino: number;
  calmar: number;
  tradeCount: number;
  profitPerTrade: number;
  mae: number;
  mfe: number;
  longestLosingStreak: number;
  longestWinningStreak: number;
  sampleSize: string;
  warnings: string[];
}

export interface Trade {
  id: string;
  timestamp: string;
  direction: 'BUY' | 'SELL';
  entry: number;
  exit: number;
  stopLoss: number;
  takeProfit: number;
  positionSize: number;
  pnl: number;
  pnlPercent: number;
  strategy: string;
  regime: string;
  exitReason: string;
  quality: 'GOOD_WIN' | 'BAD_WIN' | 'GOOD_LOSS' | 'BAD_LOSS';
  slippage: number;
  commission: number;
}

export interface WalkForwardWindow {
  id: number;
  trainStart: string;
  trainEnd: string;
  testStart: string;
  testEnd: string;
  trades: number;
  profit: number;
  drawdown: number;
  sharpe: number;
  status: 'PASS' | 'FAIL' | 'MARGINAL';
}

// Demo system status
export const systemStatus: SystemStatus = {
  mode: 'PAPER',
  liveTrading: false,
  mt5Connected: false,
  dataFeed: 'DEMO',
  database: 'OK',
  externalData: 'DEMO',
};

// Demo market data
export const marketData: MarketData = {
  symbol: 'XAUUSD',
  symbolDetected: 'DEMO — MT5 не подключён',
  bid: 2341.52,
  ask: 2341.87,
  spread: 0.35,
  spreadPoints: 35,
  lastPrice: 2341.70,
  tickVolume: 12847,
  realVolume: 'UNAVAILABLE',
  point: 0.01,
  digits: 2,
  contractSize: 100,
  minLot: 0.01,
  maxLot: 100,
  lotStep: 0.01,
  stopsLevel: 0,
  freezeLevel: 0,
  timestamp: new Date().toISOString(),
  dataStatus: 'DEMO',
};

// Demo regime
export const regimeState: RegimeState = {
  regime: 'TREND_UP',
  structure: 'BULLISH',
  momentum: 'STRONG',
  volatility: 'NORMAL',
  volume: 'ABOVE_AVG',
  liquidity: 'SWEEP_DETECTED',
  confidence: 0.72,
  timestamp: new Date().toISOString(),
};

// Demo signal
export const signalData: SignalData = {
  direction: 'BUY',
  strategy: 'TrendFollowStrategy',
  strategyVersion: 'v0.3.1',
  entryZone: '2340.50 — 2341.20',
  invalidation: 'Структура сломлена ниже 2338.00',
  stopLoss: 2336.80,
  takeProfit: 2352.40,
  riskReward: 2.4,
  setupScore: 74,
  regime: 'TREND_UP',
  reasons: [
    'H1 структура бычья (HH + HL)',
    'M15 откат к зоне поддержки',
    'M5 свечной паттерн поглощения',
    'Импульс восстанавливается после коррекции',
    'Волатильность в нормальном диапазоне',
    'DXY ослабевает (поддерживающий фактор)',
    'Ликвидность ниже 2339.00 собрана',
  ],
  conditionsMet: [
    'DATA_QUALITY = VALID',
    'REGIME_ALLOWED = TRUE',
    'SETUP_VALID = TRUE',
    'SIGNAL_VALID = TRUE',
    'INVALIDATION_DEFINED = TRUE',
    'SPREAD_ACCEPTABLE = TRUE',
    'NEWS_POLICY = NORMAL',
  ],
  conditionsFailed: [],
  riskDecision: 'APPROVED',
  finalDecision: 'BUY (Paper)',
  timestamp: new Date().toISOString(),
};

// Demo risk
export const riskMetrics: RiskMetrics = {
  riskPerTrade: 1.0,
  dailyRiskUsed: 0,
  dailyRiskLimit: 3.0,
  weeklyRiskUsed: 1.0,
  weeklyRiskLimit: 6.0,
  maxDrawdown: 10.0,
  maxDrawdownLimit: 15.0,
  currentDrawdown: 2.3,
  consecutiveLosses: 0,
  maxConsecutiveLosses: 5,
  openPositions: 0,
  maxOpenPositions: 2,
  positionSize: 0.03,
  accountEquity: 10000,
  killSwitchActive: false,
  tradingHalted: false,
  capitalMode: 'NORMAL',
};

// Demo backtest
export const backtestResult: BacktestResult = {
  netProfit: 847.32,
  grossProfit: 2134.56,
  grossLoss: -1287.24,
  profitFactor: 1.66,
  expectancy: 12.1,
  expectancyAfterCosts: 8.47,
  winRate: 52.8,
  averageWin: 40.24,
  averageLoss: -24.38,
  maxDrawdown: 6.8,
  avgDrawdown: 2.1,
  recoveryFactor: 2.8,
  sharpe: 1.24,
  sortino: 1.87,
  calmar: 1.95,
  tradeCount: 70,
  profitPerTrade: 12.1,
  mae: -18.4,
  mfe: 32.7,
  longestLosingStreak: 4,
  longestWinningStreak: 6,
  sampleSize: '70 сделок — НИЖЕ МИНИМАЛЬНОГО ПОРОГА (рекомендуется 200+)',
  warnings: [
    'ВЫБОРКА МАЛА: 70 сделок. Статистическая значимость не подтверждена.',
    'OVERFITTING RISK = MEDIUM: стратегия содержит 8 параметров.',
    'OOS EXPECTANCY ниже in-sample на 34%.',
    'Рекомендуется дополнительная walk-forward валидация.',
  ],
};

// Demo walk-forward windows
export const walkForwardWindows: WalkForwardWindow[] = [
  { id: 1, trainStart: '2024-01', trainEnd: '2024-03', testStart: '2024-04', testEnd: '2024-04', trades: 12, profit: 145.2, drawdown: 2.1, sharpe: 1.1, status: 'PASS' },
  { id: 2, trainStart: '2024-02', trainEnd: '2024-04', testStart: '2024-05', testEnd: '2024-05', trades: 9, profit: -34.8, drawdown: 3.4, sharpe: -0.3, status: 'FAIL' },
  { id: 3, trainStart: '2024-03', trainEnd: '2024-05', testStart: '2024-06', testEnd: '2024-06', trades: 14, profit: 201.5, drawdown: 1.8, sharpe: 1.5, status: 'PASS' },
  { id: 4, trainStart: '2024-04', trainEnd: '2024-06', testStart: '2024-07', testEnd: '2024-07', trades: 11, profit: 87.3, drawdown: 2.9, sharpe: 0.8, status: 'MARGINAL' },
  { id: 5, trainStart: '2024-05', trainEnd: '2024-07', testStart: '2024-08', testEnd: '2024-08', trades: 8, profit: -52.1, drawdown: 4.2, sharpe: -0.5, status: 'FAIL' },
  { id: 6, trainStart: '2024-06', trainEnd: '2024-08', testStart: '2024-09', testEnd: '2024-09', trades: 16, profit: 234.7, drawdown: 1.5, sharpe: 1.8, status: 'PASS' },
];

// Demo trades
export const demoTrades: Trade[] = [
  { id: 'T-001', timestamp: '2024-09-15 09:32', direction: 'BUY', entry: 2312.40, exit: 2324.80, stopLoss: 2308.00, takeProfit: 2328.00, positionSize: 0.03, pnl: 37.2, pnlPercent: 0.37, strategy: 'TrendFollow', regime: 'TREND_UP', exitReason: 'TAKE_PROFIT', quality: 'GOOD_WIN', slippage: 0.12, commission: 0.84 },
  { id: 'T-002', timestamp: '2024-09-15 14:18', direction: 'SELL', entry: 2326.10, exit: 2322.50, stopLoss: 2330.00, takeProfit: 2318.00, positionSize: 0.02, pnl: 7.2, pnlPercent: 0.07, strategy: 'MeanReversion', regime: 'RANGE', exitReason: 'TAKE_PROFIT', quality: 'GOOD_WIN', slippage: 0.08, commission: 0.56 },
  { id: 'T-003', timestamp: '2024-09-16 10:05', direction: 'BUY', entry: 2318.90, exit: 2314.20, stopLoss: 2315.00, takeProfit: 2328.00, positionSize: 0.03, pnl: -14.1, pnlPercent: -0.14, strategy: 'TrendFollow', regime: 'TRANSITION', exitReason: 'STOP_LOSS', quality: 'GOOD_LOSS', slippage: 0.15, commission: 0.84 },
  { id: 'T-004', timestamp: '2024-09-16 15:42', direction: 'BUY', entry: 2315.80, exit: 2329.40, stopLoss: 2311.00, takeProfit: 2330.00, positionSize: 0.03, pnl: 40.8, pnlPercent: 0.41, strategy: 'TrendFollow', regime: 'TREND_UP', exitReason: 'TAKE_PROFIT', quality: 'GOOD_WIN', slippage: 0.10, commission: 0.84 },
  { id: 'T-005', timestamp: '2024-09-17 08:15', direction: 'SELL', entry: 2331.20, exit: 2335.80, stopLoss: 2336.00, takeProfit: 2322.00, positionSize: 0.02, pnl: -9.2, pnlPercent: -0.09, strategy: 'Breakout', regime: 'BREAKOUT', exitReason: 'STOP_LOSS', quality: 'BAD_LOSS', slippage: 0.22, commission: 0.56 },
];

// Generate demo price series
export function generatePriceSeries(points: number, basePrice: number = 2340): { time: string; price: number; volume: number }[] {
  const data = [];
  let price = basePrice;
  const now = Date.now();
  for (let i = points; i >= 0; i--) {
    const change = (Math.random() - 0.48) * 2.5;
    price = Math.max(price + change, basePrice - 30);
    price = Math.min(price, basePrice + 30);
    data.push({
      time: new Date(now - i * 60000 * 5).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      price: Number(price.toFixed(2)),
      volume: Math.floor(Math.random() * 500 + 100),
    });
  }
  return data;
}

// Monte Carlo simulation results
export function generateMonteCarloPaths(count: number = 50, trades: number = 70): number[][] {
  const paths: number[][] = [];
  for (let i = 0; i < count; i++) {
    const path: number[] = [10000];
    for (let t = 0; t < trades; t++) {
      const win = Math.random() < 0.528;
      const pnl = win ? (Math.random() * 30 + 10) : -(Math.random() * 20 + 5);
      path.push(path[path.length - 1] + pnl);
    }
    paths.push(path);
  }
  return paths;
}

// Stress test scenarios
export const stressTestResults = [
  { scenario: 'Базовый бэктест', profit: 847.32, drawdown: 6.8, sharpe: 1.24, status: 'BASELINE' },
  { scenario: 'Спред × 1.5', profit: 612.45, drawdown: 7.9, sharpe: 0.95, status: 'PASS' },
  { scenario: 'Спред × 2.0', profit: 387.12, drawdown: 9.4, sharpe: 0.62, status: 'MARGINAL' },
  { scenario: 'Проскальзывание × 2', profit: 598.87, drawdown: 8.1, sharpe: 0.88, status: 'PASS' },
  { scenario: 'Проскальзывание × 3', profit: 342.41, drawdown: 10.2, sharpe: 0.51, status: 'MARGINAL' },
  { scenario: 'Задержка исполнения 500мс', profit: 712.34, drawdown: 7.5, sharpe: 1.05, status: 'PASS' },
  { scenario: 'Пропущенные сделки 10%', profit: 689.21, drawdown: 8.8, sharpe: 0.92, status: 'PASS' },
  { scenario: 'Высокая волатильность', profit: 1124.56, drawdown: 12.3, sharpe: 0.89, status: 'MARGINAL' },
  { scenario: 'Низкая волатильность', profit: 234.78, drawdown: 4.1, sharpe: 0.72, status: 'MARGINAL' },
  { scenario: 'Серия убытков (5 подряд)', profit: 456.32, drawdown: 11.8, sharpe: 0.67, status: 'MARGINAL' },
];

// External context
export const externalContext = {
  dxy: { value: 103.42, change: -0.34, trend: 'WEAKENING', status: 'DEMO' as const, correlation: -0.67 },
  futures: { value: 2345.80, basis: 4.28, status: 'DEMO' as const },
  cot: { netPositioning: 142500, percentile: 72, reportDate: '2024-09-10', status: 'DELAYED' as const },
  news: { nextHighImpact: 'FOMC 2024-09-18 18:00 UTC', regime: 'NORMAL' as const, status: 'DEMO' as const },
  us10y: { value: 4.38, change: -0.02, status: 'DEMO' as const },
  vix: { value: 16.2, change: 0.8, status: 'DEMO' as const },
};
