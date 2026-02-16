import React, { useState } from 'react';

const IconX = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconCheck = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;

const Plans: React.FC = () => {
    const [modal, setModal] = useState<{ open: boolean, mode: 'create' | 'edit', data: any }>({ open: false, mode: 'create', data: null });

    const initialPlans = [
        { id: '1', name: 'Plan Pyme', price: '250000', benefits: ['Hasta 5 Usuarios', 'Soporte 24/7', 'Módulo CRM Básico'] },
        { id: '2', name: 'Plan Pro', price: '750000', benefits: ['Hasta 20 Usuarios', 'Soporte 24/7', 'IA Insights Nivel 1', 'API de Integración'] },
        { id: '3', name: 'Plan Enterprise', price: '2500000', benefits: ['Ilimitado Usuarios', 'Soporte 24/7 Dedicado', 'IA Insights Pro', 'White Label Custom'] },
    ];

    const fmt = (v: string) => `$${Math.round(Number(v)).toLocaleString('es-CL')}`;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <div className="flex justify-between items-center mb-2">
                <button 
                    onClick={() => setModal({ open: true, mode: 'create', data: { name: '', price: '', benefits: ['', ''] } })}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-800 text-xs shadow-xl uppercase tracking-widest active:scale-95 transition-all"
                >
                    + CREAR NUEVO PLAN
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                {initialPlans.map(plan => (
                    <div key={plan.id} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-500 transition-all flex flex-col justify-between group h-[420px]">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-900 text-slate-800 uppercase italic tracking-tighter">{plan.name}</h3>
                                <span className="bg-blue-50 text-blue-600 text-[9px] font-900 px-2 py-0.5 rounded uppercase">SaaS Offer</span>
                            </div>
                            <p className="text-3xl font-900 text-blue-600 leading-none">{fmt(plan.price)} <span className="text-xs text-slate-400 uppercase font-black ml-1">/ MES</span></p>
                            
                            <div className="mt-8 space-y-3">
                                {plan.benefits.map((b, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-[13px] font-700 text-slate-600 uppercase tracking-tighter">
                                        <div className="text-blue-500"><IconCheck /></div> {b}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button 
                            onClick={() => setModal({ open: true, mode: 'edit', data: plan })}
                            className="w-full py-3 bg-slate-50 text-slate-500 text-[10px] font-900 uppercase tracking-widest rounded-lg group-hover:bg-[#0f172a] group-hover:text-white transition-all shadow-sm"
                        >
                            EDITAR BENEFICIOS Y PRECIO
                        </button>
                    </div>
                ))}
            </div>

            {/* MODAL INTELIGENTE: CREAR / EDITAR PLAN */}
            {modal.open && (
                <div className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/20 text-left">
                        <div className="bg-[#0f172a] p-10 text-white relative">
                            <button onClick={() => setModal({ ...modal, open: false })} className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400"><IconX /></button>
                            <h3 className="text-3xl font-900 uppercase tracking-tighter italic leading-none">{modal.mode === 'create' ? 'NUEVO PLAN' : 'EDITAR PLAN'}</h3>
                            <p className="text-blue-400 text-xs font-800 uppercase tracking-[0.2em] mt-1">Configuración Comercial Innosoft</p>
                        </div>

                        <div className="p-10 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-900 text-slate-400 uppercase tracking-widest ml-1">Nombre del Plan</label>
                                    <input type="text" defaultValue={modal.data?.name} placeholder="Ej: Plan Corporativo" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-3.5 text-sm font-700 outline-none focus:border-blue-500 uppercase shadow-inner" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-900 text-blue-600 uppercase tracking-widest ml-1">Precio Mensual (CLP)</label>
                                    <input type="number" defaultValue={modal.data?.price} className="w-full bg-blue-50 border-2 border-blue-100 rounded-xl px-5 py-3.5 text-lg font-900 text-blue-700 outline-none focus:border-blue-600 shadow-inner" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-900 text-slate-400 uppercase tracking-widest ml-1">Beneficios Incluidos (Uno por línea)</label>
                                <textarea 
                                    rows={4} 
                                    defaultValue={modal.data?.benefits?.join('\n')}
                                    placeholder="Hasta 10 usuarios&#10;Soporte prioritario&#10;IA Nivel 2"
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-700 outline-none focus:border-blue-500 shadow-inner leading-relaxed"
                                ></textarea>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button onClick={() => setModal({ ...modal, open: false })} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-xl font-800 text-[11px] uppercase">Cancelar</button>
                                <button className="flex-1 py-5 bg-blue-600 text-white rounded-xl font-800 text-[11px] uppercase shadow-xl shadow-blue-600/30 active:scale-95 transition-all">
                                    {modal.mode === 'create' ? 'ACTIVAR PLAN' : 'GUARDAR CAMBIOS'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Plans;