import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import Signal from './pages/Signal';
import Risk from './pages/Risk';
import Backtest from './pages/Backtest';
import WalkForward from './pages/WalkForward';
import MonteCarlo from './pages/MonteCarlo';
import StressTest from './pages/StressTest';
import PaperTrading from './pages/PaperTrading';
import Research from './pages/Research';
import TradeJournal from './pages/TradeJournal';
import Settings from './pages/Settings';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'market': return <Market />;
      case 'signal': return <Signal />;
      case 'risk': return <Risk />;
      case 'backtest': return <Backtest />;
      case 'walkforward': return <WalkForward />;
      case 'montecarlo': return <MonteCarlo />;
      case 'stress': return <StressTest />;
      case 'paper': return <PaperTrading />;
      case 'research': return <Research />;
      case 'journal': return <TradeJournal />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0b]">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}
