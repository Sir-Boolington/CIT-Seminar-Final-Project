import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

export default function DashboardPage() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
    fetchProfile();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/sessions/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data.stats);
      setSessions(res.data.sessions);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load session history.');
    } finally {
      setLoading(false);
    }
  };

  //for streak logic
  const fetchProfile = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setUser(res.data.user);

  } catch (err) {
    console.error('Failed to fetch profile');
  }
};

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'easy': return <span className="text-[9px] px-2 py-0.5 rounded-full font-medium bg-green-500/10 text-ts-green">Beginner</span>;
      case 'medium': return <span className="text-[9px] px-2 py-0.5 rounded-full font-medium bg-amber-500/10 text-ts-amber">Intermediate</span>;
      case 'hard': return <span className="text-[9px] px-2 py-0.5 rounded-full font-medium bg-red-500/10 text-ts-red">Expert</span>;
      default: return null;
    }
  };

  const getModeBadge = (mode) => {
    switch (mode) {
      case 'gauntlet': return <span className="text-[9px] px-2 py-0.5 rounded-full font-medium bg-amber-500/10 text-ts-amber">Gauntlet</span>;
      case 'interrogation': return <span className="text-[9px] px-2 py-0.5 rounded-full font-medium bg-indigo-500/10 text-ts-accent2">Interrogation</span>;
      default: return null;
    }
  };

  return (
    <div className="relative z-10 px-7 py-7 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-ts-text mb-1">Welcome back, {user.username || 'Agent'}</h1>
        <p className="text-xs text-ts-text3">Your training overview and session history</p>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-ts-red">{error}</div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {[
          { label: 'Total sessions', value: loading ? '...' : (stats?.completed_sessions || 0), color: 'text-ts-accent2' },
          { label: 'Overall score', value: loading ? '...' : (stats?.avg_score ? `${stats.avg_score}%` : '—'), color: 'text-ts-green' },
      {label: 'Daily streak', value: loading ? '...' : `${user?.current_streak || 1} day(s)`, color: 'text-ts-amber' },
      {label: 'Badges', value: loading ? '...' : 'Coming soon...', color: 'text-ts-purple' }
        ].map((stat) => (
          <div key={stat.label} className="bg-ts-surface border border-ts-border rounded-lg p-4">
            <p className="text-[11px] text-ts-text3 mb-1">{stat.label}</p>
            <p className={`text-2xl font-medium ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Start a session */}
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

      {/* Recent sessions */}
      <h2 className="text-sm font-medium text-ts-text mb-3">Recent sessions</h2>
      {loading ? (
        <div className="bg-ts-surface border border-ts-border rounded-lg p-8 text-center">
          <p className="text-sm text-ts-text3">Loading session history...</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-ts-surface border border-ts-border rounded-lg p-8 text-center">
          <p className="text-sm text-ts-text3 mb-2">No sessions yet</p>
          <p className="text-[11px] text-ts-text3">Complete your first training session to see your history here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {sessions.map((session) => {
            const isComplete = !!session.ended_at;
            const attempts = session.attempts;

            return (
              <div
                key={session.session_id}
                className="bg-ts-surface border border-ts-border rounded-lg p-4 hover:border-ts-border-h transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getModeBadge(session.mode_type)}
                    {getDifficultyBadge(session.difficulty)}
                    {!isComplete && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full font-medium bg-ts-surface2 text-ts-text3 border border-ts-border">
                        In progress
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-ts-text3">
                    {formatDate(session.started_at)} {formatTime(session.started_at)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Score */}
                    <div>
                      <p className="text-[9px] text-ts-text3">Score</p>
                      <p className={`text-sm font-medium ${
                        session.score_percent >= 70 ? 'text-ts-green' :
                        session.score_percent >= 40 ? 'text-ts-amber' :
                        'text-ts-text2'
                      }`}>
                        {session.score_percent || 0}%
                      </p>
                    </div>

                    {/* Scenarios attempted */}
                    <div>
                      <p className="text-[9px] text-ts-text3">Attempted</p>
                      <p className="text-sm font-medium text-ts-text2">
                        {attempts.total_attempts}{session.total_scenarios ? `/${session.total_scenarios}` : ''}
                      </p>
                    </div>

                    {/* Result breakdown */}
                    {attempts.total_attempts > 0 && (
                      <div className="flex items-center gap-2">
                        {attempts.correct > 0 && (
                          <span className="text-[9px] text-ts-green">✓ {attempts.correct}</span>
                        )}
                        {attempts.partial > 0 && (
                          <span className="text-[9px] text-ts-amber">◐ {attempts.partial}</span>
                        )}
                        {attempts.incorrect > 0 && (
                          <span className="text-[9px] text-ts-red">✗ {attempts.incorrect}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
