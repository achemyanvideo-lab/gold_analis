interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusColors: Record<string, string> = {
  // Connection states
  'CONNECTED': 'badge-green',
  'DISCONNECTED': 'badge-red',
  'OK': 'badge-green',
  'ERROR': 'badge-red',
  // Data states
  'LIVE': 'badge-green',
  'DELAYED': 'badge-orange',
  'STALE': 'badge-red',
  'UNAVAILABLE': 'badge-gray',
  'DEMO': 'badge-purple',
  'VALID': 'badge-green',
  'MISSING': 'badge-red',
  'CORRUPTED': 'badge-red',
  'SUSPICIOUS': 'badge-orange',
  // Signal states
  'BUY': 'badge-green',
  'SELL': 'badge-red',
  'WAIT': 'badge-orange',
  'NO_TRADE': 'badge-gray',
  // Risk states
  'APPROVED': 'badge-green',
  'REJECTED': 'badge-red',
  'PENDING': 'badge-orange',
  // Regime
  'TREND_UP': 'badge-green',
  'TREND_DOWN': 'badge-red',
  'RANGE': 'badge-blue',
  'BREAKOUT': 'badge-purple',
  'HIGH_VOLATILITY': 'badge-orange',
  'LOW_VOLATILITY': 'badge-gray',
  'TRANSITION': 'badge-orange',
  // Momentum
  'STRONG': 'badge-green',
  'MODERATE': 'badge-blue',
  'WEAK': 'badge-orange',
  'EXHAUSTED': 'badge-red',
  // Volatility
  'NORMAL': 'badge-blue',
  'VERY_LOW': 'badge-gray',
  'LOW': 'badge-gray',
  'HIGH': 'badge-orange',
  'EXTREME': 'badge-red',
  // Volume
  'ABOVE_AVG': 'badge-green',
  'BELOW_AVG': 'badge-gray',
  'ANOMALY': 'badge-orange',
  // Capital mode
  'HALTED': 'badge-red',
  'REDUCED_RISK': 'badge-orange',
  'RECOVERY': 'badge-blue',
  // Walk-forward
  'PASS': 'badge-green',
  'FAIL': 'badge-red',
  'MARGINAL': 'badge-orange',
  'BASELINE': 'badge-blue',
  // Trade quality
  'GOOD_WIN': 'badge-green',
  'BAD_WIN': 'badge-orange',
  'GOOD_LOSS': 'badge-blue',
  'BAD_LOSS': 'badge-red',
  // Mode
  'PAPER': 'badge-blue',
  'RESEARCH': 'badge-purple',
  'BACKTEST': 'badge-gold',
  // News
  'WEAKENING': 'badge-red',
  'STRENGTHENING': 'badge-green',
  'NEUTRAL': 'badge-gray',
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const colorClass = statusColors[status] || 'badge-gray';
  return (
    <span className={`badge ${colorClass} ${size === 'sm' ? 'text-[10px] px-1.5 py-0' : ''}`}>
      {status === 'CONNECTED' || status === 'OK' || status === 'LIVE' ? (
        <span className="pulse-dot bg-current" style={{ width: 6, height: 6 }} />
      ) : null}
      {status}
    </span>
  );
}
