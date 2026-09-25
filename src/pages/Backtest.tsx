import { backtestResult } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, AreaChart, Area } from 'recharts';
import { AlertTriangle, BarChart3 } from 'lucide-react';

// Generate equity curve
function generateEquityCurve(result: typeof backtestResult) {
  const data = [];
  let equity = 10000;
  for (let i = 0; i < result.tradeCount; i++) {
    const win = Math.random() < result.winRate / 100;
    equity += win ? result.averageWin : result.averageLoss;
    data.push({ trade: i + 1, equity: Number(equity.toFixed(2)) });
  }
  return data;
}

export default function Backtest() {
  const equityCurve = generateEquityCurve(backtestResult);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Бэктест</h1>
        <p className="text-xs text-[#6b6b73] mt-1">Event-driven бэктест с реалистичными издержками. NO LOOK-AHEAD. Данные: DEMO</p>
      </div>

      {/* Warnings */}
      {backtestResult.warnings.length > 0 && (
        <div className="card border-[#f59e0b]/30 bg-[#f59e0b]/5">
          <div className="flex items-start gap-3">
            <AlertTriangle size={16} className="text-[#f59e0b] mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <div className="text-xs font-medium text-[#f59e0b]">ПРЕДУПРЕЖДЕНИЯ</div>
              {backtestResult.warnings.map((w, i) => (
                <div key={i} className="text-[11px] text-[#a0a0a8]">• {w}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <MetricCard label="Net Profit" value={`$${backtestResult.netProfit.toFixed(2)}`} tooltip="Чистая прибыль после всех издержек (спред, комиссия, проскальзывание)" positive={backtestResult.netProfit > 0} />
        <MetricCard label="Profit Factor" value={backtestResult.profitFactor.toFixed(2)} tooltip="Gross Profit / Gross Loss. > 1.5 считается приемлемым" positive={backtestResult.profitFactor > 1.5} />
        <MetricCard label="Expectancy" value={`$${backtestResult.expectancy.toFixed(2)}`} tooltip="Математическое ожидание на сделку. Основная исследовательская метрика" positive={backtestResult.expectancy > 0} />
        <MetricCard label="Expectancy (costs)" value={`$${backtestResult.expectancyAfterCosts.toFixed(2)}`} tooltip="Мат. ожидание ПОСЛЕ учёта реалистичных издержек. Если отрицательное — стратегия непригодна" positive={backtestResult.expectancyAfterCosts > 0} />
        <MetricCard label="Win Rate" value={`${backtestResult.winRate}%`} tooltip="Процент прибыльных сделок. Сама по себе не определяет качество стратегии" positive={backtestResult.winRate > 50} />
        <MetricCard label="Max Drawdown" value={`${backtestResult.maxDrawdown}%`} tooltip="Максимальная просадка от пика эквити. Критическая метрика риска" positive={backtestResult.maxDrawdown < 10} />
      </div>

      {/* Equity Curve */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={14} className="text-[#d4a017]" />
          <span className="text-xs font-medium text-[#a0a0a8]">КРИВАЯ ЭКВИТИ</span>
          <span className="tooltip-wrapper">
            <span className="text-[10px] text-[#6b6b73] cursor-help">ⓘ</span>
            <span className="tooltip-content">Накопительный результат по сделкам. Демонстрирует стабильность роста и глубину просадок. Симулированная кривая на основе статистики бэктеста</span>
          </span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={equityCurve} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
              <defs>
                <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4a017" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#d4a017" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 2" stroke="#26262a" />
              <XAxis dataKey="trade" tick={{ fontSize: 10, fill: '#6b6b73' }} label={{ value: 'Сделки', position: 'bottom', fill: '#6b6b73', fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10, fill: '#6b6b73' }} domain={['auto', 'auto']} />
              <RechartsTooltip
                contentStyle={{ background: '#1a1a1d', border: '1px solid #26262a', borderRadius: 6, fontSize: 11 }}
                labelStyle={{ color: '#a0a0a8' }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Эквити']}
                labelFormatter={(l) => `Сделка #${l}`}
              />
              <Area type="monotone" dataKey="equity" stroke="#d4a017" fill="url(#equityGrad)" strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <div className="text-xs font-medium text-[#a0a0a8] mb-3">ПРОФИЛЬ ПРИБЫЛИ/УБЫТКОВ</div>
          <div className="space-y-2">
            <StatRow label="Gross Profit" value={`$${backtestResult.grossProfit.toFixed(2)}`} tooltip="Суммарная прибыль всех прибыльных сделок" />
            <StatRow label="Gross Loss" value={`$${backtestResult.grossLoss.toFixed(2)}`} tooltip="Суммарный убыток всех убыточных сделок" />
            <StatRow label="Average Win" value={`$${backtestResult.averageWin.toFixed(2)}`} tooltip="Средняя прибыль на прибыльную сделку" />
            <StatRow label="Average Loss" value={`$${backtestResult.averageLoss.toFixed(2)}`} tooltip="Средний убыток на убыточную сделку" />
            <StatRow label="Profit/Trade" value={`$${backtestResult.profitPerTrade.toFixed(2)}`} tooltip="Средняя прибыль на сделку (включая убыточные)" />
            <StatRow label="Recovery Factor" value={backtestResult.recoveryFactor.toFixed(2)} tooltip="Net Profit / Max Drawdown. Способность восстанавливаться после просадки" />
          </div>
        </div>
        <div className="card">
          <div className="text-xs font-medium text-[#a0a0a8] mb-3">РИСКОВЫЕ МЕТРИКИ</div>
          <div className="space-y-2">
            <StatRow label="Sharpe Ratio" value={backtestResult.sharpe.toFixed(2)} tooltip="Доходность с поправкой на риск. > 1.0 — приемлемо, > 2.0 — хорошо" />
            <StatRow label="Sortino Ratio" value={backtestResult.sortino.toFixed(2)} tooltip="Как Sharpe, но учитывает только негативную волатильность" />
            <StatRow label="Calmar Ratio" value={backtestResult.calmar.toFixed(2)} tooltip="Годовая доходность / Max Drawdown" />
            <StatRow label="Avg Drawdown" value={`${backtestResult.avgDrawdown}%`} tooltip="Средняя глубина просадки" />
            <StatRow label="MAE" value={`$${backtestResult.mae.toFixed(2)}`} tooltip="Maximum Adverse Excursion — максимальное неблагоприятное отклонение по открытым сделкам" />
            <StatRow label="MFE" value={`$${backtestResult.mfe.toFixed(2)}`} tooltip="Maximum Favorable Excursion — максимальное благоприятное отклонение" />
          </div>
        </div>
      </div>

      {/* Streaks & Sample */}
      <div className="card">
        <div className="text-xs font-medium text-[#a0a0a8] mb-3">СЕРИИ И ВЫБОРКА</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#1a1a1d] rounded-md p-3">
            <div className="text-[10px] text-[#6b6b73] mb-1">Сделок</div>
            <div className="text-sm font-mono text-[#e5e5e5]">{backtestResult.tradeCount}</div>
          </div>
          <div className="bg-[#1a1a1d] rounded-md p-3">
            <div className="text-[10px] text-[#6b6b73] mb-1">Макс. серия побед</div>
            <div className="text-sm font-mono text-[#22c55e]">{backtestResult.longestWinningStreak}</div>
          </div>
          <div className="bg-[#1a1a1d] rounded-md p-3">
            <div className="text-[10px] text-[#6b6b73] mb-1">Макс. серия убытков</div>
            <div className="text-sm font-mono text-[#ef4444]">{backtestResult.longestLosingStreak}</div>
          </div>
          <div className="bg-[#1a1a1d] rounded-md p-3">
            <div className="text-[10px] text-[#6b6b73] mb-1">Размер выборки</div>
            <div className="text-[10px] text-[#f59e0b]">{backtestResult.sampleSize}</div>
          </div>
        </div>
      </div>

      {/* Backtest Configuration */}
      <div className="card">
        <div className="text-xs font-medium text-[#a0a0a8] mb-3">ПАРАМЕТРЫ БЭКТЕСТА</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
          <div><span className="text-[#6b6b73]">Символ:</span> <span className="text-[#e5e5e5] font-mono">XAUUSD</span></div>
          <div><span className="text-[#6b6b73]">Период:</span> <span className="text-[#e5e5e5] font-mono">2024-01 — 2024-09</span></div>
          <div><span className="text-[#6b6b73]">Стратегия:</span> <span className="text-[#e5e5e5] font-mono">TrendFollow v0.3.1</span></div>
          <div><span className="text-[#6b6b73]">Таймфреймы:</span> <span className="text-[#e5e5e5] font-mono">M1, M5, M15, H1</span></div>
          <div><span className="text-[#6b6b73]">Модель спреда:</span> <span className="text-[#e5e5e5] font-mono">Variable + 20% buffer</span></div>
          <div><span className="text-[#6b6b73]">Проскальзывание:</span> <span className="text-[#e5e5e5] font-mono">10 pts</span></div>
          <div><span className="text-[#6b6b73]">Комиссия:</span> <span className="text-[#e5e5e5] font-mono">$2.80/lot</span></div>
          <div><span className="text-[#6b6b73]">Look-ahead:</span> <span className="text-[#22c55e] font-mono">TEST PASSED</span></div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, tooltip, positive }: { label: string; value: string; tooltip: string; positive: boolean }) {
  return (
    <div className="tooltip-wrapper">
      <div className="card card-hover">
        <div className="text-[10px] text-[#6b6b73] mb-1">{label}</div>
        <div className={`text-sm font-mono font-semibold ${positive ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>{value}</div>
      </div>
      <div className="tooltip-content">{tooltip}</div>
    </div>
  );
}

function StatRow({ label, value, tooltip }: { label: string; value: string; tooltip: string }) {
  return (
    <div className="tooltip-wrapper w-full">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[#6b6b73] cursor-help">{label}</span>
        <span className="text-xs font-mono text-[#e5e5e5]">{value}</span>
      </div>
      <div className="tooltip-content">{tooltip}</div>
    </div>
  );
}
