import { systemStatus, marketData, regimeState, signalData, riskMetrics, externalContext } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import { Activity, Wifi, Database, Globe, Shield, Zap, AlertTriangle, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#e5e5e5]">GOLD QUANT — Панель управления</h1>
          <p className="text-xs text-[#6b6b73] mt-1">Исследовательско-торговая платформа для количественного анализа золота</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="tooltip-wrapper">
            <span className="badge badge-blue">MODE: {systemStatus.mode}</span>
            <div className="tooltip-content">Текущий режим работы системы. LIVE отключён по умолчанию.</div>
          </div>
          <div className="tooltip-wrapper">
            <span className={`badge ${systemStatus.liveTrading ? 'badge-red' : 'badge-gray'}`}>
              LIVE: {systemStatus.liveTrading ? 'ВКЛ' : 'ВЫКЛ'}
            </span>
            <div className="tooltip-content">Реальная торговля физически заблокирована. Требует прохождения полной валидации.</div>
          </div>
        </div>
      </div>

      {/* Critical Warning */}
      <div className="card border-[#f59e0b]/30 bg-[#f59e0b]/5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={16} className="text-[#f59e0b] mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs font-medium text-[#f59e0b]">ДЕМО-РЕЖИМ ИНТЕРФЕЙСА</div>
            <div className="text-xs text-[#a0a0a8] mt-1">
              Веб-интерфейс отображает симулированные данные. Реальные данные поступают из MT5 через Python backend.
              Для подключения к реальному рынку запустите backend-сервер и подключите MetaTrader 5.
              Никакие реальные сделки не выполняются.
            </div>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <ConnectionCard
          icon={<Wifi size={14} />}
          label="MT5 Терминал"
          status={systemStatus.mt5Connected ? 'CONNECTED' : 'DISCONNECTED'}
          detail={systemStatus.mt5Connected ? 'Подключён' : 'Не подключён — запустите backend'}
          tooltip="Статус подключения к локальному MetaTrader 5 через Python API"
        />
        <ConnectionCard
          icon={<Activity size={14} />}
          label="Поток данных"
          status={systemStatus.dataFeed}
          detail="Симуляция (демо)"
          tooltip="Качество и актуальность рыночных данных. DEMO = данные не из реального рынка"
        />
        <ConnectionCard
          icon={<Database size={14} />}
          label="База данных"
          status={systemStatus.database}
          detail="SQLite — локальная"
          tooltip="Локальная база данных для хранения сделок, сигналов, метрик"
        />
        <ConnectionCard
          icon={<Globe size={14} />}
          label="Внешние данные"
          status={systemStatus.externalData}
          detail="DXY, Фьючерсы, COT, Новости"
          tooltip="Внешние источники: индекс доллара, фьючерсы на золото, COT, экономический календарь"
        />
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Price Card */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-[#d4a017]" />
              <span className="text-xs font-medium text-[#a0a0a8]">РЫНОК</span>
            </div>
            <StatusBadge status={marketData.dataStatus} size="sm" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="tooltip-wrapper">
                <span className="text-[11px] text-[#6b6b73] cursor-help">Символ</span>
                <span className="tooltip-content">Автоматически обнаруженный символ золота в терминале брокера</span>
              </span>
              <span className="text-sm font-mono text-[#e5e5e5]">{marketData.symbolDetected}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="tooltip-wrapper">
                <span className="text-[11px] text-[#6b6b73] cursor-help">Bid</span>
                <span className="tooltip-content">Цена продажи (по которой брокер покупает у вас)</span>
              </span>
              <span className="text-sm font-mono text-[#e5e5e5]">{marketData.bid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="tooltip-wrapper">
                <span className="text-[11px] text-[#6b6b73] cursor-help">Ask</span>
                <span className="tooltip-content">Цена покупки (по которой брокер продаёт вам)</span>
              </span>
              <span className="text-sm font-mono text-[#e5e5e5]">{marketData.ask.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="tooltip-wrapper">
                <span className="text-[11px] text-[#6b6b73] cursor-help">Спред</span>
                <span className="tooltip-content">Разница между Ask и Bid. Торговая издержка при входе и выходе</span>
              </span>
              <span className="text-sm font-mono text-[#f59e0b]">{marketData.spread.toFixed(2)} ({marketData.spreadPoints} pts)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="tooltip-wrapper">
                <span className="text-[11px] text-[#6b6b73] cursor-help">Tick Volume</span>
                <span className="tooltip-content">Количество изменений цены. НЕ является реальным биржевым объёмом</span>
              </span>
              <span className="text-sm font-mono text-[#e5e5e5]">{marketData.tickVolume.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="tooltip-wrapper">
                <span className="text-[11px] text-[#6b6b73] cursor-help">Реальный объём</span>
                <span className="tooltip-content">Биржевой объём. На Forex/CFD обычно недоступен</span>
              </span>
              <span className="text-sm font-mono text-[#6b6b73]">{marketData.realVolume}</span>
            </div>
          </div>
        </div>

        {/* Regime Card */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-[#a855f7]" />
              <span className="text-xs font-medium text-[#a0a0a8]">РЕЖИМ РЫНКА</span>
            </div>
            <div className="tooltip-wrapper">
              <span className="text-[10px] text-[#6b6b73] cursor-help">Conf: {(regimeState.confidence * 100).toFixed(0)}%</span>
              <span className="tooltip-content">Уверенность классификации режима. Не является вероятностью прибыли</span>
            </div>
          </div>
          <div className="space-y-2">
            <RegimeRow label="Режим" value={regimeState.regime} tooltip="Центральный режим рынка, определяющий разрешённые стратегии" />
            <RegimeRow label="Структура" value={regimeState.structure} tooltip="Направление рыночной структуры: HH/HL (бычья), LH/LL (медвежья), боковик" />
            <RegimeRow label="Импульс" value={regimeState.momentum} tooltip="Сила и направление ценового импульса. Комбинация RSI, ROC, ускорения" />
            <RegimeRow label="Волатильность" value={regimeState.volatility} tooltip="Текущий режим волатильности. Влияет на размер позиции и стоп-лосс" />
            <RegimeRow label="Объём" value={regimeState.volume} tooltip="Анализ тикового объёма относительно среднего" />
            <RegimeRow label="Ликвидность" value={regimeState.liquidity} tooltip="Состояние ликвидности: наличие sweep, reclaim, уровней" />
          </div>
        </div>

        {/* Signal Card */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-[#d4a017]" />
              <span className="text-xs font-medium text-[#a0a0a8]">СИГНАЛ</span>
            </div>
            <StatusBadge status={signalData.direction} size="sm" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-[#6b6b73]">Стратегия</span>
              <span className="text-xs font-mono text-[#e5e5e5]">{signalData.strategy}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-[#6b6b73]">Версия</span>
              <span className="text-xs font-mono text-[#a0a0a8]">{signalData.strategyVersion}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="tooltip-wrapper">
                <span className="text-[11px] text-[#6b6b73] cursor-help">Setup Score</span>
                <span className="tooltip-content">Оценка качества сетапа 0-100. Не является вероятностью прибыли. Определяется количеством подтверждённых условий</span>
              </span>
              <span className="text-sm font-mono text-[#d4a017]">{signalData.setupScore}/100</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-[#6b6b73]">Зона входа</span>
              <span className="text-xs font-mono text-[#e5e5e5]">{signalData.entryZone}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-[#6b6b73]">R:R</span>
              <span className="text-xs font-mono text-[#22c55e]">{signalData.riskReward}:1</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-[#6b6b73]">Риск</span>
              <StatusBadge status={signalData.riskDecision} size="sm" />
            </div>
            <div className="mt-3 pt-3 border-t border-[#26262a]">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-[#a0a0a8]">ИТОГОВОЕ РЕШЕНИЕ</span>
                <span className="text-sm font-semibold text-[#22c55e]">{signalData.finalDecision}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-[#3b82f6]" />
            <span className="text-xs font-medium text-[#a0a0a8]">РИСК-МЕНЕДЖМЕНТ</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={riskMetrics.capitalMode} size="sm" />
            {riskMetrics.killSwitchActive && <StatusBadge status="ERROR" size="sm" />}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <RiskMetric label="Риск/сделка" value={`${riskMetrics.riskPerTrade}%`} tooltip="Максимальный риск на одну сделку в % от эквити" />
          <RiskMetric label="Дневной лимит" value={`${riskMetrics.dailyRiskUsed}/${riskMetrics.dailyRiskLimit}%`} tooltip="Использованный/максимальный дневной риск" />
          <RiskMetric label="Недельный лимит" value={`${riskMetrics.weeklyRiskUsed}/${riskMetrics.weeklyRiskLimit}%`} tooltip="Использованный/максимальный недельный риск" />
          <RiskMetric label="Просадка" value={`${riskMetrics.currentDrawdown}%`} tooltip={`Текущая просадка. Лимит: ${riskMetrics.maxDrawdownLimit}%`} warning={riskMetrics.currentDrawdown > riskMetrics.maxDrawdownLimit * 0.7} />
          <RiskMetric label="Серия убытков" value={`${riskMetrics.consecutiveLosses}/${riskMetrics.maxConsecutiveLosses}`} tooltip="Текущая/максимальная серия последовательных убытков" />
          <RiskMetric label="Размер позиции" value={`${riskMetrics.positionSize} lot`} tooltip="Рассчитанный размер позиции по формуле: risk_amount / stop_distance" />
        </div>
      </div>

      {/* External Context */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Globe size={14} className="text-[#a855f7]" />
          <span className="text-xs font-medium text-[#a0a0a8]">ВНЕШНИЙ КОНТЕКСТ</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <ExternalCard label="DXY" value={externalContext.dxy.value.toFixed(2)} change={externalContext.dxy.change} status={externalContext.dxy.status} tooltip="Индекс доллара. Обратная корреляция с золотом не гарантирована — проверяется статистически" />
          <ExternalCard label="Фьючерсы GC" value={externalContext.futures.value.toFixed(2)} change={externalContext.futures.basis} status={externalContext.futures.status} tooltip="Фьючерс на золото. Basis = разница между фьючерсом и спотом" />
          <ExternalCard label="COT Net Pos" value={externalContext.cot.netPositioning.toLocaleString()} change={null} status={externalContext.cot.status} tooltip="Чистое позиционирование managed money из отчёта CFTC COT. Медленный контекст, НЕ используется как entry trigger" />
          <ExternalCard label="Новости" value={externalContext.news.regime} change={null} status={externalContext.news.status} tooltip="Режим новостей. NORMAL = нет высокозначимых событий вблизи" />
          <ExternalCard label="US 10Y" value={`${externalContext.us10y.value}%`} change={externalContext.us10y.change} status={externalContext.us10y.status} tooltip="Доходность 10-летних казначейских облигаций США" />
          <ExternalCard label="VIX" value={externalContext.vix.value.toFixed(1)} change={externalContext.vix.change} status={externalContext.vix.status} tooltip="Индекс волатильности S&P 500. Индикатор рыночного страха" />
        </div>
      </div>

      {/* Entry Policy Checklist */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={14} className="text-[#22c55e]" />
          <span className="text-xs font-medium text-[#a0a0a8]">ПОЛИТИКА ВХОДА — CHECKLIST</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {signalData.conditionsMet.map((condition, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
              <span className="text-[#a0a0a8] font-mono">{condition}</span>
            </div>
          ))}
          {signalData.conditionsFailed.map((condition, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
              <span className="text-[#a0a0a8] font-mono">{condition}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConnectionCard({ icon, label, status, detail, tooltip }: { icon: React.ReactNode; label: string; status: string; detail: string; tooltip: string }) {
  return (
    <div className="tooltip-wrapper w-full">
      <div className="card card-hover">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#6b6b73]">{icon}</span>
          <span className="text-[11px] text-[#6b6b73]">{label}</span>
        </div>
        <StatusBadge status={status} size="sm" />
        <div className="text-[10px] text-[#6b6b73] mt-2">{detail}</div>
      </div>
      <div className="tooltip-content">{tooltip}</div>
    </div>
  );
}

function RegimeRow({ label, value, tooltip }: { label: string; value: string; tooltip: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="tooltip-wrapper">
        <span className="text-[11px] text-[#6b6b73] cursor-help">{label}</span>
        <span className="tooltip-content">{tooltip}</span>
      </span>
      <StatusBadge status={value} size="sm" />
    </div>
  );
}

function RiskMetric({ label, value, tooltip, warning }: { label: string; value: string; tooltip: string; warning?: boolean }) {
  return (
    <div className="tooltip-wrapper">
      <div>
        <div className="text-[10px] text-[#6b6b73] mb-1">{label}</div>
        <div className={`text-sm font-mono font-medium ${warning ? 'text-[#f59e0b]' : 'text-[#e5e5e5]'}`}>{value}</div>
      </div>
      <div className="tooltip-content">{tooltip}</div>
    </div>
  );
}

function ExternalCard({ label, value, change, status, tooltip }: { label: string; value: string; change: number | null; status: string; tooltip: string }) {
  return (
    <div className="tooltip-wrapper">
      <div className="bg-[#1a1a1d] rounded-md p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-[#6b6b73]">{label}</span>
          <StatusBadge status={status} size="sm" />
        </div>
        <div className="text-sm font-mono text-[#e5e5e5]">{value}</div>
        {change !== null && (
          <div className={`text-[10px] font-mono ${change > 0 ? 'text-[#22c55e]' : change < 0 ? 'text-[#ef4444]' : 'text-[#6b6b73]'}`}>
            {change > 0 ? '+' : ''}{typeof change === 'number' ? change.toFixed(2) : change}
          </div>
        )}
      </div>
      <div className="tooltip-content">{tooltip}</div>
    </div>
  );
}
