import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import GlossaryPage from './pages/GlossaryPage';
import InterrogationPage from './pages/InterrogationPage';
import GauntletPage from './pages/GauntletPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-ts-bg relative">
        <div className="grid-bg" />
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/interrogation" element={<InterrogationPage />} />
          <Route path="/gauntlet" element={<GauntletPage />} />
        </Routes>
      </div>
    </Router>
  );
}
