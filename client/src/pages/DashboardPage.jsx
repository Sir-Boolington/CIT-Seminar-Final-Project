import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="relative z-10 px-7 py-7 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-ts-text mb-1">Welcome back, {user.username || 'Agent'}</h1>
        <p className="text-xs text-ts-text3">Your training overview and session history</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total sessions', value: '—', color: 'text-ts-accent2' },
          { label: 'Overall score', value: '—', color: 'text-ts-green' },
          { label: 'Current streak', value: '—', color: 'text-ts-amber' },
          { label: 'Accuracy', value: '—', color: 'text-ts-text' },
        ].map((stat) => (
          <div key={stat.label} className="bg-ts-surface border border-ts-border rounded-lg p-4">
            <p className="text-[11px] text-ts-text3 mb-1">{stat.label}</p>
            <p className={`text-2xl font-medium ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
      <h2 className="text-sm font-medium text-ts-text mb-3">Start a session</h2>
      <div className="flex gap-3 mb-8">
        <Link to="/interrogation" className="flex-1 bg-ts-surface border border-ts-border rounded-lg p-5 hover:border-ts-border-h transition-colors group">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-ts-accent2 mb-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </div>
          <h3 className="text-sm font-medium text-ts-text mb-1 group-hover:text-ts-accent2 transition-colors">Interrogation Room</h3>
          <p className="text-[11px] text-ts-text3">Chat with an AI persona and detect the threat</p>
        </Link>
        <Link to="/gauntlet" className="flex-1 bg-ts-surface border border-ts-border rounded-lg p-5 hover:border-ts-border-h transition-colors group">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-ts-amber mb-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
          </div>
          <h3 className="text-sm font-medium text-ts-text mb-1 group-hover:text-ts-amber transition-colors">Threat Gauntlet</h3>
          <p className="text-[11px] text-ts-text3">Face timed scenario cards across multiple formats</p>
        </Link>
      </div>
      <h2 className="text-sm font-medium text-ts-text mb-3">Recent sessions</h2>
      <div className="bg-ts-surface border border-ts-border rounded-lg p-8 text-center">
        <p className="text-sm text-ts-text3 mb-2">No sessions yet</p>
        <p className="text-[11px] text-ts-text3">Complete your first training session to see your history here.</p>
      </div>
    </div>
  );
}
