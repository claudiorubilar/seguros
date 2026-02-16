import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

const formatCLP = (v: number) => `$${Math.round(v).toLocaleString('es-CL')}`;

const SaasDashboard: React.FC = () => {
    // Data simulada de crecimiento SAAS
    const growthData = [
        { name: 'Ago', mrr: 12500000, active: 45 },
        { name: 'Sep', mrr: 14200000, active: 52 },
        { name: 'Oct', mrr: 18900000, active: 68 },
        { name: 'Nov', mrr: 22400000, active: 84 },
        { name: 'Dic', mrr: 21100000, active: 82 },
        { name: 'Ene', mrr: 28500000, active: 104 },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            
            {/* SNAPSHOTS SAAS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ingreso Recurrente (MRR)</p>
                    <h3 className="text-2xl font-900 text-blue-600">{formatCLP(28500000)}</h3>
                    <div className="mt-2 text-emerald-500 text-[10px] font-black italic">↑ +15% vs mes ant.</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Corredoras Activas</p>
                    <h3 className="text-2xl font-900 text-slate-800">104</h3>
                    <p className="mt-2 text-slate-400 text-[10px] font-bold">12 en proceso de alta</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Usuarios Totales</p>
                    <h3 className="text-2xl font-900 text-slate-800">1.450</h3>
                    <p className="mt-2 text-blue-500 text-[10px] font-bold uppercase tracking-tighter">Carga de Servidor: 42%</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border-2 border-rose-100 shadow-sm">
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Churn Rate (Bajas)</p>
                    <h3 className="text-2xl font-900 text-rose-700">1.2%</h3>
                    <p className="mt-2 text-rose-400 text-[10px] font-bold">UMBRAL DE SEGURIDAD OK</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h4 className="text-xs font-900 text-slate-500 uppercase tracking-widest mb-8">Evolución Mensual de Ingresos (Innosoft)</h4>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={growthData}>
                                <defs>
                                    <linearGradient id="colorMRR" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000000}M`} />
                                <Tooltip />
                                <Area type="monotone" dataKey="mrr" stroke="#2563eb" strokeWidth={3} fill="url(#colorMRR)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* AI INSIGHT SUPERADMIN */}
                <div className="bg-[#0f172a] p-10 rounded-[2.5rem] text-white flex flex-col justify-center relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-blue-600 rounded-2xl animate-pulse"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></div>
                            <span className="text-xs font-900 text-blue-400 uppercase tracking-[0.3em]">Core-AI SaaS Master</span>
                        </div>
                        <p className="text-lg font-500 italic leading-relaxed text-slate-200">
                            "Innosoft, el crecimiento de este mes está liderado por el <span className="text-emerald-400 font-900">Plan Enterprise</span>. Se recomienda monitorear la Corredora 'Andes SpA', ya que su uso de API ha subido un 300% en las últimas 48 horas."
                        </p>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-600 opacity-10 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
};

export default SaasDashboard;