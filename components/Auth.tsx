
import React, { useState } from 'react';
import { GraduationCap, BrainCircuit, ArrowRight } from 'lucide-react';

interface AuthProps {
  onLogin: (name: string, email: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && (isLogin || formData.name)) {
      onLogin(isLogin ? formData.email.split('@')[0] : formData.name, formData.email);
    }
  };

  return (
    <div className="min-h-screen bg-gradient flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
        {/* Left Side - Info */}
        <div className="md:w-1/2 bg-indigo-600 p-10 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <BrainCircuit size={40} />
              <span className="text-2xl font-bold">EduBoost AI</span>
            </div>
            <h1 className="text-4xl font-bold mb-6">Unlock Your Academic Potential.</h1>
            <p className="text-indigo-100 text-lg leading-relaxed">
              Predict your final marks, get personalized study schedules, and receive data-driven insights to excel in your studies.
            </p>
          </div>
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <GraduationCap />
              </div>
              <div>
                <p className="font-semibold text-lg">95% Accuracy</p>
                <p className="text-indigo-200 text-sm">Performance predictions using Gemini 3.0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-10 bg-white">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h2>
            <p className="text-slate-500">
              {isLogin ? 'Please enter your details to sign in.' : 'Create an account to start your journey.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="name@university.edu"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 font-semibold hover:underline"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
