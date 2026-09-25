import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, Tooltip as RechartsTooltip } from 'recharts';
import { generatePriceSeries, marketData } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';

const timeframes = ['M1', 'M5', 'M15', 'H1'];

export default function Market() {
  const [activeTF, setActiveTF] = useState('M5');
  const priceData = generatePriceSeries(80, marketData.bid);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Рынок — {marketData.symbol}</h1>
          <p className="text-xs text-[#6b6b73] mt-1">Multi-timeframe анализ золота. Данные: {marketData.dataStatus}</p>
        </div>
        <div className="flex items-center gap-2">
          {timeframes.map(tf => (
            <button
              key={tf}
              onClick={() => setActiveTF(tf)}
              className={`tooltip-wrapper px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                activeTF === tf ? 'bg-[#d4a017]/15 text-[#d4a017] border border-[#d4a017]/30' : 'bg-[#1a1a1d] text-[#a0a0a8] border border-[#26262a] hover:border-[#3a3a40]'
              }`}
            >
              {tf}
              <span className="tooltip-content">Таймфрейм {tf}. H1 = структура, M15 = сетап, M5 = подтверждение, M1 = исполнение</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[#e5e5e5]">{marketData.symbol}</span>
            <span className="text-lg font-mono font-semibold text-[#e5e5e5]">{marketData.bid.toFixed(2)}</span>
            <span className="text-xs text-[#22c55e]">+2.34 (+0.10%)</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[#6b6b73]">
            <span>Таймфрейм: {activeTF}</span>
            <span>•</span>
            <span>Свечей: {priceData.length}</span>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#26262a" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#6b6b73' }} interval={15} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#6b6b73' }} tickFormatter={(v) => v.toFixed(0)} />
              <RechartsTooltip
                contentStyle={{ background: '#1a1a1d', border: '1px solid #26262a', borderRadius: 6, fontSize: 11 }}
                labelStyle={{ color: '#a0a0a8' }}
                itemStyle={{ color: '#d4a017' }}
                formatter={(value: number) => [value.toFixed(2), 'Цена']}
              />
              <Line type="monotone" dataKey="price" stroke="#d4a017" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Volume Chart */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-[#a0a0a8]">ТИКОВЫЙ ОБЪЁМ</span>
          <span className="tooltip-wrapper">
            <span className="text-[10px] text-[#6b6b73] cursor-help">ⓘ</span>
            <span className="tooltip-content">Тиковый объём — количество изменений цены за период. НЕ является реальным биржевым объёмом. На Forex/CFD реальный объём недоступен.</span>
          </span>
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priceData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#26262a" />
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#6b6b73' }} interval={15} />
              <YAxis tick={{ fontSize: 9, fill: '#6b6b73' }} />
              <RechartsTooltip
                contentStyle={{ background: '#1a1a1d', border: '1px solid #26262a', borderRadius: 6, fontSize: 11 }}
                labelStyle={{ color: '#a0a0a8' }}
              />
              <Bar dataKey="volume" fill="#3b82f6" opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Multi-TF Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {timeframes.map(tf => (
          <div key={tf} className="card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#a0a0a8]">{tf}</span>
              <StatusBadge status={tf === 'H1' ? 'TREND_UP' : tf === 'M15' ? 'BULLISH' : 'STRONG'} size="sm" />
            </div>
            <div className="h-20 mb-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={generatePriceSeries(30, marketData.bid + (Math.random() - 0.5) * 5)}>
                  <Line type="monotone" dataKey="price" stroke="#d4a017" strokeWidth={1} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-[#6b6b73]">Тренд</span>
                <span className="text-[#22c55e]">{tf === 'H1' ? 'Восходящий' : tf === 'M15' ? 'Откат' : 'Бычий'}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-[#6b6b73]">EMA slope</span>
                <span className="text-[#e5e5e5] font-mono">+{(Math.random() * 0.5 + 0.1).toFixed(3)}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-[#6b6b73]">RSI</span>
                <span className="text-[#e5e5e5] font-mono">{(50 + Math.random() * 20).toFixed(1)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Market Structure */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-medium text-[#a0a0a8]">РЫНОЧНАЯ СТРУКТУРА</span>
          <span className="tooltip-wrapper">
            <span className="text-[10px] text-[#6b6b73] cursor-help">ⓘ</span>
            <span className="tooltip-content">Определение структуры по swing points: HH (Higher High), HL (Higher Low), LH (Lower High), LL (Lower Low), BOS (Break of Structure)</span>
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StructureItem label="Последний HH" value="2348.20" time="14:32" tooltip="Последний повышенный максимум — подтверждение бычьей структуры" />
          <StructureItem label="Последний HL" value="2336.50" time="11:15" tooltip="Последний повышенный минимум — бычья структура не сломлена" />
          <StructureItem label="Последний BOS" value="2342.10" time="13:45" tooltip="Break of Structure — пробой предыдущего экстремума" />
          <StructureItem label="Consolidation" value="Нет" time="—" tooltip="Боковое движение / консолидация не обнаружена" />
        </div>
      </div>

      {/* Liquidity Levels */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-medium text-[#a0a0a8]">УРОВНИ ЛИКВИДНОСТИ</span>
          <span className="tooltip-wrapper">
            <span className="text-[10px] text-[#6b6b73] cursor-help">ⓘ</span>
            <span className="tooltip-content">Формализованные уровни ликвидности: предыдущий день high/low, session high/low, равные экстремумы, swing points. Sweep = пробой + откат + временное ограничение.</span>
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <LiquidityLevel label="PDH" value="2345.80" status="ABOVE" tooltip="Previous Day High — максимум предыдущего дня" />
          <LiquidityLevel label="PDL" value="2332.10" status="ABOVE" tooltip="Previous Day Low — минимум предыдущего дня" />
          <LiquidityLevel label="Session H" value="2348.20" status="AT" tooltip="Максимум текущей сессии" />
          <LiquidityLevel label="Session L" value="2338.40" status="ABOVE" tooltip="Минимум текущей сессии" />
          <LiquidityLevel label="Eq. Highs" value="2346.00" status="SWEEP" tooltip="Равные максимумы — зона ликвидности. Sweep обнаружен" />
          <LiquidityLevel label="Eq. Lows" value="2336.50" status="NEAR" tooltip="Равные минимумы — зона ликвидности. Цена приближается" />
        </div>
      </div>
    </div>
  );
}

function StructureItem({ label, value, time, tooltip }: { label: string; value: string; time: string; tooltip: string }) {
  return (
    <div className="tooltip-wrapper">
      <div className="bg-[#1a1a1d] rounded-md p-3">
        <div className="text-[10px] text-[#6b6b73] mb-1">{label}</div>
        <div className="text-sm font-mono text-[#e5e5e5]">{value}</div>
        <div className="text-[10px] text-[#6b6b73] mt-1">{time}</div>
      </div>
      <div className="tooltip-content">{tooltip}</div>
    </div>
  );
}

function LiquidityLevel({ label, value, status, tooltip }: { label: string; value: string; status: string; tooltip: string }) {
  const statusColor = status === 'SWEEP' ? 'text-[#f59e0b]' : status === 'AT' ? 'text-[#d4a017]' : 'text-[#6b6b73]';
  return (
    <div className="tooltip-wrapper">
      <div className="bg-[#1a1a1d] rounded-md p-3">
        <div className="text-[10px] text-[#6b6b73] mb-1">{label}</div>
        <div className="text-sm font-mono text-[#e5e5e5]">{value}</div>
        <div className={`text-[10px] mt-1 ${statusColor}`}>{status}</div>
      </div>
      <div className="tooltip-content">{tooltip}</div>
    </div>
  );
}
