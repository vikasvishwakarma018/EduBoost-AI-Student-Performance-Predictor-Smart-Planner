
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  Target, AlertTriangle, TrendingUp, Clock, 
  CheckCircle2, Sparkles, AlertCircle, PieChart as PieIcon
} from 'lucide-react';
import { StudentData, PredictionResult } from '../types';

interface DashboardProps {
  studentData: StudentData | null;
  prediction: PredictionResult | null;
  onNavigate: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ studentData, prediction, onNavigate }) => {
  if (!studentData || !prediction) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
        <div className="bg-indigo-100 p-6 rounded-full mb-6">
          <Sparkles className="text-indigo-600" size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">No Performance Data Yet</h2>
        <p className="text-slate-500 mb-8 max-w-md text-center">
          Provide your academic and lifestyle metrics to generate your first AI performance prediction.
        </p>
        <button 
          onClick={onNavigate}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          Start Analysis
        </button>
      </div>
    );
  }

  const barData = [
    { name: 'Previous', value: studentData.prevMarks },
    { name: 'Predicted', value: prediction.predictedMarks },
    { name: 'Goal', value: studentData.goalMarks },
  ];

  const pieData = [
    { name: 'Attendance', value: studentData.attendance, color: '#6366f1' },
    { name: 'Assignments', value: studentData.assignmentRate, color: '#10b981' },
    { name: 'Study Focus', value: Math.min(100, studentData.studyHours * 8), color: '#f59e0b' },
    { name: 'Wellness', value: (11 - studentData.stressLevel) * 10, color: '#ec4899' }
  ];

  const riskColors = {
    Low: 'text-green-600 bg-green-50 border-green-200',
    Medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    High: 'text-red-600 bg-red-50 border-red-200'
  };

  const gradeEmoji = {
    A: '🏆', B: '✨', C: '📈', D: '⚠️', F: '🚨'
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Target className="text-indigo-600" />} 
          title="Predicted Mark" 
          value={`${prediction.predictedMarks}%`} 
          subtitle={`Grade: ${prediction.grade} ${gradeEmoji[prediction.grade as keyof typeof gradeEmoji]}`} 
        />
        <StatCard 
          icon={<AlertTriangle className={prediction.riskLevel === 'High' ? 'text-red-600' : 'text-amber-600'} />} 
          title="Risk Level" 
          value={prediction.riskLevel} 
          subtitle="Based on current metrics"
          className={riskColors[prediction.riskLevel as keyof typeof riskColors]}
        />
        <StatCard 
          icon={<TrendingUp className="text-emerald-600" />} 
          title="Goal Gap" 
          value={`${(studentData.goalMarks - prediction.predictedMarks).toFixed(1)}%`} 
          subtitle="Points needed to reach goal"
        />
        <StatCard 
          icon={<Clock className="text-violet-600" />} 
          title="Efficiency Score" 
          value={`${((studentData.assignmentRate + studentData.attendance) / 2).toFixed(0)}%`} 
          subtitle="Process health indicator"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Bar Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-800">Growth Projection</h3>
            <div className="flex gap-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-indigo-500 rounded-full"></span> Performance Value</div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[12, 12, 0, 0]} barSize={60} animationDuration={1500} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Pie Chart Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center gap-2 mb-6 text-slate-800">
            <PieIcon size={20} className="text-indigo-600" />
            <h3 className="text-lg font-bold">Success Balance</h3>
          </div>
          <div className="h-64 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 text-center mt-4 italic">
            Visualizing the impact of current habits on success.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI Feedback */}
        <div className="lg:col-span-1 bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-200">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={24} className="text-indigo-200" />
            <h3 className="text-xl font-bold">AI Expert Analysis</h3>
          </div>
          <p className="text-indigo-100 mb-6 italic leading-relaxed text-sm">
            "{prediction.analysis}"
          </p>
          <div className="space-y-4">
            <h4 className="font-semibold text-white/90 uppercase tracking-wider text-[10px]">Strategic Recommendations</h4>
            {prediction.suggestions.slice(0, 3).map((s, idx) => (
              <div key={idx} className="flex gap-3 items-start bg-white/10 p-3 rounded-xl border border-white/5">
                <CheckCircle2 size={16} className="text-indigo-300 mt-1 flex-shrink-0" />
                <span className="text-sm">{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SWOT Section Expanded */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-emerald-600">
              <TrendingUp size={22} />
              <h3 className="text-lg font-bold">Key Strengths</h3>
            </div>
            <ul className="space-y-4">
              {prediction.strengths.map((s, i) => (
                <li key={i} className="flex items-center gap-4 text-slate-600 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/20"></div>
                  <span className="text-sm font-medium">{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-rose-500">
              <AlertCircle size={22} />
              <h3 className="text-lg font-bold">Growth Opportunities</h3>
            </div>
            <ul className="space-y-4">
              {prediction.weaknesses.map((w, i) => (
                <li key={i} className="flex items-center gap-4 text-slate-600 bg-rose-50/50 p-4 rounded-2xl border border-rose-100/50">
                  <div className="w-2.5 h-2.5 bg-rose-400 rounded-full shadow-lg shadow-rose-400/20"></div>
                  <span className="text-sm font-medium">{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, title: string, value: string, subtitle: string, className?: string }> = ({ icon, title, value, subtitle, className }) => (
  <div className={`bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col transition-all hover:shadow-xl hover:-translate-y-1 ${className}`}>
    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-5 border border-slate-100 shadow-inner">
      {icon}
    </div>
    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</span>
    <span className="text-3xl font-black text-slate-800 mb-1">{value}</span>
    <span className="text-xs text-slate-400 font-medium">{subtitle}</span>
  </div>
);

export default Dashboard;
