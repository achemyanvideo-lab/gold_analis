import { signalData } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import { Zap, CheckCircle, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export default function Signal() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Торговый сигнал</h1>
        <p className="text-xs text-[#6b6b73] mt-1">SIGNAL ≠ TRADE. Signal Engine предлагает идею. Risk Engine принимает окончательное решение.</p>
      </div>

      {/* Decision Pipeline */}
      <div className="card">
        <div className="text-xs font-medium text-[#a0a0a8] mb-4">PIPELINE ПРИНЯТИЯ РЕШЕНИЯ</div>
        <div className="flex items-center gap-2 flex-wrap">
          <PipelineStep label="Data Quality" status="VALID" active />
          <ArrowRight size={14} className="text-[#6b6b73]" />
          <PipelineStep label="Regime" status="TREND_UP" active />
          <ArrowRight size={14} className="text-[#6b6b73]" />
          <PipelineStep label="Setup" status="VALID" active />
          <ArrowRight size={14} className="text-[#6b6b73]" />
          <PipelineStep label="Signal" status="BUY" active />
          <ArrowRight size={14} className="text-[#6b6b73]" />
          <PipelineStep label="Invalidation" status="DEFINED" active />
          <ArrowRight size={14} className="text-[#6b6b73]" />
          <PipelineStep label="Risk Check" status="APPROVED" active />
          <ArrowRight size={14} className="text-[#6b6b73]" />
          <PipelineStep label="Execution" status="PAPER" active />
        </div>
      </div>

      {/* Signal Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Signal Info */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={14} className="text-[#d4a017]" />
            <span className="text-xs font-medium text-[#a0a0a8]">ДЕТАЛИ СИГНАЛА</span>
          </div>
          <div className="space-y-3">
            <InfoRow label="Направление" value={<StatusBadge status={signalData.direction} />} tooltip="Предложение Signal Engine. Не является командой на вход" />
            <InfoRow label="Стратегия" value={signalData.strategy} tooltip="Модуль стратегии, сгенерировавший сигнал" />
            <InfoRow label="Версия" value={signalData.strategyVersion} tooltip="Версия стратегии. Каждая сделка хранит версии всех компонентов" />
            <InfoRow label="Setup Score" value={`${signalData.setupScore}/100`} tooltip="Оценка качества сетапа. 0-100 на основе количества подтверждённых условий. Не является вероятностью прибыли" />
            <InfoRow label="Зона входа" value={signalData.entryZone} tooltip="Ценовая зона, в которой вход считается валидным" />
            <InfoRow label="Stop Loss" value={signalData.stopLoss.toFixed(2)} tooltip="Уровень, при достижении которого гипотеза считается неверной" />
            <InfoRow label="Take Profit" value={signalData.takeProfit.toFixed(2)} tooltip="Целевой уровень фиксации прибыли" />
            <InfoRow label="Risk:Reward" value={`${signalData.riskReward}:1`} tooltip="Соотношение потенциальной прибыли к риску. Минимальный порог конфигурируется" />
            <InfoRow label="Invalidation" value={signalData.invalidation} tooltip="Условия, при которых сигнал автоматически отменяется" />
          </div>
        </div>

        {/* Right: Risk Decision */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={14} className="text-[#3b82f6]" />
            <span className="text-xs font-medium text-[#a0a0a8]">РЕШЕНИЕ RISK ENGINE</span>
          </div>
          <div className="space-y-3">
            <InfoRow label="Решение" value={<StatusBadge status={signalData.riskDecision} />} tooltip="Решение Risk Engine. Имеет приоритет выше Signal Engine" />
            <InfoRow label="Режим рынка" value={signalData.regime} tooltip="Стратегия торгует только в разрешённых режимах" />
            <InfoRow label="Итог" value={<span className="text-[#22c55e] font-semibold">{signalData.finalDecision}</span>} tooltip="Финальное решение системы после прохождения всех проверок" />
          </div>

          <div className="mt-4 pt-4 border-t border-[#26262a]">
            <div className="text-[10px] text-[#6b6b73] mb-2">TIMESTAMP</div>
            <div className="text-xs font-mono text-[#a0a0a8]">{new Date(signalData.timestamp).toLocaleString('ru-RU')}</div>
          </div>
        </div>
      </div>

      {/* Reasons */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle size={14} className="text-[#22c55e]" />
          <span className="text-xs font-medium text-[#a0a0a8]">ОБОСНОВАНИЕ СИГНАЛА</span>
        </div>
        <div className="space-y-2">
          {signalData.reasons.map((reason, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] mt-1.5 flex-shrink-0" />
              <span className="text-[#a0a0a8]">{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Conditions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={14} className="text-[#22c55e]" />
            <span className="text-xs font-medium text-[#a0a0a8]">УСЛОВИЯ ВЫПОЛНЕНЫ</span>
          </div>
          <div className="space-y-2">
            {signalData.conditionsMet.map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[#22c55e]">✓</span>
                <span className="text-[#a0a0a8]">{c}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <XCircle size={14} className="text-[#ef4444]" />
            <span className="text-xs font-medium text-[#a0a0a8]">УСЛОВИЯ НЕ ВЫПОЛНЕНЫ</span>
          </div>
          {signalData.conditionsFailed.length === 0 ? (
            <div className="text-xs text-[#6b6b73] italic">Все обязательные условия выполнены</div>
          ) : (
            <div className="space-y-2">
              {signalData.conditionsFailed.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-[#ef4444]">✗</span>
                  <span className="text-[#a0a0a8]">{c}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Invalidation Rules */}
      <div className="card border-[#ef4444]/20">
        <div className="flex items-center gap-2 mb-4">
          <XCircle size={14} className="text-[#ef4444]" />
          <span className="text-xs font-medium text-[#a0a0a8]">ПРАВИЛА INVALIDATION</span>
          <span className="tooltip-wrapper">
            <span className="text-[10px] text-[#6b6b73] cursor-help">ⓘ</span>
            <span className="tooltip-content">Каждый сигнал обязан иметь конкретные условия invalidation. После invalidation сигнал НЕ может быть восстановлен</span>
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            'Структура сломлена ниже 2338.00',
            'Спред > 50 пунктов',
            'Волатильность переходит в EXTREME',
            'Высокозначимые новости < 5 мин',
            'Данные становятся STALE',
            'Risk Engine переходит в HALTED',
            'MT5 connection lost',
            'Kill switch активирован',
          ].map((rule, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
              <span className="text-[#a0a0a8]">{rule}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PipelineStep({ label, status, active }: { label: string; status: string; active: boolean }) {
  return (
    <div className="tooltip-wrapper">
      <div className={`flex flex-col items-center px-3 py-2 rounded border ${active ? 'border-[#22c55e]/30 bg-[#22c55e]/5' : 'border-[#26262a] bg-[#1a1a1d]'}`}>
        <span className="text-[10px] text-[#6b6b73]">{label}</span>
        <StatusBadge status={status} size="sm" />
      </div>
      <div className="tooltip-content">Этап pipeline: {label}. Статус: {status}</div>
    </div>
  );
}

function InfoRow({ label, value, tooltip }: { label: string; value: React.ReactNode; tooltip: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="tooltip-wrapper">
        <span className="text-[11px] text-[#6b6b73] cursor-help">{label}</span>
        <span className="tooltip-content">{tooltip}</span>
      </span>
      <span className="text-xs text-[#e5e5e5] font-mono">{value}</span>
    </div>
  );
}
