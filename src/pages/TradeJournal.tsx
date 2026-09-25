import { demoTrades } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import { Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function TradeJournal() {
  const [expandedTrade, setExpandedTrade] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Журнал сделок</h1>
        <p className="text-xs text-[#6b6b73] mt-1">Полный audit trail. Можно восстановить: почему сделка открыта, почему не открыта, почему закрыта.</p>
      </div>

      {/* Trade Quality Analysis */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Eye size={14} className="text-[#a855f7]" />
          <span className="text-xs font-medium text-[#a0a0a8]">АНАЛИЗ КАЧЕСТВА СДЕЛОК</span>
          <span className="tooltip-wrapper">
            <span className="text-[10px] text-[#6b6b73] cursor-help">ⓘ</span>
            <span className="tooltip-content">Классификация сделок: GOOD_WIN (правильный вход + прибыль), BAD_WIN (ошибочный вход но прибыль — опасно!), GOOD_LOSS (правильный вход но убыток — нормально), BAD_LOSS (ошибочный вход + убыток — нужно анализировать)</span>
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QualityCard type="GOOD_WIN" count={demoTrades.filter(t => t.quality === 'GOOD_WIN').length} tooltip="Правильный вход по правилам → прибыль. Система работает как задумано" />
          <QualityCard type="BAD_WIN" count={demoTrades.filter(t => t.quality === 'BAD_WIN').length} tooltip="Ошибочный вход (нарушение правил) → прибыль. ОПАСНО: закрепляет плохое поведение" />
          <QualityCard type="GOOD_LOSS" count={demoTrades.filter(t => t.quality === 'GOOD_LOSS').length} tooltip="Правильный вход по правилам → убыток. Нормально — статистика включает убытки" />
          <QualityCard type="BAD_LOSS" count={demoTrades.filter(t => t.quality === 'BAD_LOSS').length} tooltip="Ошибочный вход → убыток. Нужно анализировать, почему правила были нарушены" />
        </div>
      </div>

      {/* Trades List */}
      <div className="space-y-2">
        {demoTrades.map(trade => (
          <div key={trade.id} className="card card-hover">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedTrade(expandedTrade === trade.id ? null : trade.id)}
            >
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-[#6b6b73]">{trade.id}</span>
                <StatusBadge status={trade.direction} size="sm" />
                <span className="text-xs text-[#a0a0a8]">{trade.timestamp}</span>
                <span className="text-xs text-[#6b6b73]">{trade.strategy}</span>
                <StatusBadge status={trade.regime} size="sm" />
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-mono font-semibold ${trade.pnl >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                  {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                </span>
                <StatusBadge status={trade.quality} size="sm" />
                {expandedTrade === trade.id ? <ChevronUp size={14} className="text-[#6b6b73]" /> : <ChevronDown size={14} className="text-[#6b6b73]" />}
              </div>
            </div>

            {expandedTrade === trade.id && (
              <div className="mt-4 pt-4 border-t border-[#26262a] space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <JournalField label="Вход" value={trade.entry.toFixed(2)} tooltip="Цена входа в сделку" />
                  <JournalField label="Выход" value={trade.exit.toFixed(2)} tooltip="Цена выхода из сделки" />
                  <JournalField label="Stop Loss" value={trade.stopLoss.toFixed(2)} tooltip="Уровень stop loss. При достижении — гипотеза неверна" />
                  <JournalField label="Take Profit" value={trade.takeProfit.toFixed(2)} tooltip="Целевой уровень прибыли" />
                  <JournalField label="Размер" value={`${trade.positionSize} lot`} tooltip="Рассчитанный размер позиции" />
                  <JournalField label="P&L" value={`${trade.pnl >= 0 ? '+' : ''}$${trade.pnl.toFixed(2)}`} tooltip="Прибыль/убыток по сделке" />
                  <JournalField label="P&L %" value={`${trade.pnlPercent >= 0 ? '+' : ''}${trade.pnlPercent.toFixed(2)}%`} tooltip="Прибыль/убыток в % от эквити" />
                  <JournalField label="Выход" value={trade.exitReason} tooltip="Причина закрытия позиции" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <JournalField label="Проскальзывание" value={`${trade.slippage} pts`} tooltip="Реальное проскальзывание при исполнении" />
                  <JournalField label="Комиссия" value={`$${trade.commission.toFixed(2)}`} tooltip="Комиссия брокера" />
                  <JournalField label="Стратегия" value={trade.strategy} tooltip="Модуль стратегии, сгенерировавший сигнал" />
                </div>
                <div className="bg-[#1a1a1d] rounded p-3">
                  <div className="text-[10px] text-[#6b6b73] mb-1">КЛАССИФИКАЦИЯ КАЧЕСТВА</div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={trade.quality} />
                    <span className="text-[11px] text-[#a0a0a8]">
                      {trade.quality === 'GOOD_WIN' && 'Вход по правилам → прибыль. Система работает корректно.'}
                      {trade.quality === 'BAD_WIN' && 'Вход с нарушениями → прибыль. ОПАСНО: может закрепить плохое поведение.'}
                      {trade.quality === 'GOOD_LOSS' && 'Вход по правилам → убыток. Нормально — статистически ожидаемо.'}
                      {trade.quality === 'BAD_LOSS' && 'Вход с нарушениями → убыток. Требуется анализ нарушения правил.'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Trade Log */}
      <div className="card">
        <div className="text-xs font-medium text-[#a0a0a8] mb-3">ЖУРНАЛ ОТКАЗОВ (NO TRADE)</div>
        <div className="text-[11px] text-[#6b6b73] mb-3">
          Система также ведёт журнал решений НЕ входить в рынок. Это критически важно для анализа.
        </div>
        <div className="space-y-2">
          {[
            { time: '09:15', reason: 'Спред > 50 пунктов', signal: 'BUY', risk: 'REJECTED' },
            { time: '10:32', reason: 'Высокозначимые новости через 3 минуты', signal: 'SELL', risk: 'REJECTED' },
            { time: '11:45', reason: 'Волатильность EXTREME — вход запрещён', signal: 'BUY', risk: 'REJECTED' },
            { time: '14:20', reason: 'Нет валидного сетапа', signal: 'NO_TRADE', risk: 'N/A' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between bg-[#1a1a1d] rounded px-3 py-2">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-[#6b6b73]">{item.time}</span>
                <span className="text-[11px] text-[#a0a0a8]">{item.reason}</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={item.signal} size="sm" />
                <span className="text-[10px] text-[#6b6b73]">→</span>
                <span className="text-[10px] text-[#ef4444]">NO TRADE</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QualityCard({ type, count, tooltip }: { type: string; count: number; tooltip: string }) {
  return (
    <div className="tooltip-wrapper">
      <div className="bg-[#1a1a1d] rounded-md p-3 text-center">
        <StatusBadge status={type} />
        <div className="text-lg font-mono font-bold text-[#e5e5e5] mt-2">{count}</div>
      </div>
      <div className="tooltip-content">{tooltip}</div>
    </div>
  );
}

function JournalField({ label, value, tooltip }: { label: string; value: string; tooltip: string }) {
  return (
    <div className="tooltip-wrapper">
      <div className="bg-[#1a1a1d] rounded px-3 py-2">
        <div className="text-[10px] text-[#6b6b73]">{label}</div>
        <div className="text-xs font-mono text-[#e5e5e5]">{value}</div>
      </div>
      <div className="tooltip-content">{tooltip}</div>
    </div>
  );
}
