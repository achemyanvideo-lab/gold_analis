import { demoTrades, systemStatus } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { FileText, AlertTriangle } from 'lucide-react';

// Generate equity curve from trades
function generatePaperEquity() {
  let equity = 10000;
  const data = [{ day: 'Старт', equity: 10000 }];
  demoTrades.forEach((t, i) => {
    equity += t.pnl;
    data.push({ day: `Сделка ${i + 1}`, equity: Number(equity.toFixed(2)) });
  });
  return data;
}

export default function PaperTrading() {
  const equityData = generatePaperEquity();
  const totalPnl = demoTrades.reduce((sum, t) => sum + t.pnl, 0);
  const wins = demoTrades.filter(t => t.pnl > 0).length;
  const losses = demoTrades.filter(t => t.pnl <= 0).length;
  const currentEquity = 10000 + totalPnl;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Paper Trading</h1>
          <p className="text-xs text-[#6b6b73] mt-1">Виртуальная торговля на реальных рыночных данных MT5. Максимально приближена к реальному execution.</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={systemStatus.mode} />
        </div>
      </div>

      {/* Status */}
      <div className="card border-[#3b82f6]/20 bg-[#3b82f6]/5">
        <div className="flex items-center gap-3">
          <FileText size={16} className="text-[#3b82f6]" />
          <div>
            <div className="text-sm font-medium text-[#3b82f6]">РЕЖИМ PAPER TRADING</div>
            <div className="text-[11px] text-[#a0a0a8]">
              Реальные сделки НЕ выполняются. Симулируются: спред, комиссия, проскальзывание, задержка.
              Журнал идентичен live-режиму.
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <PaperStat label="Эквити" value={`$${currentEquity.toFixed(2)}`} tooltip="Текущее виртуальное эквити" positive={totalPnl >= 0} />
        <PaperStat label="Общий P&L" value={`${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}`} tooltip="Суммарная прибыль/убыток всех paper-сделок" positive={totalPnl >= 0} />
        <PaperStat label="Сделок" value={`${demoTrades.length}`} tooltip="Общее количество paper-сделок" />
        <PaperStat label="Прибыльных" value={`${wins}`} tooltip="Количество прибыльных сделок" positive />
        <PaperStat label="Убыточных" value={`${losses}`} tooltip="Количество убыточных сделок" />
        <PaperStat label="Win Rate" value={`${(wins / demoTrades.length * 100).toFixed(1)}%`} tooltip="Процент прибыльных сделок в paper trading" positive={wins / demoTrades.length > 0.5} />
      </div>

      {/* Equity Chart */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-medium text-[#a0a0a8]">КРИВАЯ ЭКВИТИ (PAPER)</span>
          <span className="tooltip-wrapper">
            <span className="text-[10px] text-[#6b6b73] cursor-help">ⓘ</span>
            <span className="tooltip-content">Накопительный результат paper trading. Использует реальные данные MT5 с симуляцией исполнения</span>
          </span>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={equityData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
              <defs>
                <linearGradient id="paperGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 2" stroke="#26262a" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#6b6b73' }} />
              <YAxis tick={{ fontSize: 10, fill: '#6b6b73' }} domain={['auto', 'auto']} />
              <RechartsTooltip
                contentStyle={{ background: '#1a1a1d', border: '1px solid #26262a', borderRadius: 6, fontSize: 11 }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Эквити']}
              />
              <Area type="monotone" dataKey="equity" stroke="#3b82f6" fill="url(#paperGrad)" strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trades Table */}
      <div className="card">
        <div className="text-xs font-medium text-[#a0a0a8] mb-4">ЖУРНАЛ СДЕЛОК</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#26262a]">
                <th className="text-left py-2 text-[#6b6b73] font-medium">ID</th>
                <th className="text-left py-2 text-[#6b6b73] font-medium">Время</th>
                <th className="text-center py-2 text-[#6b6b73] font-medium">Напр.</th>
                <th className="text-right py-2 text-[#6b6b73] font-medium">Вход</th>
                <th className="text-right py-2 text-[#6b6b73] font-medium">Выход</th>
                <th className="text-right py-2 text-[#6b6b73] font-medium">Size</th>
                <th className="text-right py-2 text-[#6b6b73] font-medium">P&L</th>
                <th className="text-left py-2 text-[#6b6b73] font-medium">Выход</th>
                <th className="text-center py-2 text-[#6b6b73] font-medium">Качество</th>
              </tr>
            </thead>
            <tbody>
              {demoTrades.map(t => (
                <tr key={t.id} className="border-b border-[#26262a]/50 hover:bg-[#1a1a1d]/50">
                  <td className="py-2 font-mono text-[#e5e5e5]">{t.id}</td>
                  <td className="py-2 text-[#a0a0a8]">{t.timestamp}</td>
                  <td className="py-2 text-center"><StatusBadge status={t.direction} size="sm" /></td>
                  <td className="py-2 text-right font-mono text-[#e5e5e5]">{t.entry.toFixed(2)}</td>
                  <td className="py-2 text-right font-mono text-[#e5e5e5]">{t.exit.toFixed(2)}</td>
                  <td className="py-2 text-right font-mono text-[#a0a0a8]">{t.positionSize}</td>
                  <td className={`py-2 text-right font-mono ${t.pnl >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                    {t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(2)}
                  </td>
                  <td className="py-2 text-[#a0a0a8]">{t.exitReason}</td>
                  <td className="py-2 text-center"><StatusBadge status={t.quality} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulation Parameters */}
      <div className="card">
        <div className="text-xs font-medium text-[#a0a0a8] mb-3">ПАРАМЕТРЫ СИМУЛЯЦИИ</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
          <div><span className="text-[#6b6b73]">Спред:</span> <span className="text-[#e5e5e5]">Реальный текущий</span></div>
          <div><span className="text-[#6b6b73]">Комиссия:</span> <span className="text-[#e5e5e5]">$2.80/lot</span></div>
          <div><span className="text-[#6b6b73]">Проскальзывание:</span> <span className="text-[#e5e5e5]">5-15 pts (sim)</span></div>
          <div><span className="text-[#6b6b73]">Задержка:</span> <span className="text-[#e5e5e5]">50-200ms (sim)</span></div>
        </div>
      </div>

      {/* Warning */}
      <div className="card border-[#f59e0b]/30 bg-[#f59e0b]/5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={16} className="text-[#f59e0b] mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs font-medium text-[#f59e0b]">ВАЖНО</div>
            <div className="text-[11px] text-[#a0a0a8] mt-1">
              Paper trading результаты могут отличаться от live из-за: реального проскальзывания, изменения ликвидности,
              задержек сети, особенностей исполнения брокера. Переход PAPER → LIVE требует прохождения всех validation gates.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaperStat({ label, value, tooltip, positive }: { label: string; value: string; tooltip: string; positive?: boolean }) {
  return (
    <div className="tooltip-wrapper">
      <div className="card card-hover">
        <div className="text-[10px] text-[#6b6b73] mb-1">{label}</div>
        <div className={`text-sm font-mono font-semibold ${positive === true ? 'text-[#22c55e]' : positive === false ? 'text-[#ef4444]' : 'text-[#e5e5e5]'}`}>{value}</div>
      </div>
      <div className="tooltip-content">{tooltip}</div>
    </div>
  );
}
