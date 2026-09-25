import { useState } from 'react';
import {
  LayoutDashboard, TrendingUp, Activity, Shield, BarChart3,
  GitBranch, Shuffle, AlertTriangle, FileText, BookOpen,
  Settings, Zap, Eye
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Панель управления', icon: LayoutDashboard, tooltip: 'Обзор системы: подключение, рынок, сигнал, риск' },
  { id: 'market', label: 'Рынок', icon: TrendingUp, tooltip: 'Графики золота, multi-timeframe анализ' },
  { id: 'signal', label: 'Сигнал', icon: Zap, tooltip: 'Текущий торговый сигнал и объяснение решения' },
  { id: 'risk', label: 'Риск-менеджмент', icon: Shield, tooltip: 'Лимиты риска, размер позиции, kill switch' },
  { id: 'backtest', label: 'Бэктест', icon: BarChart3, tooltip: 'Результаты исторического тестирования стратегии' },
  { id: 'walkforward', label: 'Walk-Forward', icon: GitBranch, tooltip: 'Скользящая валидация на разных периодах' },
  { id: 'montecarlo', label: 'Монте-Карло', icon: Shuffle, tooltip: 'Стохастическое моделирование результатов' },
  { id: 'stress', label: 'Стресс-тесты', icon: AlertTriangle, tooltip: 'Тестирование в экстремальных условиях' },
  { id: 'paper', label: 'Paper Trading', icon: FileText, tooltip: 'Виртуальная торговля на реальных данных' },
  { id: 'research', label: 'Исследования', icon: BookOpen, tooltip: 'Champion/Challenger, версии стратегий' },
  { id: 'journal', label: 'Журнал сделок', icon: Eye, tooltip: 'Полный audit trail всех решений' },
  { id: 'settings', label: 'Настройки', icon: Settings, tooltip: 'Конфигурация системы, подключение MT5' },
];

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`flex flex-col h-full bg-[#0d0d0f] border-r border-[#26262a] transition-all duration-200 ${collapsed ? 'w-16' : 'w-56'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-[#26262a]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4a017] to-[#8b6914] flex items-center justify-center flex-shrink-0">
          <span className="text-black font-bold text-sm">Au</span>
        </div>
        {!collapsed && (
          <div>
            <div className="text-sm font-semibold text-[#e5e5e5]">GOLD QUANT</div>
            <div className="text-[10px] text-[#6b6b73]">v0.1.0-alpha</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="tooltip-wrapper w-full mb-0.5">
              <div
                className={`sidebar-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <Icon size={16} className="flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </div>
              <div className="tooltip-content" style={{ left: collapsed ? '100%' : '50%', bottom: collapsed ? 'auto' : undefined, top: collapsed ? '50%' : undefined, transform: collapsed ? 'translateY(-50%) translateX(8px)' : 'translateX(-50%)' }}>
                {item.tooltip}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Collapse button */}
      <div className="p-2 border-t border-[#26262a]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="sidebar-item w-full justify-center"
        >
          <span className="text-[10px]">{collapsed ? '→' : '←'}</span>
        </button>
      </div>
    </aside>
  );
}
