import React, { useState, useEffect } from 'react';
import { ZeroVisitReport } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckCircle2, AlertTriangle, Printer, Building2, Clock, 
  Phone, ArrowRight, ShieldCheck, FileCheck, RefreshCw, XCircle
} from 'lucide-react';

interface ZeroVisitProps {
  onNavigate: (tab: string) => void;
}

export const ZeroRepeatVisitView: React.FC<ZeroVisitProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [processType, setProcessType] = useState('epass_college_verification');
  const [report, setReport] = useState<ZeroVisitReport | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await api.getZeroVisitReport(processType, currentUser?.id || 1);
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [processType, currentUser]);

  const handlePrint = () => {
    window.print();
  };

  if (loading || !report) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  const isReady = report.readiness_status === 'READY';

  return (
    <div className="space-y-6">
      {/* Top Header & Process Switcher */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Zero-Repeat-Visit Assistant</h2>
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
              Primary Differentiator
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Prevent avoidable physical trips to colleges or government offices due to missing documents or unverified seals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={processType}
            onChange={(e) => setProcessType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            <option value="epass_college_verification">Telangana ePASS College Verification</option>
            <option value="bank_npci_seeding">Bank Account NPCI-DBT Aadhaar Seeding</option>
          </select>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-2 shadow-xs shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>Print Checklist</span>
          </button>
        </div>
      </div>

      {/* Main Readiness Assessment Card */}
      <div className="printable-card bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Administrative Target Process</span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
              {report.process_name}
            </h3>
            <p className="text-xs text-slate-500 mt-1">{report.official_rules_summary}</p>
          </div>

          <div className="text-right shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-black ${
              isReady 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}>
              {isReady ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-amber-600" />}
              {report.readiness_status}
            </span>
            <div className="text-xs font-bold text-slate-700 mt-1">
              Readiness Score: {report.readiness_score}% ({report.missing_mandatory_count} items missing)
            </div>
          </div>
        </div>

        {/* Verification Office Location & Timings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-700">
          <div className="flex items-start gap-2.5">
            <Building2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 block">Verification Location:</span>
              <span>{report.target_office} - {report.office_address}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 block">Official Counter Hours:</span>
              <span>{report.visiting_hours}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 block">Official Contacts:</span>
              <span>{report.contact_helpline}</span>
            </div>
          </div>
        </div>

        {/* The Actionable Document Package Checklist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">
              Mandatory Physical Dossier Checklist
            </h4>
            <span className="text-xs text-slate-500">
              Verify each item before leaving home
            </span>
          </div>

          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
            {report.checklist.map((item) => (
              <div 
                key={item.item_id} 
                className={`p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3 transition-colors ${
                  item.uploaded_in_vault ? 'bg-white' : 'bg-rose-50/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {item.uploaded_in_vault ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h5 className="font-bold text-slate-900 text-sm">{item.document_name}</h5>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      {item.is_mandatory && (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-1.5 py-0.2 rounded">
                          Mandatory
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600">
                      <strong>Attestation Instructions: </strong>
                      {item.attestation_instructions}
                    </p>

                    {item.special_notes && (
                      <p className="text-[11px] text-slate-500 italic">
                        Note: {item.special_notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                  <span className="text-xs font-bold bg-slate-100 px-2.5 py-1 rounded-md text-slate-800">
                    Required: {item.quantity_required} {item.quantity_required > 1 ? 'Sets' : 'Original'}
                  </span>

                  <span className={`text-[11px] font-bold ${
                    item.uploaded_in_vault ? 'text-emerald-700' : 'text-rose-600'
                  }`}>
                    {item.uploaded_in_vault ? '✓ Ready in Vault' : '⚠️ Missing / Not Uploaded'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Do's and Don'ts */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            Official Visit Instructions & Golden Rules
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
            {report.critical_dos_and_donts.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200/80">
                <span className="text-brand-600 font-bold shrink-0">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
