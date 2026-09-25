import { riskMetrics } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import { Shield, AlertTriangle, Power, Gauge } from 'lucide-react';

export default function Risk() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Риск-менеджмент</h1>
          <p className="text-xs text-[#6b6b73] mt-1">Risk Engine имеет приоритет выше Signal Engine. NO TRADE — нормальный результат.</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={riskMetrics.capitalMode} />
          {riskMetrics.killSwitchActive && <StatusBadge status="ERROR" />}
        </div>
      </div>

      {/* Kill Switch */}
      <div className="card border-[#ef4444]/30 bg-[#ef4444]/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Power size={18} className="text-[#ef4444]" />
            <div>
              <div className="text-sm font-medium text-[#ef4444]">KILL SWITCH</div>
              <div className="text-[10px] text-[#a0a0a8]">Независимый аварийный выключатель. Блокирует все новые сделки при критических ошибках</div>
            </div>
          </div>
          <div className="tooltip-wrapper">
            <span className={`badge ${riskMetrics.killSwitchActive ? 'badge-red' : 'badge-green'}`}>
              {riskMetrics.killSwitchActive ? 'АКТИВЕН' : 'НЕАКТИВЕН'}
            </span>
            <span className="tooltip-content">Kill switch активируется автоматически при: потере MT5, аномальном спреде, ошибке исполнения, повреждении данных, сбое БД</span>
          </div>
        </div>
      </div>

      {/* Risk Limits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <RiskCard
          icon={<Gauge size={14} />}
          title="Риск на сделку"
          value={`${riskMetrics.riskPerTrade}%`}
          description="% от эквити на одну сделку"
          tooltip="Максимальный риск, который система может принять на одну сделку. Рассчитывается от Account Equity"
          usage={riskMetrics.riskPerTrade / 2 * 100}
        />
        <RiskCard
          icon={<Shield size={14} />}
          title="Дневной лимит"
          value={`${riskMetrics.dailyRiskUsed}% / ${riskMetrics.dailyRiskLimit}%`}
          description="Использовано / максимум за день"
          tooltip="Максимальный суммарный дневной риск. При достижении — торговля останавливается до следующего дня"
          usage={(riskMetrics.dailyRiskUsed / riskMetrics.dailyRiskLimit) * 100}
        />
        <RiskCard
          icon={<Shield size={14} />}
          title="Недельный лимит"
          value={`${riskMetrics.weeklyRiskUsed}% / ${riskMetrics.weeklyRiskLimit}%`}
          description="Использовано / максимум за неделю"
          tooltip="Максимальный суммарный недельный риск. При достижении — торговля останавливается до следующей недели"
          usage={(riskMetrics.weeklyRiskUsed / riskMetrics.weeklyRiskLimit) * 100}
        />
        <RiskCard
          icon={<AlertTriangle size={14} />}
          title="Максимальная просадка"
          value={`${riskMetrics.currentDrawdown}% / ${riskMetrics.maxDrawdownLimit}%`}
          description="Текущая / лимит"
          tooltip="Максимальная допустимая просадка от пика эквити. При достижении — TRADING HALTED"
          usage={(riskMetrics.currentDrawdown / riskMetrics.maxDrawdownLimit) * 100}
          warning={riskMetrics.currentDrawdown > riskMetrics.maxDrawdownLimit * 0.7}
        />
        <RiskCard
          icon={<AlertTriangle size={14} />}
          title="Серия убытков"
          value={`${riskMetrics.consecutiveLosses} / ${riskMetrics.maxConsecutiveLosses}`}
          description="Текущая / максимум подряд"
          tooltip="Максимальное количество последовательных убыточных сделок. При достижении — снижение риска или остановка"
          usage={(riskMetrics.consecutiveLosses / riskMetrics.maxConsecutiveLosses) * 100}
        />
        <RiskCard
          icon={<Gauge size={14} />}
          title="Открытые позиции"
          value={`${riskMetrics.openPositions} / ${riskMetrics.maxOpenPositions}`}
          description="Текущие / максимум"
          tooltip="Максимальное количество одновременно открытых позиций. Контролирует коррелированный риск"
          usage={(riskMetrics.openPositions / riskMetrics.maxOpenPositions) * 100}
        />
      </div>

      {/* Position Sizing */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-medium text-[#a0a0a8]">РАСЧЁТ РАЗМЕРА ПОЗИЦИИ</span>
          <span className="tooltip-wrapper">
            <span className="text-[10px] text-[#6b6b73] cursor-help">ⓘ</span>
            <span className="tooltip-content">Размер позиции НЕ фиксирован. Рассчитывается от: Account Equity × Risk% / Stop Distance. Адаптируется к спецификациям брокера</span>
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#1a1a1d] rounded-md p-3">
            <div className="text-[10px] text-[#6b6b73] mb-1">Account Equity</div>
            <div className="text-sm font-mono text-[#e5e5e5]">${riskMetrics.accountEquity.toLocaleString()}</div>
          </div>
          <div className="bg-[#1a1a1d] rounded-md p-3">
            <div className="text-[10px] text-[#6b6b73] mb-1">Risk Amount</div>
            <div className="text-sm font-mono text-[#d4a017]">${(riskMetrics.accountEquity * riskMetrics.riskPerTrade / 100).toFixed(2)}</div>
          </div>
          <div className="bg-[#1a1a1d] rounded-md p-3">
            <div className="text-[10px] text-[#6b6b73] mb-1">Stop Distance</div>
            <div className="text-sm font-mono text-[#e5e5e5]">$4.72</div>
          </div>
          <div className="bg-[#1a1a1d] rounded-md p-3">
            <div className="text-[10px] text-[#6b6b73] mb-1">Position Size</div>
            <div className="text-sm font-mono text-[#22c55e]">{riskMetrics.positionSize} lot</div>
          </div>
        </div>
        <div className="mt-3 text-[10px] text-[#6b6b73] font-mono">
          position_size = risk_amount / (stop_distance × contract_size × point_value) = ${(riskMetrics.accountEquity * riskMetrics.riskPerTrade / 100).toFixed(2)} / ($4.72 × 100 × $0.01) = {riskMetrics.positionSize} lot
        </div>
      </div>

      {/* Capital Protection */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={14} className="text-[#3b82f6]" />
          <span className="text-xs font-medium text-[#a0a0a8]">ЗАЩИТА КАПИТАЛА</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <CapitalRule label="DAILY LOSS LIMIT" value="3%" status="OK" tooltip="При достижении 3% дневного убытка — торговля остановлена до следующего дня" />
            <CapitalRule label="WEEKLY LOSS LIMIT" value="6%" status="OK" tooltip="При достижении 6% недельного убытка — торговля остановлена до следующей недели" />
            <CapitalRule label="MAX DRAWDOWN" value="15%" status="OK" tooltip="При просадке 15% от пика — TRADING HALTED. Reset только через ручное подтверждение" />
          </div>
          <div className="space-y-2">
            <CapitalRule label="MARTINGALE" value="OFF" status="BLOCKED" tooltip="Увеличение размера после убытка запрещено по умолчанию" />
            <CapitalRule label="LOSS CHASING" value="OFF" status="BLOCKED" tooltip="Попытки 'отыграться' запрещены. Система не торгует ради восстановления P&L" />
            <CapitalRule label="REVENGE TRADING" value="OFF" status="BLOCKED" tooltip="Эмоциональные решения после убытка исключены архитектурой" />
          </div>
        </div>
      </div>

      {/* Adaptive Risk */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-medium text-[#a0a0a8]">АДАПТИВНЫЙ РИСК</span>
          <span className="tooltip-wrapper">
            <span className="text-[10px] text-[#6b6b73] cursor-help">ⓘ</span>
            <span className="tooltip-content">Риск динамически уменьшается при ухудшении условий. Не является скрытым martingale — не увеличивается после прибыли</span>
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <AdaptiveMode mode="NORMAL" description="Штатный режим" active={riskMetrics.capitalMode === 'NORMAL'} tooltip="Стандартный риск. Все условия в норме" />
          <AdaptiveMode mode="REDUCED_RISK" description="Сниженный риск" active={false} tooltip="Активируется при: росте просадки, деградации стратегии, высокой волатильности" />
          <AdaptiveMode mode="HALTED" description="Остановлен" active={riskMetrics.tradingHalted} tooltip="Торговля полностью остановлена. Требуется ручное подтверждение для возобновления" />
          <AdaptiveMode mode="RECOVERY" description="Восстановление" active={false} tooltip="Постепенное восстановление риска после периода просадки" />
        </div>
      </div>
    </div>
  );
}

function RiskCard({ icon, title, value, description, tooltip, usage, warning }: { icon: React.ReactNode; title: string; value: string; description: string; tooltip: string; usage: number; warning?: boolean }) {
  const barColor = warning ? 'bg-[#f59e0b]' : usage > 80 ? 'bg-[#ef4444]' : usage > 50 ? 'bg-[#f59e0b]' : 'bg-[#22c55e]';
  return (
    <div className="tooltip-wrapper w-full">
      <div className="card card-hover">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#6b6b73]">{icon}</span>
          <span className="text-[11px] text-[#6b6b73]">{title}</span>
        </div>
        <div className={`text-sm font-mono font-medium mb-1 ${warning ? 'text-[#f59e0b]' : 'text-[#e5e5e5]'}`}>{value}</div>
        <div className="text-[10px] text-[#6b6b73] mb-2">{description}</div>
        <div className="w-full h-1.5 bg-[#1a1a1d] rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${Math.min(usage, 100)}%` }} />
        </div>
      </div>
      <div className="tooltip-content">{tooltip}</div>
    </div>
  );
}

function CapitalRule({ label, value, status, tooltip }: { label: string; value: string; status: string; tooltip: string }) {
  return (
    <div className="tooltip-wrapper w-full">
      <div className="flex items-center justify-between bg-[#1a1a1d] rounded-md px-3 py-2">
        <div>
          <div className="text-[10px] text-[#6b6b73]">{label}</div>
          <div className="text-xs font-mono text-[#e5e5e5]">{value}</div>
        </div>
        <span className={`badge ${status === 'OK' ? 'badge-green' : 'badge-red'}`}>{status}</span>
      </div>
      <div className="tooltip-content">{tooltip}</div>
    </div>
  );
}

function AdaptiveMode({ mode, description, active, tooltip }: { mode: string; description: string; active: boolean; tooltip: string }) {
  return (
    <div className="tooltip-wrapper">
      <div className={`rounded-md p-3 border ${active ? 'border-[#d4a017]/30 bg-[#d4a017]/5' : 'border-[#26262a] bg-[#1a1a1d]'}`}>
        <div className="text-[10px] text-[#6b6b73] mb-1">{description}</div>
        <div className={`text-xs font-medium ${active ? 'text-[#d4a017]' : 'text-[#a0a0a8]'}`}>{mode}</div>
      </div>
      <div className="tooltip-content">{tooltip}</div>
    </div>
  );
}
