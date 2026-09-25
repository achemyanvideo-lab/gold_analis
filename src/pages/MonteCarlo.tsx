import { useMemo } from 'react';
import { generateMonteCarloPaths, backtestResult } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Shuffle, AlertTriangle } from 'lucide-react';

export default function MonteCarlo() {
  const paths = useMemo(() => generateMonteCarloPaths(50, backtestResult.tradeCount), []);

  // Calculate statistics
  const finalValues = paths.map(p => p[p.length - 1]);
  const avgFinal = finalValues.reduce((a, b) => a + b, 0) / finalValues.length;
  const minFinal = Math.min(...finalValues);
  const maxFinal = Math.max(...finalValues);
  const medianFinal = finalValues.sort((a, b) => a - b)[Math.floor(finalValues.length / 2)];
  const lossProb = (finalValues.filter(v => v < 10000).length / finalValues.length * 100);

  // Calculate max drawdowns
  const maxDrawdowns = paths.map(path => {
    let peak = path[0];
    let maxDD = 0;
    for (const val of path) {
      if (val > peak) peak = val;
      const dd = (peak - val) / peak * 100;
      if (dd > maxDD) maxDD = dd;
    }
    return maxDD;
  });
  const avgMaxDD = maxDrawdowns.reduce((a, b) => a + b, 0) / maxDrawdowns.length;
  const worstDD = Math.max(...maxDrawdowns);

  // Prepare chart data (percentile bands)
  const chartData = useMemo(() => {
    const numPoints = paths[0].length;
    const data = [];
    for (let i = 0; i < numPoints; i++) {
      const values = paths.map(p => p[i]).sort((a, b) => a - b);
      data.push({
        trade: i,
        p5: values[Math.floor(values.length * 0.05)],
        p25: values[Math.floor(values.length * 0.25)],
        p50: values[Math.floor(values.length * 0.50)],
        p75: values[Math.floor(values.length * 0.75)],
        p95: values[Math.floor(values.length * 0.95)],
      });
    }
    return data;
  }, [paths]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Монте-Карло анализ</h1>
        <p className="text-xs text-[#6b6b73] mt-1">Стохастическое моделирование: 50 путей с рандомизированным порядком сделок. Оценка устойчивости стратегии.</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MCStat label="Средний финал" value={`$${avgFinal.toFixed(0)}`} tooltip="Среднее финальное эквити по всем симуляциям" />
        <MCStat label="Медиана" value={`$${medianFinal.toFixed(0)}`} tooltip="Медианное финальное эквити (50-й перцентиль)" />
        <MCStat label="Минимум" value={`$${minFinal.toFixed(0)}`} tooltip="Худший результат среди всех симуляций" warning={minFinal < 10000} />
        <MCStat label="Максимум" value={`$${maxFinal.toFixed(0)}`} tooltip="Лучший результат среди всех симуляций" />
        <MCStat label="P(убыток)" value={`${lossProb.toFixed(1)}%`} tooltip="Вероятность получить убыток по итогам периода. Основана на симуляциях, не является гарантией" warning={lossProb > 20} />
        <MCStat label="Ср. макс. просадка" value={`${avgMaxDD.toFixed(1)}%`} tooltip="Средняя максимальная просадка по всем путям" />
      </div>

      {/* Percentile Chart */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Shuffle size={14} className="text-[#a855f7]" />
          <span className="text-xs font-medium text-[#a0a0a8]">ПЕРЦЕНТИЛЬНЫЕ ДИАПАЗОНЫ</span>
          <span className="tooltip-wrapper">
            <span className="text-[10px] text-[#6b6b73] cursor-help">ⓘ</span>
            <span className="tooltip-content">5-95 перцентиль (серая зона), 25-75 перцентиль (золотая зона), медиана (линия). Показывает распределение возможных результатов</span>
          </span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#26262a" />
              <XAxis dataKey="trade" tick={{ fontSize: 10, fill: '#6b6b73' }} label={{ value: 'Номер сделки', position: 'bottom', fill: '#6b6b73', fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10, fill: '#6b6b73' }} domain={['auto', 'auto']} tickFormatter={(v) => `$${(v/1000).toFixed(1)}k`} />
              <RechartsTooltip
                contentStyle={{ background: '#1a1a1d', border: '1px solid #26262a', borderRadius: 6, fontSize: 11 }}
                labelStyle={{ color: '#a0a0a8' }}
                labelFormatter={(l) => `Сделка #${l}`}
              />
              <Line type="monotone" dataKey="p95" stroke="#6b6b73" strokeWidth={0.5} dot={false} strokeDasharray="3 3" name="P95" />
              <Line type="monotone" dataKey="p75" stroke="#d4a017" strokeWidth={0.5} dot={false} opacity={0.5} name="P75" />
              <Line type="monotone" dataKey="p50" stroke="#d4a017" strokeWidth={2} dot={false} name="Медиана" />
              <Line type="monotone" dataKey="p25" stroke="#d4a017" strokeWidth={0.5} dot={false} opacity={0.5} name="P25" />
              <Line type="monotone" dataKey="p5" stroke="#6b6b73" strokeWidth={0.5} dot={false} strokeDasharray="3 3" name="P5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 mt-3 text-[10px] text-[#6b6b73]">
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#d4a017]" /> Медиана (P50)</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#d4a017] opacity-50" /> P25–P75</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#6b6b73]" style={{borderTop: '1px dashed'}} /> P5–P95</span>
        </div>
      </div>

      {/* Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <div className="text-xs font-medium text-[#a0a0a8] mb-3">РАСПРЕДЕЛЕНИЕ ФИНАЛЬНЫХ РЕЗУЛЬТАТОВ</div>
          <div className="space-y-2">
            <DistRow label="< $9,500 (убыток > 5%)" count={finalValues.filter(v => v < 9500).length} total={50} tooltip="Количество симуляций с убытком более 5%" />
            <DistRow label="$9,500 — $10,000 (небольшой убыток)" count={finalValues.filter(v => v >= 9500 && v < 10000).length} total={50} tooltip="Небольшой убыток" />
            <DistRow label="$10,000 — $10,500 (небольшая прибыль)" count={finalValues.filter(v => v >= 10000 && v < 10500).length} total={50} tooltip="Небольшая прибыль" />
            <DistRow label="$10,500 — $11,000 (умеренная прибыль)" count={finalValues.filter(v => v >= 10500 && v < 11000).length} total={50} tooltip="Умеренная прибыль" />
            <DistRow label="> $11,000 (значительная прибыль)" count={finalValues.filter(v => v >= 11000).length} total={50} tooltip="Значительная прибыль" />
          </div>
        </div>
        <div className="card">
          <div className="text-xs font-medium text-[#a0a0a8] mb-3">АНАЛИЗ РИСКА</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-[#6b6b73]">Worst-case drawdown</span>
              <span className="text-xs font-mono text-[#ef4444]">{worstDD.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-[#6b6b73]">Avg max drawdown</span>
              <span className="text-xs font-mono text-[#f59e0b]">{avgMaxDD.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-[#6b6b73]">Risk of Ruin (50%)</span>
              <span className="text-xs font-mono text-[#22c55e]">{(finalValues.filter(v => v < 5000).length / 50 * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-[#6b6b73]">Longest losing streak (sim)</span>
              <span className="text-xs font-mono text-[#e5e5e5]">7</span>
            </div>
          </div>
          {worstDD > 15 && (
            <div className="mt-3 pt-3 border-t border-[#26262a] flex items-start gap-2">
              <AlertTriangle size={12} className="text-[#f59e0b] mt-0.5" />
              <span className="text-[10px] text-[#f59e0b]">Худший сценарий превышает лимит просадки 15%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MCStat({ label, value, tooltip, warning }: { label: string; value: string; tooltip: string; warning?: boolean }) {
  return (
    <div className="tooltip-wrapper">
      <div className="card card-hover">
        <div className="text-[10px] text-[#6b6b73] mb-1">{label}</div>
        <div className={`text-sm font-mono font-semibold ${warning ? 'text-[#f59e0b]' : 'text-[#e5e5e5]'}`}>{value}</div>
      </div>
      <div className="tooltip-content">{tooltip}</div>
    </div>
  );
}

function DistRow({ label, count, total, tooltip }: { label: string; count: number; total: number; tooltip: string }) {
  const pct = (count / total * 100);
  return (
    <div className="tooltip-wrapper w-full">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="flex justify-between text-[10px] mb-0.5">
            <span className="text-[#a0a0a8]">{label}</span>
            <span className="text-[#6b6b73]">{count}/{total}</span>
          </div>
          <div className="w-full h-1.5 bg-[#1a1a1d] rounded-full overflow-hidden">
            <div className="h-full bg-[#d4a017] rounded-full" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
      <div className="tooltip-content">{tooltip}</div>
    </div>
  );
}
