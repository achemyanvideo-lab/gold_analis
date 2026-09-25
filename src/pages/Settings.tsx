import { useState } from 'react';
import { Settings as SettingsIcon, AlertTriangle, CheckCircle, Database, Wifi, Shield } from 'lucide-react';

export default function Settings() {
  const [mt5Login, setMt5Login] = useState('');
  const [mt5Server, setMt5Server] = useState('');

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Настройки</h1>
        <p className="text-xs text-[#6b6b73] mt-1">Конфигурация системы. Все параметры вынесены из кода. Секреты хранятся в .env, не в source code.</p>
      </div>

      {/* Security Warning */}
      <div className="card border-[#ef4444]/30 bg-[#ef4444]/5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={16} className="text-[#ef4444] mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs font-medium text-[#ef4444]">БЕЗОПАСНОСТЬ</div>
            <div className="text-[11px] text-[#a0a0a8] mt-1">
              Никогда не записывайте пароли и API-ключи в код. Используйте .env файл (в .gitignore).
              Пароли и токены НЕ логируются.
            </div>
          </div>
        </div>
      </div>

      {/* MT5 Connection */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Wifi size={14} className="text-[#3b82f6]" />
          <span className="text-xs font-medium text-[#a0a0a8]">ПОДКЛЮЧЕНИЕ MT5</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-[#6b6b73] block mb-1">Login</label>
            <input
              type="text"
              value={mt5Login}
              onChange={e => setMt5Login(e.target.value)}
              placeholder="Ваш MT5 login"
              className="w-full bg-[#1a1a1d] border border-[#26262a] rounded px-3 py-2 text-xs text-[#e5e5e5] focus:border-[#d4a017] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-[#6b6b73] block mb-1">Server</label>
            <input
              type="text"
              value={mt5Server}
              onChange={e => setMt5Server(e.target.value)}
              placeholder="Например: MetaQuotes-Demo"
              className="w-full bg-[#1a1a1d] border border-[#26262a] rounded px-3 py-2 text-xs text-[#e5e5e5] focus:border-[#d4a017] focus:outline-none"
            />
          </div>
        </div>
        <div className="mt-3 text-[10px] text-[#6b6b73]">
          Password хранится только в .env и не отображается в UI. Подключение выполняется через Python backend.
        </div>
      </div>

      {/* Trading Mode */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={14} className="text-[#d4a017]" />
          <span className="text-xs font-medium text-[#a0a0a8]">РЕЖИМ ТОРГОВЛИ</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <ModeCard mode="RESEARCH" active={false} tooltip="Исследовательский режим. Только анализ данных, без торговли" />
          <ModeCard mode="BACKTEST" active={false} tooltip="Режим бэктеста. Тестирование стратегий на исторических данных" />
          <ModeCard mode="PAPER" active={true} tooltip="Виртуальная торговля на реальных данных. Текущий режим" />
          <ModeCard mode="LIVE" active={false} disabled tooltip="Реальная торговля. ЗАБЛОКИРОВАНО. Требует прохождения всех validation gates" />
        </div>
        <div className="mt-4 p-3 bg-[#ef4444]/5 border border-[#ef4444]/20 rounded">
          <div className="text-[10px] text-[#ef4444] font-medium">LIVE TRADING = FALSE</div>
          <div className="text-[10px] text-[#a0a0a8] mt-1">
            Реальная торговля физически заблокирована в конфигурации. Для активации требуется:
            прохождение backtest, walk-forward, Monte Carlo, stress test, paper trading,
            ручное подтверждение, проверка risk engine, отсутствие критических ошибок.
          </div>
        </div>
      </div>

      {/* LIVE Gate Checklist */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle size={14} className="text-[#22c55e]" />
          <span className="text-xs font-medium text-[#a0a0a8]">LIVE GATE CHECKLIST</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { label: 'Data Quality', status: 'DEMO ONLY' },
            { label: 'Backtest', status: 'PASS (с предупреждениями)' },
            { label: 'Out-of-Sample', status: 'MARGINAL' },
            { label: 'Walk-Forward', status: 'FAIL (2 окна)' },
            { label: 'Monte Carlo', status: 'PASS' },
            { label: 'Stress Test', status: 'MARGINAL' },
            { label: 'Paper Trading', status: 'IN PROGRESS' },
            { label: 'Risk Engine', status: 'PASS' },
            { label: 'Execution', status: 'NOT TESTED (MT5 offline)' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between bg-[#1a1a1d] rounded px-3 py-2">
              <span className="text-[11px] text-[#a0a0a8]">{item.label}</span>
              <span className={`text-[10px] font-mono ${
                item.status.includes('PASS') ? 'text-[#22c55e]' :
                item.status.includes('FAIL') || item.status.includes('DEMO') ? 'text-[#ef4444]' :
                'text-[#f59e0b]'
              }`}>{item.status}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 text-center">
          <span className="badge badge-red">LIVE BLOCKED — критические пункты не пройдены</span>
        </div>
      </div>

      {/* Risk Configuration */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <SettingsIcon size={14} className="text-[#a855f7]" />
          <span className="text-xs font-medium text-[#a0a0a8]">КОНФИГУРАЦИЯ РИСКА</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <ConfigField label="Risk per trade (%)" value="1.0" tooltip="Максимальный риск на одну сделку" />
          <ConfigField label="Daily risk limit (%)" value="3.0" tooltip="Максимальный дневной риск" />
          <ConfigField label="Weekly risk limit (%)" value="6.0" tooltip="Максимальный недельный риск" />
          <ConfigField label="Max drawdown (%)" value="15.0" tooltip="Максимальная просадка до остановки" />
          <ConfigField label="Max consecutive losses" value="5" tooltip="Макс. серия убытков" />
          <ConfigField label="Max open positions" value="2" tooltip="Макс. одновременных позиций" />
          <ConfigField label="Max spread (pts)" value="50" tooltip="Максимальный допустимый спред" />
          <ConfigField label="Min R:R" value="1.5" tooltip="Минимальное соотношение риск/прибыль" />
          <ConfigField label="News window (min)" value="5" tooltip="Запрет входа за N минут до новостей" />
        </div>
      </div>

      {/* Database */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Database size={14} className="text-[#22c55e]" />
          <span className="text-xs font-medium text-[#a0a0a8]">БАЗА ДАННЫХ</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-[11px]">
          <div><span className="text-[#6b6b73]">Движок:</span> <span className="text-[#e5e5e5]">SQLite</span></div>
          <div><span className="text-[#6b6b73]">Файл:</span> <span className="text-[#e5e5e5] font-mono">gold_quant.db</span></div>
          <div><span className="text-[#6b6b73]">Статус:</span> <span className="text-[#22c55e]">OK</span></div>
          <div><span className="text-[#6b6b73]">Миграция:</span> <span className="text-[#e5e5e5]">v1.0.0</span></div>
          <div><span className="text-[#6b6b73]">Таблиц:</span> <span className="text-[#e5e5e5]">14</span></div>
          <div><span className="text-[#6b6b73]">Upgrade:</span> <span className="text-[#a0a0a8]">PostgreSQL-ready</span></div>
        </div>
      </div>

      {/* .env.example */}
      <div className="card">
        <div className="text-xs font-medium text-[#a0a0a8] mb-3">.env.example</div>
        <pre className="bg-[#0a0a0b] rounded p-3 text-[10px] font-mono text-[#a0a0a8] overflow-x-auto">
{`MT5_LOGIN=
MT5_PASSWORD=
MT5_SERVER=

LIVE_TRADING=false

DATABASE_URL=sqlite:///gold_quant.db

LOG_LEVEL=INFO

# External data (optional)
DXY_SYMBOL=
FUTURES_SYMBOL=
NEWS_API_KEY=`}
        </pre>
      </div>
    </div>
  );
}

function ModeCard({ mode, active, disabled, tooltip }: { mode: string; active: boolean; disabled?: boolean; tooltip: string }) {
  return (
    <div className="tooltip-wrapper">
      <div className={`rounded-md p-3 border text-center ${
        disabled ? 'border-[#ef4444]/30 bg-[#ef4444]/5 opacity-60' :
        active ? 'border-[#d4a017]/30 bg-[#d4a017]/10' :
        'border-[#26262a] bg-[#1a1a1d]'
      }`}>
        <div className={`text-xs font-medium ${active ? 'text-[#d4a017]' : disabled ? 'text-[#ef4444]' : 'text-[#a0a0a8]'}`}>{mode}</div>
        {active && <div className="text-[9px] text-[#22c55e] mt-1">АКТИВЕН</div>}
        {disabled && <div className="text-[9px] text-[#ef4444] mt-1">ЗАБЛОКИРОВАНО</div>}
      </div>
      <div className="tooltip-content">{tooltip}</div>
    </div>
  );
}

function ConfigField({ label, value, tooltip }: { label: string; value: string; tooltip: string }) {
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
