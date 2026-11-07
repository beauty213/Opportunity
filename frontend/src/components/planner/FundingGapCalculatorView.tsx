import React, { useState, useEffect } from 'react';
import { FundingGapResponse } from '../../types';
import { api } from '../../services/api';
import { 
  Wallet, AlertTriangle, ArrowRight, ShieldCheck, 
  Sparkles, RefreshCw, Layers, HelpCircle
} from 'lucide-react';

export const FundingGapCalculatorView: React.FC = () => {
  const [tuitionFee, setTuitionFee] = useState<number>(85000);
  const [hostelFee, setHostelFee] = useState<number>(50000);
  const [transportFee, setTransportFee] = useState<number>(15000);
  const [suppliesFee, setSuppliesFee] = useState<number>(10000);
  const [familyContrib, setFamilyContrib] = useState<number>(25000);
  const [existingAid, setExistingAid] = useState<number>(0);

  const [gapData, setGapData] = useState<FundingGapResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const runCalculation = async () => {
    setLoading(true);
    try {
      const resp = await api.computeFundingGap({
        annual_tuition_fee: tuitionFee,
        hostel_living_expenses: hostelFee,
        transportation_expenses: transportFee,
        academic_supplies: suppliesFee,
        family_contribution: familyContrib,
        existing_financial_aid: existingAid
      });
      setGapData(resp);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runCalculation();
  }, [tuitionFee, hostelFee, transportFee, suppliesFee, familyContrib, existingAid]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Education Funding Gap Calculator</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Calculate your net financial deficit and explore an optimized multi-tier aid stacking strategy.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Inputs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Wallet className="w-4 h-4 text-brand-600" />
            Your Annual Educational Expenses
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700">College Tuition Fee:</span>
                <span className="font-mono font-bold text-slate-900">₹{tuitionFee.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="20000"
                max="200000"
                step="5000"
                value={tuitionFee}
                onChange={(e) => setTuitionFee(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700">Hostel & Mess Charges:</span>
                <span className="font-mono font-bold text-slate-900">₹{hostelFee.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="0"
                max="120000"
                step="5000"
                value={hostelFee}
                onChange={(e) => setHostelFee(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700">Transportation Expenses:</span>
                <span className="font-mono font-bold text-slate-900">₹{transportFee.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="0"
                max="40000"
                step="2000"
                value={transportFee}
                onChange={(e) => setTransportFee(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700">Books, Supplies & Laptop:</span>
                <span className="font-mono font-bold text-slate-900">₹{suppliesFee.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50000"
                step="2500"
                value={suppliesFee}
                onChange={(e) => setSuppliesFee(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700">Family Capacity / Contribution:</span>
                <span className="font-mono font-bold text-emerald-700">₹{familyContrib.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100000"
                step="5000"
                value={familyContrib}
                onChange={(e) => setFamilyContrib(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Net Gap & Multi-Tier Aid Stacking */}
        <div className="lg:col-span-2 space-y-6">
          {loading || !gapData ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 animate-spin text-brand-600" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Financial Balance Summary Banner */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs text-slate-500 block">Total Annual Need</span>
                  <p className="text-xl font-black text-slate-900 mt-1">
                    ₹{gapData.total_educational_expenses.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl">
                  <span className="text-xs text-emerald-800 block">Family & Existing Aid</span>
                  <p className="text-xl font-black text-emerald-700 mt-1">
                    ₹{gapData.existing_funding_available.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="text-xs text-amber-800 font-bold block">Estimated Funding Gap</span>
                  <p className="text-2xl font-black text-amber-700 mt-1">
                    ₹{gapData.net_funding_gap.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Multi-Tier Aid Stacking Recommendations */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Layers className="w-5 h-5 text-brand-600" />
                    Recommended Aid Stacking Strategy
                  </h3>
                  <span className="text-xs text-slate-500">Optimized to minimize debt</span>
                </div>

                <div className="space-y-3">
                  {gapData.aid_stack.map((layer, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border transition-all ${
                        layer.is_loan
                          ? 'bg-rose-50/60 border-rose-300'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              layer.is_loan
                                ? 'bg-rose-200 text-rose-900'
                                : 'bg-brand-100 text-brand-800'
                            }`}>
                              Layer {idx + 1}: {layer.type_tag}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm mt-1">{layer.layer_name}</h4>
                          <p className="text-xs text-slate-600 mt-0.5">{layer.eligibility_note}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs text-slate-400 block">Potential Coverage</span>
                          <span className={`text-base font-extrabold ${layer.is_loan ? 'text-rose-700' : 'text-emerald-700'}`}>
                            ₹{layer.estimated_amount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Explicit Loan Repayment Alert */}
                      {layer.is_loan && layer.repayment_warning && (
                        <div className="mt-3 p-3 bg-white rounded-lg border border-rose-200 flex items-start gap-2 text-xs text-rose-900 font-medium">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <span>{layer.repayment_warning}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-500 italic pt-2">
                  ℹ️ {gapData.advisory_notice}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
