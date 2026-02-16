
import React, { useState } from 'react';
import { 
  Calendar, Clock, CheckCircle, ChevronRight, 
  BookOpen, Brain, Zap, Coffee, Sparkles 
} from 'lucide-react';
import { StudyPlanItem, PredictionResult } from '../types';

interface PlannerProps {
  plan: StudyPlanItem[] | null;
  prediction: PredictionResult | null;
}

const Planner: React.FC<PlannerProps> = ({ plan, prediction }) => {
  const [activeDay, setActiveDay] = useState(0);

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
        <div className="bg-indigo-100 p-6 rounded-full mb-6">
          <Calendar className="text-indigo-600" size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Schedule Not Generated</h2>
        <p className="text-slate-500 max-w-md text-center">
          Go to 'Analyze Performance' to let our AI design your personalized routine based on your goals.
        </p>
      </div>
    );
  }

  const currentDayPlan = plan[activeDay];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Strategy Overview */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-indigo-900 text-white p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="text-yellow-400" size={20} />
            <h3 className="font-bold">Active Strategy</h3>
          </div>
          <div className="mb-6">
            <span className="text-indigo-200 text-xs uppercase font-bold tracking-widest">Plan Mode</span>
            <p className="text-2xl font-bold">
              {prediction?.riskLevel === 'High' ? 'Intensive Pivot' : prediction?.riskLevel === 'Medium' ? 'Balanced Growth' : 'Strategic Elite'}
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-white/10 p-2 rounded-xl">
              <Sparkles size={16} className="text-indigo-300" />
              <span className="text-sm">Optimized for ${prediction?.grade} level</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 p-2 rounded-xl">
              <Clock size={16} className="text-indigo-300" />
              <span className="text-sm">Priority focus blocks</span>
            </div>
          </div>
        </div>

        {/* Day Selector */}
        <div className="bg-white p-4 rounded-3xl border border-slate-100 space-y-2">
          <h4 className="text-sm font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">Weekly Timeline</h4>
          {plan.map((day, idx) => (
            <button
              key={idx}
              onClick={() => setActiveDay(idx)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group ${
                activeDay === idx ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <span>{day.day}</span>
              {activeDay === idx && <ChevronRight size={16} />}
            </button>
          ))}
        </div>
      </div>

      {/* Daily Tasks */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-slate-800">{currentDayPlan.day} Focus</h3>
              <p className="text-slate-500 text-sm">Your AI-curated tasks for maximum retention</p>
            </div>
            <div className="px-4 py-2 bg-white rounded-2xl border border-slate-200 text-slate-600 font-medium text-sm flex items-center gap-2">
              <Calendar size={16} />
              Week 1 Schedule
            </div>
          </div>

          <div className="p-6 space-y-6">
            {currentDayPlan.tasks.map((task, idx) => (
              <div key={idx} className="flex gap-6 group">
                <div className="w-24 text-right pt-2">
                  <span className="text-sm font-bold text-slate-400 group-hover:text-indigo-500 transition-colors">{task.time}</span>
                </div>
                <div className="relative flex-1 bg-slate-50 rounded-2xl p-5 border border-transparent hover:border-indigo-100 hover:bg-indigo-50/30 transition-all flex items-start gap-4">
                  <div className={`p-3 rounded-xl flex-shrink-0 ${
                    task.activity.toLowerCase().includes('study') ? 'bg-indigo-100 text-indigo-600' : 
                    task.activity.toLowerCase().includes('break') || task.activity.toLowerCase().includes('rest') ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {task.activity.toLowerCase().includes('study') ? <BookOpen size={20} /> : 
                     task.activity.toLowerCase().includes('break') || task.activity.toLowerCase().includes('rest') ? <Coffee size={20} /> : <Zap size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">{task.activity}</h4>
                    <p className="text-slate-600 text-sm mb-3">{task.focus}</p>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                      Deep Focus Required
                    </div>
                  </div>
                  <button className="ml-auto w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-transparent hover:text-indigo-500 hover:border-indigo-500 transition-all">
                    <CheckCircle size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Motivational Tip */}
        <div className="mt-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-6 text-white flex items-center gap-6 shadow-lg shadow-emerald-500/20">
          <div className="bg-white/20 p-4 rounded-full">
            <Brain size={32} />
          </div>
          <div>
            <h4 className="font-bold text-lg mb-1">AI Study Tip</h4>
            <p className="text-emerald-50 leading-relaxed text-sm">
              Use the Pomodoro technique (25 mins study / 5 mins break) during your study blocks. Your current stress levels suggest frequent micro-breaks will significantly improve focus today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planner;
