
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, BrainCircuit, Loader2, Info } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: "Hello! I'm your EduBoost AI Assistant. Need help understanding a concept or organizing your study notes?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: 'You are a helpful and knowledgeable AI study assistant. Help students with academic questions, productivity tips, and subject explanations. Keep responses concise and encouraging.'
        }
      });

      const response = await chat.sendMessage({ message: userMessage });
      setMessages(prev => [...prev, { role: 'ai', content: response.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I'm having trouble connecting to my brain right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[70vh] flex flex-col bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <BrainCircuit size={24} />
          </div>
          <div>
            <h3 className="font-bold">AI Study Tutor</h3>
            <div className="flex items-center gap-1.5 text-xs text-indigo-200 font-medium">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              Always active
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <Info size={20} />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`flex gap-3 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-indigo-600 shadow-sm'
              }`}>
                {m.role === 'user' ? <User size={16} /> : <BrainCircuit size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
              }`}>
                {m.content}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                <BrainCircuit size={16} className="text-slate-400" />
              </div>
              <div className="p-4 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-indigo-600" />
                <span className="text-sm text-slate-400">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-3 p-2 bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-indigo-400 transition-all">
          <input 
            type="text" 
            placeholder="Ask anything about your subjects or productivity..."
            className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-sm"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-md"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          Gemini 3.0 Experimental Model. Always verify important facts.
        </p>
      </div>
    </div>
  );
};

export default Chatbot;
