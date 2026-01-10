
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const aiResponse = await geminiService.analyzeSymptoms(userMsg);
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse || '' }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <div className="bg-white w-[340px] md:w-[400px] h-[520px] rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] flex flex-col border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="px-6 py-5 flex justify-between items-center border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <i className="fas fa-sparkles text-xs"></i>
              </div>
              <span className="font-semibold text-slate-800 text-sm">IA Assistente</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-slate-600 transition-colors">
              <i className="fas fa-times text-sm"></i>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 minimal-scroll">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 mb-4">
                  <i className="fas fa-notes-medical text-xl"></i>
                </div>
                <h4 className="text-slate-800 font-semibold mb-2">Como posso ajudar hoje?</h4>
                <p className="text-slate-400 text-xs leading-relaxed">Descreva o que você está sentindo e eu indicarei a melhor especialidade.</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-100' 
                  : 'bg-slate-50 text-slate-600 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-1.5 p-2 px-4 bg-slate-50 rounded-full">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 pt-2">
            <div className="relative group">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ex: Estou com enxaqueca..."
                className="w-full text-sm bg-slate-50 border-none rounded-2xl px-5 py-3.5 pr-12 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="absolute right-2 top-1.5 w-10 h-10 text-indigo-600 flex items-center justify-center hover:bg-white rounded-xl transition-all disabled:opacity-30"
              >
                <i className="fas fa-paper-plane text-xs"></i>
              </button>
            </div>
            <p className="text-[10px] text-slate-300 mt-3 text-center">Isso não substitui aconselhamento médico profissional.</p>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative"
        >
          <div className="absolute inset-0 bg-indigo-600 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-white border border-slate-100 text-slate-800 p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center">
               <i className="fas fa-sparkles text-xs"></i>
             </div>
             <span className="text-sm font-semibold pr-2">Triagem IA</span>
          </div>
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
