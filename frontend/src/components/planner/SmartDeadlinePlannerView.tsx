import React, { useState, useEffect } from 'react';
import { BackwardPlanResponse } from '../../types';
import { api } from '../../services/api';
import { 
  Calendar, Clock, CheckCircle2, Circle, ArrowRight, 
  Sparkles, RefreshCw, AlertCircle
} from 'lucide-react';

export const SmartDeadlinePlannerView: React.FC = () => {
  const [scholarshipTitle, setScholarshipTitle] = useState('Telangana ePASS Post-Matric Scholarship');
  const [deadline, setDeadline] = useState('2026-11-30');
  const [plan, setPlan] = useState<BackwardPlanResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlan() {
      setLoading(true);
      try {
        const data = await api.getBackwardSchedule(scholarshipTitle, deadline);
        setPlan(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPlan();
  }, [scholarshipTitle, deadline]);

  const toggleMilestone = (idx: number) => {
    if (!plan) return;
    const updated = [...plan.milestones];
    updated[idx].is_completed = !updated[idx].is_completed;
    setPlan({ ...plan, milestones: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Smart Deadline Planner & Backward Scheduler</h2>
            <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
              Backward Scheduling Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Eliminates last-minute rush by calculating the exact date you must request certificates from colleges and MeeSeva centers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          />
        </div>
      </div>

      {loading || !plan ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          {/* Summary Box */}
          <div className="bg-brand-50 border border-brand-200 p-4 sm:p-5 rounded-xl flex items-start gap-3">
            <div className="p-2 bg-brand-200 text-brand-900 rounded-lg shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-brand-950 text-sm">Backward Milestone Strategy: {plan.scholarship_title}</h4>
              <p className="text-xs sm:text-sm text-brand-800 mt-1 leading-relaxed">
                {plan.recommendation_summary}
              </p>
            </div>
          </div>

          {/* Timeline Milestones */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-base">Recommended Schedule Milestones</h4>

            <div className="relative border-l-2 border-brand-200 ml-4 sm:ml-6 pl-4 sm:pl-6 space-y-6">
              {plan.milestones.map((m, idx) => (
                <div key={idx} className="relative group">
                  {/* Indicator Icon on timeline line */}
                  <button
                    onClick={() => toggleMilestone(idx)}
                    className={`absolute -left-[25px] sm:-left-[33px] top-1 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      m.is_completed
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border-2 border-brand-400 text-transparent hover:border-emerald-500'
                    }`}
                    title={m.is_completed ? "Mark incomplete" : "Mark completed"}
                  >
                    ✓
                  </button>

                  <div className={`p-4 rounded-xl border transition-all ${
                    m.is_completed
                      ? 'bg-slate-50 border-slate-200 opacity-80'
                      : 'bg-white border-slate-200 shadow-xs hover:border-brand-300'
                  }`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full">
                          {m.category}
                        </span>
                        <h5 className={`font-bold text-sm sm:text-base ${m.is_completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {m.title}
                        </h5>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-slate-500">{m.milestone_date}</span>
                        <span className={`font-bold px-2 py-0.5 rounded ${
                          m.days_remaining <= 3 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {m.days_remaining} Days Left
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
