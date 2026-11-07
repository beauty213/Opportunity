import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  GraduationCap, Globe, Zap, AlertTriangle, ShieldCheck, 
  MessageSquare, UserCircle, CheckCircle, RefreshCw
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openCopilot: () => void;
  openFraudModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openCopilot,
  openFraudModal
}) => {
  const { currentUser, users, switchUser, isLowBandwidth, toggleLowBandwidth } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard },
    { id: 'discovery', label: t.nav.discovery },
    { id: 'eligibility', label: t.nav.eligibility },
    { id: 'zeroVisit', label: t.nav.zeroVisit, highlight: true },
    { id: 'documents', label: t.nav.documents },
    { id: 'journey', label: t.nav.journey },
    { id: 'rejectionRecovery', label: t.nav.rejectionRecovery },
    { id: 'deadlines', label: t.nav.deadlines },
    { id: 'fundingGap', label: t.nav.fundingGap },
    { id: 'changeDetector', label: t.nav.changeDetector },
    { id: 'admin', label: t.nav.admin }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Demo Bar & Quick Utilities */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Hackathon Demo Switcher:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {users.map(u => (
                <button
                  key={u.id}
                  onClick={() => switchUser(u.id)}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
                    currentUser?.id === u.id
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {u.id === 1 ? '👤 Rahul Korra (Lateral Entry B.Tech)' : u.id === 2 ? '⚠️ Sneha Patel (Rejection Case)' : '🛡️ Admin'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Low-Bandwidth Mode */}
            <button
              onClick={toggleLowBandwidth}
              className={`flex items-center gap-1 px-2 py-0.5 rounded transition-all ${
                isLowBandwidth ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="Low-Bandwidth Mode disables heavy assets for 2G/3G connections"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{isLowBandwidth ? 'Low-Bandwidth: ON' : 'Data Saver'}</span>
            </button>

            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-800 rounded px-1.5 py-0.5">
              <Globe className="w-3 h-3 text-slate-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
              >
                <option value="en" className="bg-slate-900">English</option>
                <option value="te" className="bg-slate-900">తెలుగు (Telugu)</option>
                <option value="hi" className="bg-slate-900">हिन्दी (Hindi)</option>
              </select>
            </div>

            {/* Fraud Awareness Button */}
            <button
              onClick={openFraudModal}
              className="text-amber-300 hover:text-amber-200 flex items-center gap-1 font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Anti-Fraud Check</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-700 flex items-center justify-center text-white shadow-md shadow-brand-700/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors">
                  ScholarEase
                </span>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full border border-emerald-200">
                  Telangana & All-India
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                AI Educational Financial Assistance Platform
              </p>
            </div>
          </div>

          {/* Quick Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={openCopilot}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 font-medium text-sm transition-all border border-brand-200 shadow-xs"
            >
              <MessageSquare className="w-4 h-4 text-brand-600" />
              <span className="hidden sm:inline">AI Financial Aid Copilot</span>
              <span className="sm:hidden">Copilot</span>
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs">
                {currentUser?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="hidden md:block text-left text-xs">
                <p className="font-semibold text-slate-900 leading-tight">{currentUser?.full_name}</p>
                <p className="text-slate-500 capitalize">{currentUser?.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none border-t border-slate-100 pt-1 text-sm font-medium">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === item.id
                  ? 'bg-brand-700 text-white shadow-xs font-semibold'
                  : item.highlight
                  ? 'bg-amber-50 text-amber-900 hover:bg-amber-100 font-semibold border border-amber-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {item.highlight && <Zap className="w-3.5 h-3.5 text-amber-600" />}
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
