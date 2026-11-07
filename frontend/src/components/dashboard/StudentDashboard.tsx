import React from 'react';
import { useStudent } from '../../context/StudentContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ShieldCheck, Award, FileText, CheckCircle2, AlertCircle, 
  ArrowRight, Sparkles, Building, Landmark, Wallet, Clock, 
  Compass, RefreshCw, Printer
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export const StudentDashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { identity, isLoading } = useStudent();
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  if (isLoading || !identity) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-brand-600" />
          <p className="text-slate-600 font-medium">Loading Student Financial Identity...</p>
        </div>
      </div>
    );
  }

  const edu = identity.educational_record;
  const fin = identity.financial_profile;

  return (
    <div className="space-y-6">
      {/* Welcome & Philosophy Header */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-700/60 border border-brand-500/40 text-brand-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            AI-Driven Educational Mobility Companion
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {identity.full_name}!
          </h1>
          <p className="mt-2 text-brand-100 text-sm sm:text-base leading-relaxed">
            "Don't search endlessly for scholarships. Help the right opportunities find you."
            Your reusable financial identity automatically evaluates eligibility across Telangana and Central schemes.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('discovery')}
              className="px-4 py-2 bg-white text-brand-900 font-semibold text-sm rounded-lg hover:bg-brand-50 transition-colors shadow-sm flex items-center gap-2"
            >
              <Compass className="w-4 h-4" /> Discover Matched Aid
            </button>
            <button
              onClick={() => onNavigate('zeroVisit')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" /> Check Visit Readiness
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-80 h-80 bg-brand-600/30 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Critical Zero-Repeat-Visit Reminder */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-200 text-amber-900 rounded-lg shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-amber-900 text-sm sm:text-base">
              Zero-Repeat-Visit Alert: Document Checklist Incomplete (57% Ready)
            </h4>
            <p className="text-xs sm:text-sm text-amber-800 mt-0.5">
              Before travelling to the College Scholarship Counter, you still need to collect the 
              <strong> College Bonafide Certificate with the Principal's blue-ink seal</strong>.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('zeroVisit')}
          className="whitespace-nowrap px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-1.5 self-end sm:self-auto"
        >
          <span>Open Visit Checklist</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Reusable Student Financial Identity Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-lg border border-brand-200">
              {identity.full_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-slate-900 text-lg">{identity.full_name}</h3>
                <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Financial Identity
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Identity Token: <span className="text-slate-800 font-semibold">{identity.verified_identity_hash}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Profile Completeness:</span>
            <div className="w-24 bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-emerald-600 h-2.5 rounded-full" 
                style={{ width: `${identity.profile_completion_percentage}%` }}
              />
            </div>
            <span className="text-xs font-bold text-emerald-700">{identity.profile_completion_percentage}%</span>
          </div>
        </div>

        {/* Identity Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          {/* Column 1: Academic Identity */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-brand-600" /> Academic Credentials
            </h4>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
              <div>
                <span className="text-slate-500 text-xs">Course & Branch:</span>
                <p className="font-semibold text-slate-900">{edu?.course_name} - {edu?.branch}</p>
              </div>
              <div>
                <span className="text-slate-500 text-xs">Admission Quota:</span>
                <p className="font-semibold text-indigo-700">{edu?.admission_type} (Year {edu?.academic_year})</p>
              </div>
              <div>
                <span className="text-slate-500 text-xs">Institution:</span>
                <p className="font-medium text-slate-800 text-xs">{edu?.institution_name}</p>
              </div>
              <div>
                <span className="text-slate-500 text-xs">Previous Qualification:</span>
                <p className="font-semibold text-slate-900">{edu?.previous_qualification} ({edu?.previous_marks_percentage}%)</p>
              </div>
            </div>
          </div>

          {/* Column 2: Financial Circumstances */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-emerald-600" /> Financial Standing
            </h4>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
              <div>
                <span className="text-slate-500 text-xs">Annual Family Income:</span>
                <p className="font-extrabold text-slate-900 text-base">₹{fin?.annual_family_income?.toLocaleString('en-IN')}</p>
                <p className="text-[11px] text-emerald-700 font-medium">✓ MeeSeva Certificate Verified</p>
              </div>
              <div>
                <span className="text-slate-500 text-xs">Annual Tuition Fee:</span>
                <p className="font-semibold text-slate-800">₹{fin?.annual_tuition_fee?.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <span className="text-slate-500 text-xs">Hostel & Living Costs:</span>
                <p className="font-semibold text-slate-800">₹{fin?.hostel_living_expenses?.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          {/* Column 3: Category & Direct Benefit Transfer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-indigo-600" /> Category & DBT Status
            </h4>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
              <div>
                <span className="text-slate-500 text-xs">Social Category:</span>
                <p className="font-semibold text-slate-900">{identity.category} ({identity.sub_caste || 'General'})</p>
              </div>
              <div>
                <span className="text-slate-500 text-xs">State Domicile:</span>
                <p className="font-semibold text-slate-900">{identity.state} ({identity.district})</p>
              </div>
              <div>
                <span className="text-slate-500 text-xs">Bank & NPCI Aadhaar Seeding:</span>
                <p className="font-semibold text-slate-900">{fin?.bank_name}</p>
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full mt-1 ${
                  fin?.is_aadhaar_seeded_npci 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                }`}>
                  {fin?.is_aadhaar_seeded_npci ? '✓ NPCI Aadhaar DBT Active' : '✕ NPCI Unseeded (Payment Will Fail)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigate('discovery')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-brand-300 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900">Scholarship Discovery</h4>
          <p className="text-xs text-slate-500 mt-1">Multi-facet search with real-time match scoring.</p>
          <span className="text-xs font-semibold text-brand-700 flex items-center gap-1 mt-3 group-hover:translate-x-1 transition-transform">
            Browse Opportunities &rarr;
          </span>
        </div>

        <div 
          onClick={() => onNavigate('eligibility')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900">Eligibility & Simulator</h4>
          <p className="text-xs text-slate-500 mt-1">Rule breakdowns and what-if simulation sandbox.</p>
          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-3 group-hover:translate-x-1 transition-transform">
            Test Scenarios &rarr;
          </span>
        </div>

        <div 
          onClick={() => onNavigate('zeroVisit')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900">Zero-Repeat-Visit</h4>
          <p className="text-xs text-slate-500 mt-1">Visit readiness checklists, copies & seals.</p>
          <span className="text-xs font-semibold text-amber-700 flex items-center gap-1 mt-3 group-hover:translate-x-1 transition-transform">
            Prepare for College &rarr;
          </span>
        </div>

        <div 
          onClick={() => onNavigate('fundingGap')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Wallet className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900">Funding Gap Calculator</h4>
          <p className="text-xs text-slate-500 mt-1">Expense vs aid stacking with clear loan warnings.</p>
          <span className="text-xs font-semibold text-indigo-700 flex items-center gap-1 mt-3 group-hover:translate-x-1 transition-transform">
            Calculate Net Gap &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};
