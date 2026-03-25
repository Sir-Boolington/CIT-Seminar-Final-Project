import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(localStorage.getItem('user') || '{}') : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="relative z-10 flex items-center justify-between px-7 py-4 border-b border-ts-border">
      <Link to="/" className="flex items-center gap-2 font-mono font-medium text-[15px] text-ts-text">
        <div className="w-[26px] h-[26px] bg-ts-accent rounded-md flex items-center justify-center text-[13px] text-white font-medium">
          TS
        </div>
        ThreatSim
      </Link>

      {user ? (
        <>
          <div className="flex gap-5 text-xs text-ts-text2">
            <Link to="/dashboard" className="hover:text-ts-text transition-colors">Dashboard</Link>
            <Link to="/interrogation" className="hover:text-ts-text transition-colors">Interrogation Room</Link>
            <Link to="/gauntlet" className="hover:text-ts-text transition-colors">Threat Gauntlet</Link>
            <Link to="/glossary" className="hover:text-ts-text transition-colors">Glossary</Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-ts-text2">{user.username}</span>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-md text-xs text-ts-text2 border border-ts-border hover:border-ts-border-h transition-colors"
            >
              Log out
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex gap-5 text-xs text-ts-text2">
            <Link to="/glossary" className="hover:text-ts-text transition-colors">Glossary</Link>
          </div>
          <div className="flex gap-2">
            <Link to="/login" className="px-3.5 py-1.5 rounded-md text-xs text-ts-text2 border border-ts-border hover:border-ts-border-h transition-colors">
              Log in
            </Link>
            <Link to="/register" className="px-3.5 py-1.5 rounded-md text-xs text-white bg-ts-accent hover:bg-indigo-500 transition-colors font-medium">
              Sign up free
            </Link>
          </div>
        </>
      )}
    </nav>
  );
}
