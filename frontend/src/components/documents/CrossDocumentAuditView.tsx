import React, { useState, useEffect } from 'react';
import { CrossDocumentConsistencyReport } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, CheckCircle2, AlertTriangle, XCircle, 
  ArrowRight, RefreshCw, FileSearch, HelpCircle
} from 'lucide-react';

export const CrossDocumentAuditView: React.FC = () => {
  const { currentUser } = useAuth();
  const [audit, setAudit] = useState<CrossDocumentConsistencyReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAudit() {
      setLoading(true);
      try {
        const data = await api.getConsistencyAudit(currentUser?.id || 1);
        setAudit(data);
      } catch (err) {
        console.error('Audit failed:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAudit();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!audit) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Cross-Document Consistency Checker</h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Automated Pre-Submission Audit
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Compares critical identity attributes across your certificates to flag discrepancies before government portal verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-500">Consistency Match Score</span>
            <p className="text-2xl font-black text-emerald-700">{audit.match_percentage}%</p>
          </div>
        </div>
      </div>

      {/* Discrepancies Table / Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-brand-600" />
            Attribute-by-Attribute Verification Matrix
          </h3>
          <span className="text-xs text-slate-500">Audit Timestamp: {audit.audit_timestamp}</span>
        </div>

        <div className="divide-y divide-slate-100">
          {audit.discrepancies.map((item, idx) => {
            const isMatch = item.severity === 'MATCH';
            const isCritical = item.severity === 'CRITICAL_MISMATCH';

            return (
              <div key={idx} className="p-5 hover:bg-slate-50/80 transition-colors space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isMatch ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : isCritical ? (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                    )}
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">{item.field_name}</h4>
                  </div>

                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    isMatch 
                      ? 'bg-emerald-100 text-emerald-800'
                      : isCritical
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.severity.replace('_', ' ')}
                  </span>
                </div>

                {/* Values Comparison Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[11px] uppercase font-semibold">{item.source_document_1}:</span>
                    <strong className="text-slate-900 text-sm">{item.value_1}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] uppercase font-semibold">{item.source_document_2}:</span>
                    <strong className="text-slate-900 text-sm">{item.value_2}</strong>
                  </div>
                </div>

                {/* Remediation Guidance */}
                <div className="text-xs space-y-1">
                  <p className="text-slate-600">
                    <strong className="text-slate-800">Explanation: </strong>
                    {item.explanation}
                  </p>
                  <p className={`font-medium ${isCritical ? 'text-rose-700' : 'text-slate-500'}`}>
                    💡 <strong>Guidance: </strong>
                    {item.remediation_guidance}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
