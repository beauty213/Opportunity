import React, { useState, useEffect } from 'react';
import { Application } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckCircle2, Clock, AlertTriangle, ArrowRight, ShieldCheck, 
  ExternalLink, Calendar, RefreshCw, Send, FileText
} from 'lucide-react';

const ALL_STAGES = [
  "Discovered", "Shortlisted", "Eligibility Checked", "Documents Prepared",
  "Ready to Apply", "Submitted", "Under Verification", "Correction Requested",
  "Approved", "Payment Pending", "Disbursed", "Renewal Due"
];

interface JourneyProps {
  onNavigate: (tab: string) => void;
}

export const ApplicationJourneyView: React.FC<JourneyProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const data = await api.getApplications(currentUser?.id || 1);
      setApplications(data);
      if (data.length > 0) {
        setSelectedApp(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [currentUser]);

  const handleAdvanceStage = async (newStage: string) => {
    if (!selectedApp) return;
    try {
      await api.updateApplicationStage(selectedApp.id, newStage, `Advanced manually to ${newStage} during demonstration.`);
      await fetchApps();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Application Journey Navigator</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your exact standing across the 12 scholarship milestones with automated next-action recommendations.
          </p>
        </div>

        {applications.length > 1 && (
          <select
            value={selectedApp?.id}
            onChange={(e) => {
              const app = applications.find(a => a.id === Number(e.target.value));
              if (app) setSelectedApp(app);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800"
          >
            {applications.map(a => (
              <option key={a.id} value={a.id}>{a.scholarship_title}</option>
            ))}
          </select>
        )}
      </div>

      {!selectedApp ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
          <p className="text-slate-500 text-sm">No active applications currently tracked.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Application Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Target Government Scheme
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                  {selectedApp.scholarship_title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Portal: <strong className="text-slate-800">{selectedApp.portal_name}</strong> | Ref No: <strong className="text-slate-800 font-mono">{selectedApp.application_reference_no || 'Draft'}</strong>
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 block">Current Verified Stage</span>
                <span className="inline-block px-3 py-1 bg-brand-100 text-brand-800 font-bold text-sm rounded-full mt-1 border border-brand-200">
                  {selectedApp.current_stage}
                </span>
              </div>
            </div>

            {/* Next Recommended Action Banner */}
            <div className="bg-brand-50 border border-brand-200 p-4 rounded-xl flex items-start gap-3">
              <div className="p-2 bg-brand-200 text-brand-900 rounded-lg shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-800 block">
                  Next Recommended Action
                </span>
                <p className="text-xs sm:text-sm font-semibold text-brand-950 mt-0.5">
                  {selectedApp.next_action_recommendation}
                </p>
              </div>
            </div>
          </div>

          {/* 12-Stage Visual Stepper Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-900 text-base">Complete 12-Stage Lifecycle Progress</h4>
            
            <div className="overflow-x-auto pb-4 pt-2">
              <div className="flex items-center min-w-[900px] justify-between relative">
                {/* Horizontal progress bar background */}
                <div className="absolute left-6 right-6 top-4 h-1 bg-slate-200 -z-0" />

                {ALL_STAGES.map((stg, idx) => {
                  const currentIdx = ALL_STAGES.indexOf(selectedApp.current_stage);
                  const isPassed = idx < currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div 
                      key={stg} 
                      onClick={() => handleAdvanceStage(stg)}
                      className="flex flex-col items-center z-10 cursor-pointer group"
                      title="Click to simulate stage transition"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isCurrent
                          ? 'bg-brand-700 text-white ring-4 ring-brand-100 shadow-md scale-110'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border-2 border-slate-300 text-slate-400 group-hover:border-slate-500'
                      }`}>
                        {isPassed ? '✓' : idx + 1}
                      </div>

                      <span className={`text-[11px] font-medium text-center mt-2 max-w-[85px] leading-tight ${
                        isCurrent ? 'font-bold text-brand-900' : isPassed ? 'text-slate-800' : 'text-slate-400'
                      }`}>
                        {stg}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center italic">
              💡 Tip: Click on any stage above to simulate lifecycle advancement for demo evaluation.
            </p>
          </div>

          {/* Event History Transcript */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" />
              Application Audit Log & History
            </h4>

            <div className="space-y-3">
              {selectedApp.events.map((evt) => (
                <div key={evt.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <h5 className="font-bold text-slate-900">{evt.event_title}</h5>
                    <p className="text-slate-600 mt-0.5">{evt.event_description}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Source: {evt.source}</span>
                  </div>

                  <span className="text-slate-400 shrink-0 font-mono text-[11px]">
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
