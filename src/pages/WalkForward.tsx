import { walkForwardWindows } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { GitBranch, AlertTriangle } from 'lucide-react';

export default function WalkForward() {
  const passCount = walkForwardWindows.filter(w => w.status === 'PASS').length;
  const failCount = walkForwardWindows.filter(w => w.status === 'FAIL').length;
  const marginalCount = walkForwardWindows.filter(w => w.status === 'MARGINAL').length;

  const chartData = walkForwardWindows.map(w => ({
    name: `Окно ${w.id}`,
    profit: Number(w.profit.toFixed(2)),
    status: w.status,
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Walk-Forward Analysis</h1>
        <p className="text-xs text-[#6b6b73] mt-1">Скользящая валидация: обучение → тест → сдвиг окна → повторение. Каждый результат показан честно.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card border-[#22c55e]/20">
          <div className="text-[10px] text-[#6b6b73] mb-1">PASS</div>
          <div className="text-2xl font-mono font-bold text-[#22c55e]">{passCount}</div>
          <div className="text-[10px] text-[#6b6b73]">окон прошли валидацию</div>
        </div>
        <div className="card border-[#f59e0b]/20">
          <div className="text-[10px] text-[#6b6b73] mb-1">MARGINAL</div>
          <div className="text-2xl font-mono font-bold text-[#f59e0b]">{marginalCount}</div>
          <div className="text-[10px] text-[#6b6b73]">окон на грани</div>
        </div>
        <div className="card border-[#ef4444]/20">
          <div className="text-[10px] text-[#6b6b73] mb-1">FAIL</div>
          <div className="text-2xl font-mono font-bold text-[#ef4444]">{failCount}</div>
          <div className="text-[10px] text-[#6b6b73]">окон провалили валидацию</div>
        </div>
      </div>

      {/* Warning */}
      {failCount > 0 && (
        <div className="card border-[#f59e0b]/30 bg-[#f59e0b]/5">
          <div className="flex items-start gap-3">
            <AlertTriangle size={16} className="text-[#f59e0b] mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-medium text-[#f59e0b]">ЕСТЬ ПРОВАЛЬНЫЕ ОКНА</div>
              <div className="text-[11px] text-[#a0a0a8] mt-1">
                Walk-forward показал нестабильность стратегии на некоторых периодах. Это может указывать на зависимость от конкретных рыночных условий или overfitting.
                Стратегия НЕ может быть продвинута в Champion без стабильных результатов во всех окнах.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <GitBranch size={14} className="text-[#a855f7]" />
          <span className="text-xs font-medium text-[#a0a0a8]">ПРИБЫЛЬ ПО ОКНАМ</span>
          <span className="tooltip-wrapper">
            <span className="text-[10px] text-[#6b6b73] cursor-help">ⓘ</span>
            <span className="tooltip-content">Прибыль/убыток на out-of-sample тестовом окне. Зелёный = PASS, оранжевый = MARGINAL, красный = FAIL</span>
          </span>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#26262a" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b6b73' }} />
              <YAxis tick={{ fontSize: 10, fill: '#6b6b73' }} />
              <RechartsTooltip
                contentStyle={{ background: '#1a1a1d', border: '1px solid #26262a', borderRadius: 6, fontSize: 11 }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Прибыль']}
              />
              <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.status === 'PASS' ? '#22c55e' : entry.status === 'MARGINAL' ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Windows Table */}
      <div className="card">
        <div className="text-xs font-medium text-[#a0a0a8] mb-4">ДЕТАЛИЗАЦИЯ ОКОН</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#26262a]">
                <th className="text-left py-2 text-[#6b6b73] font-medium">Окно</th>
                <th className="text-left py-2 text-[#6b6b73] font-medium">Train</th>
                <th className="text-left py-2 text-[#6b6b73] font-medium">Test</th>
                <th className="text-right py-2 text-[#6b6b73] font-medium">Сделки</th>
                <th className="text-right py-2 text-[#6b6b73] font-medium">Прибыль</th>
                <th className="text-right py-2 text-[#6b6b73] font-medium">Просадка</th>
                <th className="text-right py-2 text-[#6b6b73] font-medium">Sharpe</th>
                <th className="text-center py-2 text-[#6b6b73] font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              {walkForwardWindows.map(w => (
                <tr key={w.id} className="border-b border-[#26262a]/50 hover:bg-[#1a1a1d]/50">
                  <td className="py-2 text-[#e5e5e5] font-mono">#{w.id}</td>
                  <td className="py-2 text-[#a0a0a8] font-mono">{w.trainStart} → {w.trainEnd}</td>
                  <td className="py-2 text-[#a0a0a8] font-mono">{w.testStart} → {w.testEnd}</td>
                  <td className="py-2 text-right text-[#e5e5e5] font-mono">{w.trades}</td>
                  <td className={`py-2 text-right font-mono ${w.profit >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                    {w.profit >= 0 ? '+' : ''}${w.profit.toFixed(2)}
                  </td>
                  <td className="py-2 text-right text-[#f59e0b] font-mono">{w.drawdown}%</td>
                  <td className={`py-2 text-right font-mono ${w.sharpe >= 1 ? 'text-[#22c55e]' : w.sharpe >= 0 ? 'text-[#f59e0b]' : 'text-[#ef4444]'}`}>
                    {w.sharpe.toFixed(2)}
                  </td>
                  <td className="py-2 text-center"><StatusBadge status={w.status} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Methodology */}
      <div className="card">
        <div className="text-xs font-medium text-[#a0a0a8] mb-3">МЕТОДОЛОГИЯ</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] text-[#a0a0a8]">
          <div>
            <div className="text-[#d4a017] mb-1">TRAIN</div>
            <p>3-месячное окно для обучения/оптимизации параметров стратегии. Данные доступны только в этом периоде.</p>
          </div>
          <div>
            <div className="text-[#d4a017] mb-1">VALIDATE</div>
            <p>Внутри тренировочного периода — валидация на подвыборке для выбора гиперпараметров.</p>
          </div>
          <div>
            <div className="text-[#d4a017] mb-1">TEST (OOS)</div>
            <p>1-месячное out-of-sample окно. Стратегия с замороженными параметрами тестируется на данных, которые она НЕ видела.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
