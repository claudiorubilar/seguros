import React, { useState, useMemo } from 'react';
import { useAppData } from '../hooks/useAppData';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';

// --- ICONOS INTERNOS ESTÁNDAR ---
const IconReport = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const IconX = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconPrint = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>;
const IconDownload = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;

const COLORS = ['#0f172a', '#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'];

const Reports: React.FC = () => {
    const { policies, claims, agents, isLoading } = useAppData();
    const [activeReport, setActiveReport] = useState<string | null>(null);
    const UF_VALUE = 39640;

    const fmt = (v: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v);

    // --- PROCESAMIENTO DE DATA ---
    const productionData = useMemo(() => {
        const ramos: Record<string, number> = {};
        policies.forEach(p => {
            const val = p.currency === 'UF' ? p.totalPremium * UF_VALUE : p.totalPremium;
            ramos[p.lineOfBusiness] = (ramos[p.lineOfBusiness] || 0) + val;
        });
        return Object.entries(ramos).map(([name, value]) => ({ name, value }));
    }, [policies]);

    const collectionAging = useMemo(() => {
        const installments = policies.flatMap(p => p.installments);
        return [
            { name: '0-30 Días', value: installments.filter(i => i.status === 'Pendiente').length * 450000 },
            { name: '31-60 Días', value: installments.filter(i => i.status === 'Vencida').length * 250000 },
            { name: '90+ Días', value: installments.filter(i => i.status === 'Vencida').length * 850000 }
        ];
    }, [policies]);

    const agentRanking = useMemo(() => {
        return agents.map(a => {
            const pTotal = policies.filter(p => p.agentId === a.id).reduce((acc, curr) => acc + (curr.totalPremium || 0), 0);
            return { name: a.name, value: pTotal };
        }).sort((a,b) => b.value - a.value).slice(0, 5);
    }, [agents, policies]);

    const reportsList = [
        { id: 'prod', title: 'Reporte de Producción', desc: 'Análisis por ramo y prima neta emitida.', icon: '📊', ai: 'La producción en el ramo de Vida ha crecido un 12% este mes. Se recomienda incentivar este segmento.' },
        { id: 'claims', title: 'Análisis de Siniestralidad', desc: 'Frecuencia y montos reclamados por cartera.', icon: '⚠️', ai: 'Siniestralidad en Vehículos estable (42%). Revisar 3 casos abiertos de alto valor en Incendio.' },
        { id: 'collections', title: 'Estado de Cobranza', desc: 'Aging de deuda y efectividad de recaudación.', icon: '💰', ai: 'Mora crítica detectada en cuotas de +90 días. Iniciar proceso de cobranza prejudicial para 12 pólizas.' },
        { id: 'ranking', title: 'Ranking de Agentes', desc: 'Líderes de venta y cumplimiento de metas.', icon: '🏆', ai: 'Carlos Díaz lidera en retención (98%). Benjamín Soto requiere apoyo en cierres corporativos.' }
    ];

    if (isLoading) return <div className="p-20 text-center font-800 text-slate-400 animate-pulse text-xl uppercase tracking-widest italic">Cargando Inteligencia...</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            
            {/* INTRODUCCIÓN - AHORA A ANCHO COMPLETO */}
            <div className="w-full">
                <p className="text-slate-500 text-base font-600 leading-relaxed italic border-l-4 border-blue-600 pl-6 py-1">
                    Bienvenido a la Central de Inteligencia de InsurCore Pro. Consulte reportes analíticos basados en la data real de su operación para tomar decisiones informadas.
                </p>
            </div>

            {/* GRID DE REPORTES - RADIOS REDUCIDOS (12px) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {reportsList.map((report) => (
                    <div key={report.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group flex flex-col justify-between h-64 cursor-pointer" onClick={() => setActiveReport(report.id)}>
                        <div>
                            <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center text-2xl mb-4 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                {report.icon}
                            </div>
                            <h3 className="text-base font-800 text-slate-800 uppercase tracking-tight mb-2 leading-tight">{report.title}</h3>
                            <p className="text-slate-400 text-[11px] font-700 uppercase tracking-wider leading-relaxed">{report.desc}</p>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600 font-900 text-[10px] uppercase tracking-widest mt-4 bg-blue-50 px-3 py-1.5 rounded-lg w-fit">
                            Auditar <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL DE REPORTE - RADIOS REDUCIDOS (16px) */}
            {activeReport && (
                <div className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-md z-[100] flex items-center justify-center p-6 no-print">
                    <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">
                        
                        {/* Header del Modal */}
                        <div className="bg-white border-b border-slate-200 p-6 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-[#0f172a] text-white rounded-lg shadow-md">
                                    <IconReport />
                                </div>
                                <div>
                                    <h3 className="text-xl font-900 text-slate-900 uppercase tracking-tight">
                                        {reportsList.find(r => r.id === activeReport)?.title}
                                    </h3>
                                    <p className="text-slate-400 text-[10px] font-800 uppercase tracking-[0.2em]">InsurCore Pro Auditor</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-emerald-700 rounded-md text-[10px] font-900 shadow-sm hover:bg-emerald-50 transition-all uppercase tracking-tighter"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Excel</button>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-rose-800 rounded-md text-[10px] font-900 shadow-sm hover:bg-rose-50 transition-all uppercase ml-1 tracking-tighter"><div className="w-1.5 h-1.5 bg-rose-600 rounded-full"></div> PDF</button>
                                    <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-md text-[10px] font-900 shadow-md hover:bg-black transition-all uppercase ml-1 tracking-tighter">Imprimir</button>
                                </div>
                                <button onClick={() => setActiveReport(null)} className="p-2 bg-slate-100 text-slate-400 hover:text-slate-900 rounded-lg transition-all">
                                    <IconX />
                                </button>
                            </div>
                        </div>

                        {/* Cuerpo del Reporte */}
                        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-slate-50/30">
                            
                            {/* Resumen */}
                            <div className="grid grid-cols-3 gap-6 mb-8">
                                {[
                                    {l: 'Volumen Mensual', v: '$45.680.000', d: '↑ 14%', c: 'text-emerald-600'},
                                    {l: 'Tasa de Cumplimiento', v: '89.2%', d: 'En Meta', c: 'text-blue-600'},
                                    {l: 'Casos en Revisión', v: '14', d: 'Prioritario', c: 'text-rose-600'}
                                ].map((k,i)=>(
                                    <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                        <p className="text-[10px] font-900 text-slate-400 uppercase mb-1 tracking-widest">{k.l}</p>
                                        <p className="text-xl font-900 text-slate-900 leading-none">{k.v}</p>
                                        <p className={`${k.c} text-[10px] font-800 mt-2 uppercase`}>{k.d}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-8">
                                    {/* Gráfico Principal */}
                                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                        <h4 className="text-[10px] font-900 text-slate-400 uppercase mb-8 tracking-[0.2em]">Visualización de Tendencia</h4>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                {activeReport === 'prod' ? (
                                                    <BarChart data={productionData}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:10, fontWeight:700}} />
                                                        <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000000}M`} tick={{fontSize:10}} />
                                                        <Tooltip />
                                                        <Bar dataKey="value" fill="#3b82f6" radius={[4,4,0,0]} barSize={32} />
                                                    </BarChart>
                                                ) : (
                                                    <LineChart data={activeReport === 'ranking' ? agentRanking : collectionAging}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                        <XAxis dataKey="name" tick={{fontSize:10, fontWeight:700}} axisLine={false} tickLine={false} />
                                                        <Tooltip />
                                                        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{r:4, fill:'#3b82f6'}} />
                                                    </LineChart>
                                                )}
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Tabla Desglose */}
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                        <table className="w-full text-left">
                                            <thead className="bg-[#0f172a] text-white">
                                                <tr className="text-[9px] uppercase font-900 tracking-widest">
                                                    <th className="px-6 py-4">Categoría / Ítem</th>
                                                    <th className="px-6 py-4 text-right">Monto Procesado</th>
                                                    <th className="px-6 py-4 text-center">Impacto</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-xs font-700 text-slate-600">
                                                {(activeReport === 'prod' ? productionData : activeReport === 'ranking' ? agentRanking : collectionAging).map((item, i) => (
                                                    <tr key={i} className="border-b border-slate-50 hover:bg-blue-50/50 transition-all italic even:bg-slate-50/30">
                                                        <td className="px-6 py-3 uppercase tracking-tighter">{item.name}</td>
                                                        <td className="px-6 py-3 text-right font-900 text-slate-900">{fmt(item.value)}</td>
                                                        <td className="px-6 py-3">
                                                            <div className="w-16 h-1 bg-slate-100 rounded-full mx-auto overflow-hidden">
                                                                <div className="bg-blue-500 h-full" style={{width: `${Math.random()*100}%`}}></div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Columna Derecha */}
                                <div className="space-y-6">
                                    <div className="bg-[#0f172a] p-6 rounded-xl text-white relative overflow-hidden shadow-lg">
                                        <div className="relative z-10 flex flex-col gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 bg-blue-600 rounded-lg"><IconReport /></div>
                                                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Core-AI Insight</p>
                                            </div>
                                            <p className="text-xs font-600 italic leading-relaxed text-slate-300">
                                                "{reportsList.find(r => r.id === activeReport)?.ai}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                                        <h5 className="text-[9px] font-900 text-slate-400 uppercase tracking-widest mb-2">Resumen Operativo</h5>
                                        {[
                                            {l: 'Volumen Total', v: fmt(125000000), c: 'text-slate-900'},
                                            {l: 'Crecimiento Q1', v: '+18.4%', c: 'text-emerald-600'},
                                            {l: 'Margen Comisión', v: '12.5%', c: 'text-blue-600'}
                                        ].map((r,i)=>(
                                            <div key={i} className="flex justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                                                <span className="text-[10px] font-700 text-slate-500 uppercase">{r.l}</span>
                                                <span className={`text-xs font-900 ${r.c}`}>{r.v}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;