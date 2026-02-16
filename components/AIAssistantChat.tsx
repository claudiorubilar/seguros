import React, { useState, useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const AIAssistantChat: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  // Ajustado: Eliminada la mención de roles en el saludo inicial
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Hola. Soy Core-AI. ¿Desea que analicemos la mora actual o las proyecciones de inversión del período?' }
  ]);
  const [input, setInput] = useState('');
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (historyRef.current) historyRef.current.scrollTop = historyRef.current.scrollHeight;
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      // Ajustado: Respuestas neutrales centradas 100% en métricas
      let response = "Analizando indicadores... El reporte actual muestra que el ejecutivo con mayor tasa de retención es Benjamín Soto con un 98%.";
      
      if (userMsg.toLowerCase().includes('mora')) {
        response = "La mora crítica (+90d) representa el 60% del total vencido y se concentra en el ramo Vehículos. Se recomienda priorizar la gestión en la compañía Mapfre.";
      }
      
      if (userMsg.toLowerCase().includes('invertir') || userMsg.toLowerCase().includes('inversión')) {
        response = "Considerando la UF actual en $37.942 y su proyección alcista, la recomendación técnica es asignar el 15% de las utilidades a instrumentos de Renta Fija Nacional.";
      }

      if (userMsg.toLowerCase().includes('puedes') || userMsg.toLowerCase().includes('puedas')) {
        response = "Puedo analizar el estado de la cartera, identificar desviaciones en la recaudación, comparar el rendimiento de la fuerza de ventas y simular escenarios de inversión basados en las utilidades.";
      }

      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed top-0 right-0 h-full w-96 bg-[#0f172a] shadow-2xl z-[100] flex flex-col border-l border-white/5 animate-in slide-in-from-right duration-300"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Header del Chat - Estilo Lean */}
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/30">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <div>
                <h3 className="text-white text-xs font-800 uppercase tracking-widest leading-none">Core-AI Auditor</h3>
                <p className="text-[9px] text-blue-400 font-bold uppercase tracking-tighter mt-1">Análisis Predictivo de Negocio</p>
            </div>
        </div>
        <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      {/* Historial - Tipografía clara y redonda */}
      <div ref={historyRef} className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#0f172a] custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-4 rounded-xl text-[13px] font-500 leading-relaxed shadow-sm ${
                m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-800/80 text-slate-200 rounded-tl-none border border-slate-700/50'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input - Diseño Compacto */}
      <div className="p-6 bg-black/40 border-t border-white/5">
        <div className="relative group">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escriba su consulta analítica..."
                className="w-full bg-slate-800 border-none rounded-xl pl-4 pr-12 py-3 text-xs text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-600 transition-all outline-none"
            />
            <button 
              onClick={handleSend}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all active:scale-90 shadow-lg shadow-blue-600/20"
            >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
        </div>
        <p className="text-[8px] text-slate-600 mt-4 text-center font-bold uppercase tracking-[0.2em] opacity-50">Sincronizado con base de datos real</p>
      </div>
    </div>
  );
};

export default AIAssistantChat;