import React from 'react';

interface HeaderProps {
  title: string;
  onLogout: () => void;
  onMenuClick: () => void;
  isPrivacyActive: boolean;
  setIsPrivacyActive: (v: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ title, onLogout, onMenuClick, isPrivacyActive, setIsPrivacyActive }) => {
  const monthlyGoalProgress = 68; 

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0 z-30 shadow-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* IZQUIERDA: Menú y Título */}
      <div className="flex items-center gap-2 md:gap-4">
        <button onClick={onMenuClick} className="p-2 -ml-2 text-slate-600 lg:hidden hover:bg-slate-50 rounded-lg transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <div className="flex flex-col">
            <h2 className="text-sm font-bold text-slate-800 tracking-tight whitespace-nowrap uppercase italic leading-none">{title}</h2>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter text-blue-600/60">InsurCore Pro</span>
                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
            </div>
        </div>
      </div>

      {/* CENTRO: Monitor Operativo (Oculto en móvil) */}
      <div className="hidden lg:flex items-center gap-8 px-6 py-1.5 bg-slate-50 border border-slate-100 rounded-lg">
        <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Meta Mensual</span>
                <span className="text-[11px] font-bold text-slate-700 leading-none mt-1">{monthlyGoalProgress}%</span>
            </div>
            <div className="w-24 h-1.5 bg-slate-200 rounded-none overflow-hidden">
                <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${monthlyGoalProgress}%` }}></div>
            </div>
        </div>
        <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
            <div className="flex flex-col"><span className="text-[8px] font-black text-slate-400 uppercase leading-none">UF</span><span className="text-[11px] font-black text-blue-600 leading-none mt-1 font-bold tracking-tighter">$37.942</span></div>
            <div className="flex flex-col"><span className="text-[8px] font-black text-slate-400 uppercase leading-none">USD</span><span className="text-[11px] font-black text-slate-700 leading-none mt-1 font-bold tracking-tighter">$945,20</span></div>
        </div>
      </div>

      {/* DERECHA: Botones y Perfil */}
      <div className="flex items-center gap-2 md:gap-4">
        
        {/* BOTÓN MODO PRIVACIDAD MEJORADO */}
        <button 
            onClick={() => setIsPrivacyActive(!isPrivacyActive)}
            title={isPrivacyActive ? "Desactivar Privacidad" : "Activar Privacidad"}
            className={`p-2 rounded-xl transition-all border flex items-center justify-center ${
                isPrivacyActive 
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30' 
                : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 shadow-sm'
            }`}
        >
            {isPrivacyActive ? (
                /* Icono: Ojo Tachado (Privacidad ON) */
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
            ) : (
                /* Icono: Ojo Abierto (Privacidad OFF) */
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            )}
        </button>

        <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-all no-print hidden sm:block">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-slate-100">
          <div className="text-right hidden xl:block leading-none">
            <p className="text-xs font-bold text-slate-700 uppercase">John Doe</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-tighter italic">Personal Office</p>
          </div>
          <button onClick={onLogout} className="w-9 h-9 rounded-none bg-[#0f172a] text-white font-black text-[11px] shadow-md border border-white/10 italic hover:bg-blue-600 transition-all uppercase tracking-tighter">JD</button>
        </div>
      </div>
    </header>
  );
};

export default Header;