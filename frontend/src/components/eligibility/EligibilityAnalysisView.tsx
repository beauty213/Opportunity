import React, { useState, useEffect } from 'react';
import { EligibilityAssessment, SimulatorResponse, Scholarship } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useStudent } from '../../context/StudentContext';
import { 
  Award, CheckCircle, XCircle, AlertCircle, HelpCircle, 
  Sparkles, Sliders, ArrowRight, RefreshCw, ShieldCheck
} from 'lucide-react';

interface EligibilityProps {
  initialScholarshipId?: number;
  onNavigate: (tab: string) => void;
}

export const EligibilityAnalysisView: React.FC<EligibilityProps> = ({ 
  initialScholarshipId = 1,
  onNavigate
}) => {
  const { currentUser } = useAuth();
  const { identity } = useStudent();

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [selectedScholarshipId, setSelectedScholarshipId] = useState<number>(initialScholarshipId);
  const [assessment, setAssessment] = useState<EligibilityAssessment | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulator Form State
  const [simIncome, setSimIncome] = useState<number>(175000);
  const [simMarks, setSimMarks] = useState<number>(84.5);
  const [simAdmission, setSimAdmission] = useState<string>('Lateral Entry');
  const [simResult, setSimResult] = useState<SimulatorResponse | null>(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    async function loadList() {
      try {
        const list = await api.getScholarships({ user_id: currentUser?.id || 1 });
        setScholarships(list);
        if (list.length > 0 && !selectedScholarshipId) {
          setSelectedScholarshipId(list[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadList();
  }, [currentUser]);

  useEffect(() => {
    if (identity?.financial_profile) {
      setSimIncome(identity.financial_profile.annual_family_income);
    }
    if (identity?.educational_record) {
      setSimMarks(identity.educational_record.previous_marks_percentage || 80);
      setSimAdmission(identity.educational_record.admission_type || 'Lateral Entry');
    }
  }, [identity]);

  useEffect(() => {
    async function fetchAssessment() {
      if (!selectedScholarshipId) return;
      setLoading(true);
      try {
        const data = await api.assessEligibility(selectedScholarshipId, currentUser?.id || 1);
        setAssessment(data);
      } catch (err) {
        console.error('Error assessing eligibility:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAssessment();
  }, [selectedScholarshipId, currentUser]);

  const runSimulation = async () => {
    setSimulating(true);
    try {
      const res = await api.simulateEligibility({
        scholarship_id: selectedScholarshipId,
        annual_family_income: simIncome,
        previous_marks_percentage: simMarks,
        admission_type: simAdmission
      }, currentUser?.id || 1);
      setSimResult(res);
    } catch (err) {
      console.error('Simulation failed', err);
    } finally {
      setSimulating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Eligible':
        return (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-sm rounded-full flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Eligible (100% Rules Met)
          </span>
        );
      case 'Potentially Eligible':
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300 font-bold text-sm rounded-full flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            Potentially Eligible (Requires Institutional Verification)
          </span>
        );
      case 'Not Eligible':
        return (
          <span className="px-3 py-1 bg-rose-100 text-rose-800 border border-rose-300 font-bold text-sm rounded-full flex items-center gap-1.5">
            <XCircle className="w-4 h-4 text-rose-600" />
            Not Eligible (Criteria Exceeded / Mismatch)
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-800 border border-slate-300 font-bold text-sm rounded-full flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-slate-500" />
            Insufficient Information
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Scholarship Selector Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Explainable Eligibility Matching Engine</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Transparent, rule-by-rule evaluation. AI explains official government criteria without ungrounded assumptions.
          </p>
        </div>

        <div className="w-full md:w-80">
          <label className="text-xs font-semibold text-slate-500 block mb-1">Select Scholarship to Evaluate:</label>
          <select
            value={selectedScholarshipId}
            onChange={(e) => setSelectedScholarshipId(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            {scholarships.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>
      </div>

      {loading || !assessment ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Detailed Rule-by-Rule Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Summary Banner */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {getStatusBadge(assessment.status)}
                <div className="text-right">
                  <span className="text-xs text-slate-500">Deterministic Match Score</span>
                  <p className="text-2xl font-black text-brand-700">{assessment.match_score}%</p>
                </div>
              </div>

              {/* AI Narrative */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm leading-relaxed text-slate-800">
                <div className="flex items-center gap-2 font-semibold text-brand-900 mb-1 text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-500" /> AI Explanatory Summary
                </div>
                {assessment.ai_explanation}
              </div>

              <p className="text-[11px] text-slate-400 italic">
                ⚠️ {assessment.caveat}
              </p>
            </div>

            {/* Rule Checklist Matrix */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Structured Criteria Audit Matrix
                </h3>
                <span className="text-xs text-slate-500">
                  {assessment.rule_checks.filter(r => r.passed).length} of {assessment.rule_checks.length} checks passed
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {assessment.rule_checks.map((rule, idx) => (
                  <div key={idx} className="p-4 sm:p-5 flex items-start gap-3.5 hover:bg-slate-50/80 transition-colors">
                    <div className="mt-0.5 shrink-0">
                      {rule.passed ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600" />
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-semibold text-slate-900 text-sm">{rule.rule_name}</h4>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          rule.passed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {rule.passed ? 'PASSED' : 'DISQUALIFYING / FAILED'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                        <div>
                          <span className="text-slate-400">Your Record: </span>
                          <strong className="text-slate-900">{rule.student_value || 'Not Provided'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400">Required Condition: </span>
                          <strong className="text-slate-900">{rule.required_condition}</strong>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 pt-0.5 leading-normal">
                        {rule.explanation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Recommended Next Actions:</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {assessment.next_steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Col: Interactive Eligibility Simulator (What-If Sandbox) */}
          <div className="space-y-6">
            <div className="bg-gradient-to-b from-brand-900 to-slate-900 rounded-2xl p-6 text-white shadow-md space-y-5">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base sm:text-lg">Eligibility Simulator</h3>
              </div>
              <p className="text-xs text-brand-200 leading-relaxed">
                Test hypothetical changes in your circumstances (e.g. family income changes, grade improvement, or admission types) to see how they impact your scholarship approval.
              </p>

              {/* Form Controls */}
              <div className="space-y-4 text-xs">
                {/* Income Slider */}
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Family Annual Income:</span>
                    <span className="text-amber-300 font-mono">₹{simIncome.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="600000"
                    step="25000"
                    value={simIncome}
                    onChange={(e) => setSimIncome(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-brand-300">
                    <span>₹50K</span>
                    <span>₹2 Lakhs (BC Limit)</span>
                    <span>₹6 Lakhs</span>
                  </div>
                </div>

                {/* Marks Percentage */}
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Academic Aggregate:</span>
                    <span className="text-amber-300 font-mono">{simMarks}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    step="0.5"
                    value={simMarks}
                    onChange={(e) => setSimMarks(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* Admission Type */}
                <div>
                  <label className="font-semibold block mb-1">Admission Type:</label>
                  <select
                    value={simAdmission}
                    onChange={(e) => setSimAdmission(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:ring-1 focus:ring-amber-400"
                  >
                    <option value="Lateral Entry">Lateral Entry (Diploma to B.Tech)</option>
                    <option value="Regular">Regular 4-Year B.Tech</option>
                    <option value="Management Quota">Management Quota</option>
                  </select>
                </div>

                <button
                  onClick={runSimulation}
                  disabled={simulating}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm text-xs mt-2"
                >
                  {simulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Run What-If Simulation</span>
                </button>
              </div>

              {/* Simulation Output */}
              {simResult && (
                <div className="mt-4 p-4 rounded-xl bg-slate-800/80 border border-amber-500/30 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-brand-300">Simulated Outcome:</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      simResult.simulated_status === 'Eligible'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : 'bg-rose-950 text-rose-300 border border-rose-700'
                    }`}>
                      {simResult.simulated_status}
                    </span>
                  </div>

                  <p className="text-slate-200 leading-normal">
                    {simResult.impact_explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Link to Zero Visit */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Satisfied with Eligibility?</h4>
              <p className="text-xs text-slate-500">
                Prepare your required original certificates and photocopy sets before visiting college.
              </p>
              <button
                onClick={() => onNavigate('zeroVisit')}
                className="w-full py-2 bg-brand-50 hover:bg-brand-100 text-brand-800 font-semibold text-xs rounded-lg transition-colors"
              >
                Launch Zero-Repeat-Visit Assistant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
