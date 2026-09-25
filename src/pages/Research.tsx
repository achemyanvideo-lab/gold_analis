import StatusBadge from '../components/StatusBadge';
import { BookOpen, GitBranch, AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';

const strategies = [
  {
    name: 'TrendFollowStrategy',
    version: 'v0.3.1',
    status: 'CHAMPION',
    description: 'Следование за трендом на основе multi-TF структуры',
    allowedRegimes: ['TREND_UP', 'TREND_DOWN'],
    parameters: 8,
    backtest: 'PASS',
    oos: 'MARGINAL',
    walkForward: 'MARGINAL',
    monteCarlo: 'PASS',
    stressTest: 'MARGINAL',
    paper: 'ACTIVE',
  },
  {
    name: 'BreakoutStrategy',
    version: 'v0.1.0',
    status: 'CHALLENGER',
    description: 'Торговля пробоев уровней ликвидности',
    allowedRegimes: ['BREAKOUT', 'HIGH_VOLATILITY'],
    parameters: 12,
    backtest: 'PASS',
    oos: 'FAIL',
    walkForward: 'FAIL',
    monteCarlo: 'MARGINAL',
    stressTest: 'FAIL',
    paper: 'REJECTED',
  },
  {
    name: 'MeanReversionStrategy',
    version: 'v0.2.0',
    status: 'CHALLENGER',
    description: 'Возврат к среднему в range-режиме',
    allowedRegimes: ['RANGE', 'LOW_VOLATILITY'],
    parameters: 6,
    backtest: 'PASS',
    oos: 'PASS',
    walkForward: 'PASS',
    monteCarlo: 'PASS',
    stressTest: 'PASS',
    paper: 'TESTING',
  },
  {
    name: 'LiquidityReversalStrategy',
    version: 'v0.1.2',
    status: 'NEEDS_RESEARCH',
    description: 'Реверс после sweep ликвидности',
    allowedRegimes: ['RANGE', 'TREND_UP', 'TREND_DOWN'],
    parameters: 10,
    backtest: 'PASS',
    oos: 'FAIL',
    walkForward: 'FAIL',
    monteCarlo: 'FAIL',
    stressTest: 'FAIL',
    paper: 'REJECTED',
  },
];

const promotionPipeline = [
  { stage: 'Backtest', description: 'Исторический тест с реалистичными издержками' },
  { stage: 'Data Leakage Test', description: 'Проверка отсутствия look-ahead bias' },
  { stage: 'Out-of-Sample', description: 'Тест на данных, не виденных при обучении' },
  { stage: 'Walk-Forward', description: 'Скользящая валидация по временным окнам' },
  { stage: 'Monte Carlo', description: 'Стохастическое моделирование результатов' },
  { stage: 'Stress Test', description: 'Экстремальные условия и чувствительность' },
  { stage: 'Cost Sensitivity', description: 'Чувствительность к спредам и комиссиям' },
  { stage: 'Paper Trading', description: 'Виртуальная торговля на реальных данных' },
  { stage: 'Review', description: 'Человеческая проверка результатов' },
  { stage: 'Promotion', description: 'Перевод в Champion (требует LIVE gate)' },
];

export default function Research() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Исследования</h1>
        <p className="text-xs text-[#6b6b73] mt-1">Champion/Challenger framework. Каждая стратегия — исследовательская гипотеза. Ни одна не считается прибыльной заранее.</p>
      </div>

      {/* Strategies */}
      <div className="space-y-4">
        {strategies.map(s => (
          <div key={s.name} className="card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#e5e5e5]">{s.name}</span>
                  <span className="text-[10px] font-mono text-[#6b6b73]">{s.version}</span>
                  <StatusBadge status={s.status === 'CHAMPION' ? 'TREND_UP' : s.status === 'CHALLENGER' ? 'PENDING' : s.status === 'NEEDS_RESEARCH' ? 'MARGINAL' : 'FAIL'} size="sm" />
                </div>
                <p className="text-[11px] text-[#6b6b73] mt-1">{s.description}</p>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-[#6b6b73]">Параметров: {s.parameters}</div>
                <div className="text-[10px] text-[#6b6b73]">Режимы: {s.allowedRegimes.join(', ')}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <PipelineBadge label="BT" status={s.backtest} />
              <ArrowRight size={10} className="text-[#6b6b73]" />
              <PipelineBadge label="OOS" status={s.oos} />
              <ArrowRight size={10} className="text-[#6b6b73]" />
              <PipelineBadge label="WF" status={s.walkForward} />
              <ArrowRight size={10} className="text-[#6b6b73]" />
              <PipelineBadge label="MC" status={s.monteCarlo} />
              <ArrowRight size={10} className="text-[#6b6b73]" />
              <PipelineBadge label="ST" status={s.stressTest} />
              <ArrowRight size={10} className="text-[#6b6b73]" />
              <PipelineBadge label="Paper" status={s.paper === 'ACTIVE' || s.paper === 'TESTING' ? 'PASS' : s.paper === 'REJECTED' ? 'FAIL' : 'MARGINAL'} />
            </div>
          </div>
        ))}
      </div>

      {/* Promotion Pipeline */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <GitBranch size={14} className="text-[#a855f7]" />
          <span className="text-xs font-medium text-[#a0a0a8]">PIPELINE ПРОДВИЖЕНИЯ СТРАТЕГИИ</span>
          <span className="tooltip-wrapper">
            <span className="text-[10px] text-[#6b6b73] cursor-help">ⓘ</span>
            <span className="tooltip-content">Стратегия не может стать Champion только потому, что backtest прибыльный. Необходимо пройти ВСЕ этапы валидации</span>
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {promotionPipeline.map((p, i) => (
            <div key={i} className="flex items-start gap-3 bg-[#1a1a1d] rounded-md p-3">
              <div className="w-6 h-6 rounded-full bg-[#26262a] flex items-center justify-center flex-shrink-0 text-[10px] text-[#6b6b73] font-mono">
                {i + 1}
              </div>
              <div>
                <div className="text-xs text-[#e5e5e5] font-medium">{p.stage}</div>
                <div className="text-[10px] text-[#6b6b73]">{p.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overfitting Warning */}
      <div className="card border-[#f59e0b]/30 bg-[#f59e0b]/5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={16} className="text-[#f59e0b] mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs font-medium text-[#f59e0b]">КОНТРОЛЬ OVERFITTING</div>
            <div className="text-[11px] text-[#a0a0a8] mt-1 space-y-1">
              <p>• Каждая стратегия содержит 6-12 параметров. При малой выборке это высокий риск overfitting.</p>
              <p>• Проверяется: parameter sensitivity, neighboring parameter stability, OOS performance.</p>
              <p>• NO AUTOMATIC OPTIMIZATION TRAP: не оптимизируем сотни параметров ради max historical profit.</p>
              <p>• ROBUSTNESS &gt; MAXIMUM PROFIT: предпочитаем устойчивую конфигурацию, а не максимальный profit.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Version Tracking */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={14} className="text-[#3b82f6]" />
          <span className="text-xs font-medium text-[#a0a0a8]">ВЕРСИОНИРОВАНИЕ</span>
        </div>
        <div className="text-[11px] text-[#a0a0a8] space-y-1">
          <p>Каждая сделка хранит версии ВСЕХ компонентов:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
            <div className="bg-[#1a1a1d] rounded px-2 py-1">
              <span className="text-[#6b6b73]">strategy_version:</span> <span className="text-[#e5e5e5] font-mono">v0.3.1</span>
            </div>
            <div className="bg-[#1a1a1d] rounded px-2 py-1">
              <span className="text-[#6b6b73]">feature_version:</span> <span className="text-[#e5e5e5] font-mono">v1.2.0</span>
            </div>
            <div className="bg-[#1a1a1d] rounded px-2 py-1">
              <span className="text-[#6b6b73]">risk_version:</span> <span className="text-[#e5e5e5] font-mono">v2.0.0</span>
            </div>
            <div className="bg-[#1a1a1d] rounded px-2 py-1">
              <span className="text-[#6b6b73]">model_version:</span> <span className="text-[#e5e5e5] font-mono">N/A</span>
            </div>
          </div>
        </div>
      </div>

      {/* Experiment Tracking */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle size={14} className="text-[#22c55e]" />
          <span className="text-xs font-medium text-[#a0a0a8]">ПОСЛЕДНИЕ ЭКСПЕРИМЕНТЫ</span>
        </div>
        <div className="space-y-2">
          {[
            { id: 'EXP-047', hypothesis: 'TrendFollow с dynamic ATR stop', result: 'PASS → Paper', date: '2024-09-14' },
            { id: 'EXP-046', hypothesis: 'Breakout на M5 с volume filter', result: 'FAIL (OOS)', date: '2024-09-12' },
            { id: 'EXP-045', hypothesis: 'MeanReversion + RSI divergence', result: 'PASS → Paper', date: '2024-09-10' },
            { id: 'EXP-044', hypothesis: 'Liquidity sweep + reclaim', result: 'FAIL (WF)', date: '2024-09-08' },
          ].map(exp => (
            <div key={exp.id} className="flex items-center justify-between bg-[#1a1a1d] rounded px-3 py-2">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-[#6b6b73]">{exp.id}</span>
                <span className="text-[11px] text-[#a0a0a8]">{exp.hypothesis}</span>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={exp.result.includes('PASS') ? 'PASS' : 'FAIL'} size="sm" />
                <span className="text-[10px] text-[#6b6b73]">{exp.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PipelineBadge({ label, status }: { label: string; status: string }) {
  return (
    <div className="tooltip-wrapper">
      <div className={`px-2 py-1 rounded text-[10px] font-mono border ${
        status === 'PASS' ? 'border-[#22c55e]/30 text-[#22c55e] bg-[#22c55e]/5' :
        status === 'FAIL' ? 'border-[#ef4444]/30 text-[#ef4444] bg-[#ef4444]/5' :
        'border-[#f59e0b]/30 text-[#f59e0b] bg-[#f59e0b]/5'
      }`}>
        {label}: {status}
      </div>
      <div className="tooltip-content">
        {label === 'BT' && 'Backtest — исторический тест стратегии'}
        {label === 'OOS' && 'Out-of-Sample — тест на невиденных данных'}
        {label === 'WF' && 'Walk-Forward — скользящая валидация'}
        {label === 'MC' && 'Monte Carlo — стохастическое моделирование'}
        {label === 'ST' && 'Stress Test — экстремальные условия'}
        {label === 'Paper' && 'Paper Trading — виртуальная торговля'}
      </div>
    </div>
  );
}
