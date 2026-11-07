import React, { useState, useEffect } from 'react';
import { Scholarship } from '../../types';
import { api } from '../../services/api';
import { useStudent } from '../../context/StudentContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, Filter, ExternalLink, Bookmark, CheckSquare, 
  Square, Award, Clock, ArrowRight, ShieldCheck, X, RefreshCw
} from 'lucide-react';

interface DiscoveryProps {
  onSelectScholarship: (id: number) => void;
  onNavigate: (tab: string) => void;
}

export const ScholarshipDiscovery: React.FC<DiscoveryProps> = ({ onSelectScholarship, onNavigate }) => {
  const { currentUser } = useAuth();
  const { savedScholarships, toggleSaveScholarship, compareList, toggleCompareScholarship } = useStudent();

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [lateralOnly, setLateralOnly] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [comparedScholarships, setComparedScholarships] = useState<Scholarship[]>([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await api.getScholarships({
          query: searchQuery,
          provider_type: selectedProvider !== 'All' ? selectedProvider : undefined,
          target_state: selectedState !== 'All' ? selectedState : undefined,
          lateral_entry_only: lateralOnly ? true : undefined,
          user_id: currentUser?.id || 1
        });
        setScholarships(data);
      } catch (err) {
        console.error('Failed to load scholarships', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [searchQuery, selectedProvider, selectedState, lateralOnly, currentUser]);

  const openComparison = async () => {
    if (compareList.length < 2) {
      alert("Please select at least 2 scholarships to compare.");
      return;
    }
    try {
      const items = await api.compareScholarships(compareList, currentUser?.id || 1);
      setComparedScholarships(items);
      setShowCompareModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Intelligent Scholarship Discovery</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Evaluated against your verified student identity. Ranked by eligibility match score.
            </p>
          </div>

          {compareList.length > 0 && (
            <button
              onClick={openComparison}
              className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-2 self-start md:self-auto shadow-xs"
            >
              <span>Compare Selected ({compareList.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Bar & Multi-Facet Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Text Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name, provider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
          </div>

          {/* Provider Filter */}
          <div>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="All">All Providers</option>
              <option value="Government State">Telangana State Government</option>
              <option value="Government Central">Central Government (NSP / AICTE)</option>
              <option value="Corporate CSR">Corporate CSR (Reliance, HDFC, Tata)</option>
            </select>
          </div>

          {/* Region / State */}
          <div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="All">All Regions (Telangana & National)</option>
              <option value="Telangana">Telangana Only (ePASS)</option>
              <option value="All India">All India Schemes</option>
            </select>
          </div>

          {/* Lateral Entry Toggle */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 cursor-pointer bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 w-full hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={lateralOnly}
                onChange={(e) => setLateralOnly(e.target.checked)}
                className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
              />
              <span>Lateral Entry Accepted Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing {scholarships.length} verified opportunities</span>
        <span>Ranked by suitability for your profile</span>
      </div>

      {/* Scholarship Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      ) : scholarships.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No matching scholarships found</h3>
          <p className="text-sm text-slate-500 mt-1">Try broadening your search terms or clearing filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {scholarships.map((s) => {
            const isSaved = savedScholarships.includes(s.id);
            const isCompared = compareList.includes(s.id);
            const isEligible = s.match_status === 'Eligible';

            return (
              <div
                key={s.id}
                className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all hover:shadow-md flex flex-col justify-between ${
                  isEligible ? 'border-emerald-300 ring-1 ring-emerald-100' : 'border-slate-200'
                }`}
              >
                <div>
                  {/* Top Bar: Match Score & Actions */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                        isEligible
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : s.match_status === 'Potentially Eligible'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        <Award className="w-3.5 h-3.5" />
                        {s.match_score}% Match: {s.match_status || 'Checking'}
                      </span>

                      <span className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {s.provider_type}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => toggleCompareScholarship(s.id)}
                        className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                          isCompared
                            ? 'bg-brand-50 border-brand-300 text-brand-700 font-semibold'
                            : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                        title="Compare side-by-side"
                      >
                        {isCompared ? <CheckSquare className="w-4 h-4 text-brand-700" /> : <Square className="w-4 h-4" />}
                        <span className="text-[11px] hidden sm:inline">Compare</span>
                      </button>

                      <button
                        onClick={() => toggleSaveScholarship(s.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isSaved
                            ? 'bg-amber-50 border-amber-300 text-amber-600'
                            : 'border-slate-200 text-slate-400 hover:text-slate-600'
                        }`}
                        title={isSaved ? "Saved" : "Save scholarship"}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Provider */}
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{s.provider}</span>
                  </p>

                  {/* Financial Benefit Box */}
                  <div className="mt-3.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Financial Benefits</span>
                    <p className="font-semibold text-slate-900 text-xs sm:text-sm mt-0.5 leading-relaxed">
                      {s.financial_benefits}
                    </p>
                  </div>

                  {/* Eligibility summary */}
                  {s.eligibility_summary && (
                    <p className="mt-3 text-xs text-slate-600 line-clamp-2">
                      💡 {s.eligibility_summary}
                    </p>
                  )}
                </div>

                {/* Card Footer: Metadata & Buttons */}
                <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Deadline: <strong className="text-slate-800">{s.deadline}</strong></span>
                    </div>
                    {s.allows_lateral_entry && (
                      <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-medium text-[11px]">
                        ✓ Lateral Entry Accepted
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onSelectScholarship(s.id)}
                      className="flex-1 py-2 px-3 bg-brand-700 hover:bg-brand-800 text-white font-medium text-xs sm:text-sm rounded-lg transition-colors text-center shadow-xs"
                    >
                      Check Eligibility Breakdown
                    </button>

                    <a
                      href={s.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-1 border border-slate-200"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-5xl w-full p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Side-by-Side Scholarship Comparison</h3>
                <p className="text-xs text-slate-500">Evaluating critical rules, document obligations, and funding coverage.</p>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="p-3 font-semibold text-slate-500 w-1/4">Evaluation Attribute</th>
                    {comparedScholarships.map(cs => (
                      <th key={cs.id} className="p-3 font-bold text-slate-900">
                        {cs.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-medium text-slate-500">Provider & Verification</td>
                    {comparedScholarships.map(cs => (
                      <td key={cs.id} className="p-3 text-slate-800">
                        <span className="font-semibold">{cs.provider}</span>
                        <div className="text-xs text-emerald-700 font-medium">{cs.verification_status}</div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-slate-500">Match Score for You</td>
                    {comparedScholarships.map(cs => (
                      <td key={cs.id} className="p-3">
                        <span className="font-bold text-brand-700 text-base">{cs.match_score}%</span>
                        <div className="text-xs font-medium text-slate-600">{cs.match_status}</div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-slate-500">Financial Benefits</td>
                    {comparedScholarships.map(cs => (
                      <td key={cs.id} className="p-3 font-semibold text-slate-900 bg-slate-50/50">
                        {cs.financial_benefits}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-slate-500">Annual Family Income Ceiling</td>
                    {comparedScholarships.map(cs => (
                      <td key={cs.id} className="p-3 text-slate-800">
                        ₹{cs.max_family_income?.toLocaleString('en-IN')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-slate-500">Lateral Entry Support</td>
                    {comparedScholarships.map(cs => (
                      <td key={cs.id} className="p-3 font-medium">
                        {cs.allows_lateral_entry ? (
                          <span className="text-emerald-700 font-semibold">✓ Yes, explicitly accepted</span>
                        ) : (
                          <span className="text-rose-600 font-semibold">✕ Regular 10+2 Entry Only</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-slate-500">Application Deadline</td>
                    {comparedScholarships.map(cs => (
                      <td key={cs.id} className="p-3 font-semibold text-slate-900">
                        {cs.deadline}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-medium rounded-lg"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
