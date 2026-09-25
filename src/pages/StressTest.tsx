import { stressTestResults } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import { AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';

export default function StressTest() {
  const chartData = stressTestResults.map(r => ({
    name: r.scenario.length > 20 ? r.scenario.slice(0, 20) + '...' : r.scenario,
    fullName: r.scenario,
    profit: r.profit,
    status: r.status,
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Стресс-тесты</h1>
        <p className="text-xs text-[#6b6b73] mt-1">Тестирование стратегии в экстремальных условиях. Стратегия не считается robust только по идеальному бэктесту.</p>
      </div>

      {/* Warning */}
      <div className="card border-[#f59e0b]/30 bg-[#f59e0b]/5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={16} className="text-[#f59e0b] mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs font-medium text-[#f59e0b]">ЧУВСТВИТЕЛЬНОСТЬ К ИЗДЕРЖКАМ</div>
            <div className="text-[11px] text-[#a0a0a8] mt-1">
              При удвоении спреда прибыль снижается на ~54%. При тройном проскальзывании — на ~60%.
              Стратегия чувствительна к торговым издержкам. Рекомендуется проверка у конкретного брокера.
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-medium text-[#a0a0a8]">ПРИБЫЛЬ ПО СЦЕНАРИЯМ</span>
          <span className="tooltip-wrapper">
            <span className="text-[10px] text-[#6b6b73] cursor-help">ⓘ</span>
            <span className="tooltip-content">Сравнение прибыли в разных стресс-сценариях. Базовый = обычный бэктест. Остальные — модифицированные условия</span>
          </span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 120 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#26262a" />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#6b6b73' }} tickFormatter={(v) => `$${v}`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: '#a0a0a8' }} width={120} />
              <RechartsTooltip
                contentStyle={{ background: '#1a1a1d', border: '1px solid #26262a', borderRadius: 6, fontSize: 11 }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Прибыль']}
                labelFormatter={(l) => {
                  const item = chartData.find(d => d.name === l);
                  return item?.fullName || l;
                }}
              />
              <Bar dataKey="profit" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.status === 'BASELINE' ? '#3b82f6' : entry.status === 'PASS' ? '#22c55e' : entry.status === 'MARGINAL' ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Results Table */}
      <div className="card">
        <div className="text-xs font-medium text-[#a0a0a8] mb-4">РЕЗУЛЬТАТЫ СТРЕСС-ТЕСТОВ</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#26262a]">
                <th className="text-left py-2 text-[#6b6b73] font-medium">Сценарий</th>
                <th className="text-right py-2 text-[#6b6b73] font-medium">Прибыль</th>
                <th className="text-right py-2 text-[#6b6b73] font-medium">Просадка</th>
                <th className="text-right py-2 text-[#6b6b73] font-medium">Sharpe</th>
                <th className="text-right py-2 text-[#6b6b73] font-medium">Δ от базового</th>
                <th className="text-center py-2 text-[#6b6b73] font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              {stressTestResults.map((r, i) => {
                const delta = ((r.profit - stressTestResults[0].profit) / stressTestResults[0].profit * 100);
                return (
                  <tr key={i} className="border-b border-[#26262a]/50 hover:bg-[#1a1a1d]/50">
                    <td className="py-2 text-[#e5e5e5]">
                      <span className="tooltip-wrapper">
                        <span className="cursor-help">{r.scenario}</span>
                        <span className="tooltip-content">
                          {r.scenario === 'Базовый бэктест' && 'Стандартные условия бэктеста с реалистичными издержками'}
                          {r.scenario.includes('Спред') && 'Увеличенный спред. Проверяет чувствительность к торговым издержкам'}
                          {r.scenario.includes('Проскальзывание') && 'Увеличенное проскальзывание. Проверяет чувствительность к качеству исполнения'}
                          {r.scenario.includes('Задержка') && 'Дополнительная задержка исполнения. Проверяет чувствительность к латентности'}
                          {r.scenario.includes('Пропущенные') && 'Случайно пропущенные сделки. Проверяет устойчивость к пропускам сигналов'}
                          {r.scenario.includes('волатильность') && 'Экстремальный режим волатильности'}
                          {r.scenario.includes('Серия') && 'Дополнительная серия убытков в начале'}
                        </span>
                      </span>
                    </td>
                    <td className={`py-2 text-right font-mono ${r.profit >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                      ${r.profit.toFixed(2)}
                    </td>
                    <td className="py-2 text-right font-mono text-[#f59e0b]">{r.drawdown}%</td>
                    <td className={`py-2 text-right font-mono ${r.sharpe >= 1 ? 'text-[#22c55e]' : r.sharpe >= 0 ? 'text-[#f59e0b]' : 'text-[#ef4444]'}`}>
                      {r.sharpe.toFixed(2)}
                    </td>
                    <td className={`py-2 text-right font-mono ${delta >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                      {delta >= 0 ? '+' : ''}{delta.toFixed(1)}%
                    </td>
                    <td className="py-2 text-center"><StatusBadge status={r.status} size="sm" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conclusion */}
      <div className="card">
        <div className="text-xs font-medium text-[#a0a0a8] mb-3">ВЫВОДЫ</div>
        <div className="space-y-2 text-[11px] text-[#a0a0a8]">
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] mt-1.5 flex-shrink-0" />
            <span>Стратегия остаётся прибыльной при увеличении спреда до ×1.5 и проскальзывания до ×2</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] mt-1.5 flex-shrink-0" />
            <span>При экстремальных издержках (спред ×2, slippage ×3) прибыль снижается на 54-60% — MARGINAL</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] mt-1.5 flex-shrink-0" />
            <span>Чувствительность к волатильности: в HIGH VOL просадка увеличивается до 12.3%</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] mt-1.5 flex-shrink-0" />
            <span>Стратегия НЕ считается robust — требуется улучшение устойчивости к издержкам</span>
          </div>
        </div>
      </div>
    </div>
  );
}
