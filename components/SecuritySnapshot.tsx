import React from 'react';

const SecuritySnapshot: React.FC = () => {
    return (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl mb-6 flex items-center justify-between shadow-2xl relative overflow-hidden group">
            <div className="flex items-center gap-6 relative z-10">
                <div className="flex items-center gap-3 border-r border-slate-700 pr-6">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <div>
                        <p className="text-[9px] font-900 text-slate-500 uppercase tracking-widest leading-none mb-1">Cifrado de Datos</p>
                        <p className="text-xs font-bold text-white leading-none">AES-256 ACTIVE</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 border-r border-slate-700 pr-6">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <div>
                        <p className="text-[9px] font-900 text-slate-500 uppercase tracking-widest leading-none mb-1">Acceso Identificado</p>
                        <p className="text-xs font-bold text-white leading-none">MFA ENABLED</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <div>
                        <p className="text-[9px] font-900 text-slate-500 uppercase tracking-widest leading-none mb-1">Log de Auditoría</p>
                        <p className="text-xs font-bold text-white leading-none">SYNC: 100% OK</p>
                    </div>
                </div>
            </div>
            
            <div className="flex gap-2 relative z-10">
                <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-900 px-3 py-1.5 rounded-lg border border-slate-700 transition-all uppercase tracking-tighter">
                    Revisar Logs CMF
                </button>
            </div>
            {/* Efecto visual de fondo */}
            <div className="absolute right-0 top-0 w-32 h-full bg-blue-600/5 skew-x-12 translate-x-10"></div>
        </div>
    );
};

export default SecuritySnapshot;