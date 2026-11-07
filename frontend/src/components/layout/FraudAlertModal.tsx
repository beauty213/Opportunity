import React from 'react';
import { ShieldAlert, CheckCircle2, XCircle, ExternalLink, X } from 'lucide-react';

interface FraudModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FraudAlertModal: React.FC<FraudModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2 text-rose-600">
            <ShieldAlert className="w-6 h-6" />
            <h3 className="text-lg font-bold text-slate-900">Official Anti-Fraud & Scam Protection Advisory</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-700">
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
            <h4 className="font-bold text-rose-950 text-sm">Golden Rule: Free Access to Educational Aid</h4>
            <p className="text-rose-900 leading-relaxed text-xs">
              Neither the Government of Telangana, the Central Government (NSP), nor AICTE charges any fee to apply for scholarships. Anyone claiming to 'guarantee' a scholarship in exchange for cash or commission is committing a criminal offence.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Crucial Safety Principles:</h5>
            
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Verify URL Domains:</strong> Always check that the portal ends in <code>.gov.in</code> (such as <code>telanganaepass.cgg.gov.in</code> or <code>scholarships.gov.in</code>).</span>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Never Share Banking Credentials:</strong> Government scholarships are credited automatically via Aadhaar DBT. Welfare officers will NEVER ask for your debit card PIN, OTP, or Net Banking password.</span>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Do Not Submit Original Certificates:</strong> College verification officers only inspect original marksheets; they do NOT retain permanent custody of your original revenue certificates.</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <a
            href="https://cybercrime.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-600 font-bold hover:underline flex items-center gap-1"
          >
            <span>National Cyber Crime Reporting (Dial 1930)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
