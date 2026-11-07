import React, { useState } from 'react';
import { ProblemSolverResponse } from '../../types';
import { api } from '../../services/api';
import { 
  AlertTriangle, ShieldAlert, ArrowRight, ExternalLink, 
  CheckCircle2, Sparkles, RefreshCw, PhoneCall, HelpCircle
} from 'lucide-react';

export const RejectionRecoveryView: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState(
    'Income Certificate Barcode Unreadable on MeeSeva online verification portal & Bank Account not seeded with NPCI'
  );
  const [solution, setSolution] = useState<ProblemSolverResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDiagnose = async (customText?: string) => {
    const textToRun = customText || errorMessage;
    if (!textToRun.trim()) return;

    setLoading(true);
    try {
      const resp = await api.solveProblem(textToRun, 'Telangana ePASS');
      setSolution(resp);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Application Problem Solver & Rejection Recovery</h2>
            <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full border border-rose-300">
              Recovery Assistant
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Decode obscure government portal error messages and rejection slips into plain-English root causes and grievance checklists.
          </p>
        </div>
      </div>

      {/* Input / Problem Diagnosis Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <label className="font-bold text-slate-900 text-sm block">
          Enter Portal Error Code, Rejection Notice, or Problem Description:
        </label>
        
        <textarea
          rows={3}
          value={errorMessage}
          onChange={(e) => setErrorMessage(e.target.value)}
          className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="e.g. Error: UID-MeeSeva Mismatch or Bank PFMS rejection..."
        />

        {/* Quick Sample Error Chips for Demo */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
            Test Real-World Portal Errors:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                const text = 'Income Certificate Barcode Unreadable on MeeSeva online verification portal';
                setErrorMessage(text);
                handleDiagnose(text);
              }}
              className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"
            >
              1. MeeSeva Barcode Unreadable
            </button>
            <button
              onClick={() => {
                const text = 'Bank Account Not Seeded with NPCI Aadhaar DBT mapper / Inactive Account';
                setErrorMessage(text);
                handleDiagnose(text);
              }}
              className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"
            >
              2. Bank Account Not Seeded with NPCI
            </button>
            <button
              onClick={() => {
                const text = 'Institutional Bonafide Missing Convenor Quota Details & Biometric Attendance Below 75%';
                setErrorMessage(text);
                handleDiagnose(text);
              }}
              className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"
            >
              3. Bonafide Missing & Low Attendance
            </button>
          </div>
        </div>

        <button
          onClick={() => handleDiagnose()}
          disabled={loading || !errorMessage.trim()}
          className="w-full sm:w-auto px-6 py-2.5 bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>Diagnose Issue & Generate Recovery Plan</span>
        </button>
      </div>

      {/* Diagnosis & Remediation Plan */}
      {solution && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Diagnosed Issue</span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">{solution.diagnosed_issue}</h3>
              <p className="text-xs text-brand-700 font-medium mt-0.5">Reference: {solution.official_rule_reference}</p>
            </div>

            <span className="self-start sm:self-auto px-3 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-full border border-amber-300">
              {solution.severity} • Window: {solution.recommended_deadline_days} Days
            </span>
          </div>

          {/* Root Cause Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1 text-xs sm:text-sm">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Plain-English Root Cause Explanation:
            </h4>
            <p className="text-slate-700 leading-relaxed pt-1">
              {solution.root_cause_explanation}
            </p>
          </div>

          {/* Step-by-Step Remedial Checklist */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Step-by-Step Remediation Action Plan:
            </h4>
            <div className="space-y-2 text-xs sm:text-sm">
              {solution.remedial_steps.map((step, idx) => (
                <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3 shadow-2xs">
                  <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-slate-800 leading-snug">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Grievance & Escalation Contacts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                <ExternalLink className="w-4 h-4 text-brand-600" />
                Official Grievance Redressal
              </h5>
              <p className="text-slate-600">
                If the nodal officer does not resolve the deficit within 7 days, you can lodge a formal ticket.
              </p>
              {solution.grievance_portal_url && (
                <a
                  href={solution.grievance_portal_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline pt-1"
                >
                  <span>Open Telangana ePASS Grievance Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                Escalation Matrix
              </h5>
              <div className="space-y-1 text-slate-700">
                {solution.escalation_contacts.map((c, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="font-medium text-slate-600">{c.role}:</span>
                    <strong className="text-slate-900">{c.contact}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
