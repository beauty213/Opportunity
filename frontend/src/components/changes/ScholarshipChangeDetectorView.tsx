import React, { useState, useEffect } from 'react';
import { GuidelineChangeItem } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Bell, FileDiff, ShieldCheck, CheckCircle2, AlertTriangle, 
  ArrowRight, ExternalLink, RefreshCw, Calendar
} from 'lucide-react';

export const ScholarshipChangeDetectorView: React.FC = () => {
  const { currentUser } = useAuth();
  const [changes, setChanges] = useState<GuidelineChangeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChanges() {
      setLoading(true);
      try {
        const data = await api.getGuidelineChanges(currentUser?.id || 1);
        setChanges(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadChanges();
  }, [currentUser]);

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
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Scholarship Guideline Change Detector</h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              Automated Sentinel
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tracks government orders, income ceiling revisions, deadline extensions, and alerts you to personalized profile impacts.
          </p>
        </div>
      </div>

      {/* Changes List */}
      <div className="space-y-4">
        {changes.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-brand-300 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full">
                  {item.version_tag}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  {item.scholarship_title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official Source: <strong className="text-slate-800">{item.official_document_ref}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Detected: {item.publication_date}</span>
              </div>
            </div>

            {/* Side-by-Side Diff Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1">
                <span className="font-sans font-bold text-[11px] uppercase tracking-wider text-rose-800 block">
                  Previous Published Rule
                </span>
                <pre className="text-rose-950 whitespace-pre-wrap font-sans text-xs pt-1">
                  {item.previous_rule}
                </pre>
              </div>

              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                <span className="font-sans font-bold text-[11px] uppercase tracking-wider text-emerald-800 block">
                  Updated / Active Rule
                </span>
                <pre className="text-emerald-950 whitespace-pre-wrap font-sans text-xs pt-1">
                  {item.updated_rule}
                </pre>
              </div>
            </div>

            {/* Impact on Student Profile Card */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs sm:text-sm ${
              item.user_action_required 
                ? 'bg-amber-50 border-amber-300 text-amber-950' 
                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}>
              <div className="mt-0.5 shrink-0">
                {item.user_action_required ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                )}
              </div>
              <div>
                <span className="font-bold block">
                  Impact on Your Profile ({currentUser?.full_name}):
                </span>
                <p className="mt-0.5 leading-relaxed">{item.impact_on_user_profile}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
