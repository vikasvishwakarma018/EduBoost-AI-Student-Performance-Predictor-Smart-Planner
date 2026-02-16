
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  User as UserIcon, 
  BarChart3, 
  GraduationCap, 
  LogOut,
  BrainCircuit,
  Settings,
  MessageSquare,
  Menu,
  X
} from 'lucide-react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import InputForm from './components/InputForm';
import Planner from './components/Planner';
import Chatbot from './components/Chatbot';
import { User, StudentData, PredictionResult, StudyPlanItem } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'dashboard' | 'input' | 'planner' | 'chat'>('dashboard');
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [studyPlan, setStudyPlan] = useState<StudyPlanItem[] | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('edu_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const savedData = localStorage.getItem('student_data');
    if (savedData) setStudentData(JSON.parse(savedData));

    const savedPrediction = localStorage.getItem('prediction_result');
    if (savedPrediction) setPrediction(JSON.parse(savedPrediction));

    const savedPlan = localStorage.getItem('study_plan');
    if (savedPlan) setStudyPlan(JSON.parse(savedPlan));
  }, []);

  const handleLogin = (name: string, email: string) => {
    const newUser = { name, email, isLoggedIn: true };
    setUser(newUser);
    localStorage.setItem('edu_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('edu_user');
    setView('dashboard');
    setIsSidebarOpen(false);
  };

  const handleDataUpdate = (data: StudentData, pred: PredictionResult, plan: StudyPlanItem[]) => {
    setStudentData(data);
    setPrediction(pred);
    setStudyPlan(plan);
    localStorage.setItem('student_data', JSON.stringify(data));
    localStorage.setItem('prediction_result', JSON.stringify(pred));
    localStorage.setItem('study_plan', JSON.stringify(plan));
    setView('dashboard');
    setIsSidebarOpen(false);
  };

  const navigateTo = (newView: typeof view) => {
    setView(newView);
    setIsSidebarOpen(false);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header - Only visible on small screens */}
      <header className="md:hidden bg-indigo-900 text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => setIsSidebarOpen(true)}
        >
          <div className="p-1.5 bg-indigo-500 rounded-lg group-active:scale-95 transition-transform">
            <BrainCircuit size={22} />
          </div>
          <span className="text-lg font-bold tracking-tight">EduBoost AI</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-indigo-800 rounded-lg transition-colors"
          aria-label="Toggle Menu"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Backdrop for Mobile Sidebar */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop (Static Full Height) and Mobile (Drawer) */}
      <nav className={`
        fixed md:sticky top-0 left-0 h-screen z-50 md:z-20
        w-64 bg-indigo-900 text-white flex flex-col p-6
        transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20">
              <BrainCircuit size={28} />
            </div>
            <span className="text-xl font-bold tracking-tight">EduBoost AI</span>
          </div>
          {/* Close button for mobile inside the drawer */}
          <button 
            className="md:hidden p-1 hover:bg-indigo-800 rounded-lg"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-2">
          <NavBtn active={view === 'dashboard'} onClick={() => navigateTo('dashboard')} icon={<LayoutDashboard size={20} />} label="Overview" />
          <NavBtn active={view === 'input'} onClick={() => navigateTo('input')} icon={<BarChart3 size={20} />} label="Analyze Performance" />
          <NavBtn active={view === 'planner'} onClick={() => navigateTo('planner')} icon={<Calendar size={20} />} label="Study Planner" />
          <NavBtn active={view === 'chat'} onClick={() => navigateTo('chat')} icon={<MessageSquare size={20} />} label="AI Tutor Chat" />
        </div>

        <div className="pt-6 mt-6 border-t border-indigo-800 space-y-4">
          <div className="flex items-center gap-3 px-3 py-2 text-indigo-200">
            <div className="w-10 h-10 bg-indigo-800 rounded-full flex items-center justify-center text-indigo-300 flex-shrink-0 border border-indigo-700">
              <UserIcon size={20} />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-white truncate">{user.name}</span>
              <span className="text-xs truncate opacity-70">{user.email}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 text-indigo-300 hover:text-white hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all border border-transparent hover:border-red-500/20"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto w-full">
        {/* Desktop Header */}
        <header className="hidden md:flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              {view === 'dashboard' && 'Academic Dashboard'}
              {view === 'input' && 'Performance Analysis'}
              {view === 'planner' && 'Your Smart Study Plan'}
              {view === 'chat' && 'AI Study Assistant'}
            </h1>
            <p className="text-slate-500 mt-1">Hello, {user.name}! Here's your personalized learning summary.</p>
          </div>
        </header>

        {/* Mobile Title Section */}
        <div className="md:hidden mb-6 px-1">
          <h1 className="text-2xl font-bold text-slate-800">
            {view === 'dashboard' && 'Dashboard'}
            {view === 'input' && 'Analysis'}
            {view === 'planner' && 'Planner'}
            {view === 'chat' && 'Assistant'}
          </h1>
          <p className="text-slate-500 text-sm">Welcome back, {user.name}!</p>
        </div>

        <div className="max-w-7xl mx-auto">
          {view === 'dashboard' && (
            <Dashboard 
              studentData={studentData} 
              prediction={prediction} 
              onNavigate={() => navigateTo('input')} 
            />
          )}
          {view === 'input' && (
            <InputForm 
              onComplete={handleDataUpdate} 
              initialData={studentData} 
            />
          )}
          {view === 'planner' && (
            <Planner 
              plan={studyPlan} 
              prediction={prediction} 
            />
          )}
          {view === 'chat' && (
            <Chatbot />
          )}
        </div>
      </main>
    </div>
  );
};

interface NavBtnProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavBtn: React.FC<NavBtnProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${
      active 
      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40 border border-indigo-500/30' 
      : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white border border-transparent hover:border-indigo-700/50'
    }`}
  >
    <div className={`${active ? 'text-white' : 'text-indigo-400'}`}>
      {icon}
    </div>
    <span className="font-semibold">{label}</span>
  </button>
);

export default App;
