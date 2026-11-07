import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  ShieldCheck, Award, FileText, CheckCircle2, AlertCircle, 
  Send, RefreshCw, Layers, Database
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form for publishing new guideline
  const [scholarshipId, setScholarshipId] = useState(1);
  const [versionTag, setVersionTag] = useState('G.O. Ms. No. 72 (2026)');
  const [summary, setSummary] = useState('Biometric attendance threshold lowered from 75% to 65% for students participating in university athletic meets.');
  const [oldVal, setOldVal] = useState('{"attendance": "75% strictly mandatory"}');
  const [newVal, setNewVal] = useState('{"attendance": "65% for certified state athletes; 75% for regular"}');
  const [officialDoc, setOfficialDoc] = useState('Higher Education Department Circular No. 981');
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  useEffect(() => {
    async function loadMetrics() {
      setLoading(true);
      try {
        const data = await api.getAdminMetrics();
        setMetrics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    setPublishSuccess(false);
    try {
      // Direct call
      const res = await fetch(`/api/admin/publish-guideline-update?scholarship_id=${scholarshipId}&version_tag=${encodeURIComponent(versionTag)}&summary_of_changes=${encodeURIComponent(summary)}&old_values_json=${encodeURIComponent(oldVal)}&new_values_json=${encodeURIComponent(newVal)}&official_source_doc=${encodeURIComponent(officialDoc)}`, {
        method: 'POST'
      });
      if (res.ok) {
        setPublishSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">State Authority & Verification Admin Portal</h2>
            <span className="text-xs bg-slate-900 text-white font-bold px-2.5 py-0.5 rounded-full">
              Admin Access
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish verified government orders, inspect application pipelines, and update official rule parameters.
          </p>
        </div>
      </div>

      {/* Metrics Banner */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold block">Total Catalog Schemes</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{metrics.total_scholarships}</p>
            <span className="text-[11px] text-emerald-700 font-medium">100% Officially Verified</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold block">Active Applications</span>
            <p className="text-2xl font-black text-brand-700 mt-1">{metrics.total_applications}</p>
            <span className="text-[11px] text-slate-400">Tracked via Journey Engine</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold block">Registered Identities</span>
            <p className="text-2xl font-black text-emerald-700 mt-1">{metrics.total_registered_students}</p>
            <span className="text-[11px] text-emerald-600 font-medium">Verified Hashes Active</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold block">Active Guideline Versions</span>
            <p className="text-2xl font-black text-amber-700 mt-1">{metrics.active_guideline_versions}</p>
            <span className="text-[11px] text-slate-400">Synced to Change Detector</span>
          </div>
        </div>
      )}

      {/* Publish Guideline Update Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Send className="w-4 h-4 text-brand-600" />
          Publish Government Guideline Revision (Triggers Change Detector)
        </h3>

        {publishSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Guideline published! All student dashboards have received live Change Detector alerts.
          </div>
        )}

        <form onSubmit={handlePublish} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Scholarship Target:</label>
              <select
                value={scholarshipId}
                onChange={(e) => setScholarshipId(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value={1}>Telangana ePASS Post-Matric Scholarship</option>
                <option value={2}>National Scholarship Portal (CSSS)</option>
                <option value={3}>AICTE Pragati Scholarship for Girls</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Version / G.O. Reference Tag:</label>
              <input
                type="text"
                value={versionTag}
                onChange={(e) => setVersionTag(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Summary of Published Changes:</label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Previous Rule (JSON / Text):</label>
              <input
                type="text"
                value={oldVal}
                onChange={(e) => setOldVal(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Updated Active Rule (JSON / Text):</label>
              <input
                type="text"
                value={newVal}
                onChange={(e) => setNewVal(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={publishing}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-2 shadow-xs"
          >
            {publishing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Publish Guideline to Portal</span>
          </button>
        </form>
      </div>
    </div>
  );
};
