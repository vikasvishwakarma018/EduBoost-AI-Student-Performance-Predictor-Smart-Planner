
import React, { useState } from 'react';
import { BrainCircuit, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import { StudentData, PredictionResult, StudyPlanItem } from '../types';
import { getPrediction, generateStudyPlan } from '../services/geminiService';

interface InputFormProps {
  onComplete: (data: StudentData, pred: PredictionResult, plan: StudyPlanItem[]) => void;
  initialData: StudentData | null;
}

const InputForm: React.FC<InputFormProps> = ({ onComplete, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<StudentData>(initialData || {
    studyHours: 4,
    sleepHours: 7,
    attendance: 85,
    prevMarks: 70,
    assignmentRate: 80,
    internetUsage: 2,
    stressLevel: 5,
    goalMarks: 85
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const pred = await getPrediction(formData);
      const plan = await generateStudyPlan(formData, pred);
      onComplete(formData, pred, plan);
    } catch (error) {
      console.error("AI Analysis failed:", error);
      alert("Failed to connect to AI engine. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, name, type = "number", min, max, unit }: any) => (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
          {formData[name as keyof StudentData]}{unit}
        </span>
      </div>
      <input 
        type="range"
        min={min}
        max={max}
        step={type === "number" ? 1 : 0.5}
        value={formData[name as keyof StudentData]}
        onChange={e => setFormData({...formData, [name]: parseFloat(e.target.value)})}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
      />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-indigo-600 p-8 text-white relative">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Performance Metrics</h2>
            <p className="text-indigo-100 opacity-90">Our AI uses these data points to build your academic profile.</p>
          </div>
          <Sparkles className="absolute right-8 top-8 opacity-20" size={80} />
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Academic Section */}
            <div className="space-y-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
                Academic Foundation
              </h3>
              <InputField label="Current Daily Study Hours" name="studyHours" min={0} max={16} unit="h" />
              <InputField label="Class Attendance Rate" name="attendance" min={0} max={100} unit="%" />
              <InputField label="Previous Exam Marks" name="prevMarks" min={0} max={100} unit="%" />
              <InputField label="Assignment Completion" name="assignmentRate" min={0} max={100} unit="%" />
            </div>

            {/* Lifestyle Section */}
            <div className="space-y-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="w-2 h-6 bg-pink-500 rounded-full"></span>
                Lifestyle & Wellness
              </h3>
              <InputField label="Avg. Sleep Hours" name="sleepHours" min={3} max={12} unit="h" />
              <InputField label="Internet/Social Media Usage" name="internetUsage" min={0} max={12} unit="h" />
              <InputField label="Current Stress Level" name="stressLevel" min={1} max={10} unit="/10" />
              <InputField label="Goal Target Marks" name="goalMarks" min={0} max={100} unit="%" />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500 max-w-md">
              Higher data accuracy leads to more precise AI predictions and effective study planning.
            </p>
            <button 
              disabled={loading}
              className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-indigo-700 transition-all disabled:opacity-70 shadow-xl shadow-indigo-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  Generate AI Analysis
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputForm;
