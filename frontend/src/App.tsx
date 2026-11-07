import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { StudentProvider } from './context/StudentContext';

import { Navbar } from './components/layout/Navbar';
import { FraudAlertModal } from './components/layout/FraudAlertModal';
import { AICopilotDrawer } from './components/copilot/AICopilotDrawer';

import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { ScholarshipDiscovery } from './components/scholarships/ScholarshipDiscovery';
import { EligibilityAnalysisView } from './components/eligibility/EligibilityAnalysisView';
import { ZeroRepeatVisitView } from './components/zero_visit/ZeroRepeatVisitView';
import { DocumentVaultView } from './components/documents/DocumentVaultView';
import { CrossDocumentAuditView } from './components/documents/CrossDocumentAuditView';
import { ApplicationJourneyView } from './components/applications/ApplicationJourneyView';
import { RejectionRecoveryView } from './components/applications/RejectionRecoveryView';
import { SmartDeadlinePlannerView } from './components/planner/SmartDeadlinePlannerView';
import { FundingGapCalculatorView } from './components/planner/FundingGapCalculatorView';
import { ScholarshipChangeDetectorView } from './components/changes/ScholarshipChangeDetectorView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';

import { GraduationCap, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedScholarshipId, setSelectedScholarshipId] = useState<number>(1);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isFraudModalOpen, setIsFraudModalOpen] = useState(false);
  const [docSubView, setDocSubView] = useState<'vault' | 'audit'>('vault');

  const handleSelectScholarship = (id: number) => {
    setSelectedScholarshipId(id);
    setActiveTab('eligibility');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openCopilot={() => setIsCopilotOpen(true)}
        openFraudModal={() => setIsFraudModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <StudentDashboard onNavigate={setActiveTab} />
        )}

        {activeTab === 'discovery' && (
          <ScholarshipDiscovery
            onSelectScholarship={handleSelectScholarship}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'eligibility' && (
          <EligibilityAnalysisView
            initialScholarshipId={selectedScholarshipId}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'zeroVisit' && (
          <ZeroRepeatVisitView onNavigate={setActiveTab} />
        )}

        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => setDocSubView('vault')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  docSubView === 'vault' ? 'bg-brand-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Document Vault & Uploads
              </button>
              <button
                onClick={() => setDocSubView('audit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  docSubView === 'audit' ? 'bg-brand-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Cross-Document Consistency Matrix
              </button>
            </div>

            {docSubView === 'vault' ? (
              <DocumentVaultView onNavigate={setActiveTab} />
            ) : (
              <CrossDocumentAuditView />
            )}
          </div>
        )}

        {activeTab === 'journey' && (
          <ApplicationJourneyView onNavigate={setActiveTab} />
        )}

        {activeTab === 'rejectionRecovery' && (
          <RejectionRecoveryView />
        )}

        {activeTab === 'deadlines' && (
          <SmartDeadlinePlannerView />
        )}

        {activeTab === 'fundingGap' && (
          <FundingGapCalculatorView />
        )}

        {activeTab === 'changeDetector' && (
          <ScholarshipChangeDetectorView />
        )}

        {activeTab === 'admin' && (
          <AdminDashboardView />
        )}
      </main>

      {/* Floating Copilot Quick Trigger */}
      <button
        onClick={() => setIsCopilotOpen(true)}
        className="fixed bottom-6 right-6 z-30 p-3.5 bg-brand-700 hover:bg-brand-800 text-white rounded-full shadow-xl hover:scale-105 transition-all flex items-center gap-2 group font-semibold text-xs border border-brand-500"
        title="Open AI Financial Aid Copilot"
      >
        <GraduationCap className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">Ask ScholarEase Copilot</span>
      </button>

      {/* Slide-over Copilot Drawer */}
      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        onNavigate={setActiveTab}
      />

      {/* Anti-Fraud Modal */}
      <FraudAlertModal
        isOpen={isFraudModalOpen}
        onClose={() => setIsFraudModalOpen(false)}
      />

      {/* Official Footnote & Links */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xs">
                S
              </div>
              <span className="font-bold text-slate-200">ScholarEase</span>
              <span className="text-slate-500">| Regional Implementation: Telangana & Central Schemes</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <a
                href="https://telanganaepass.cgg.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-200 flex items-center gap-1"
              >
                <span>Telangana ePASS</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://scholarships.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-200 flex items-center gap-1"
              >
                <span>National Scholarship Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://www.aicte-india.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-200 flex items-center gap-1"
              >
                <span>AICTE India</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center sm:text-left leading-relaxed">
            ScholarEase provides rule-based educational matching and administrative visit readiness assistance. 
            Official scholarship sanction is exclusively determined by authorized government welfare departments and verified institutions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <StudentProvider>
          <MainApp />
        </StudentProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
