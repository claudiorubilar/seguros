import React, { useState, useMemo } from 'react';
import { useAppData } from '../hooks/useAppData';
import { Prospect, ProspectStatus } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// --- ICONOS PREMIUM (SHARP STYLE) ---
const IconPlus = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconDrag = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>;
const IconZap = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;

const formatCLP = (v: number) => `$${Math.round(v).toLocaleString('es-CL')}`;

// --- COMPONENTE: TARJETA RICH-CONTENT EXPANDIBLE (DRAGGABLE) ---
const ProspectCard: React.FC<{ prospect: Prospect; color: string; isExpanded: boolean; onToggle: () => void }> = ({ prospect, color, isExpanded, onToggle }) => {
    return (
        <div
            draggable="true"
            onDragStart={(e) => {
                e.dataTransfer.setData("prospectId", prospect.id);
                e.dataTransfer.effectAllowed = "move";
            }}
            onClick={onToggle}
            className={`bg-white border border-slate-200 border-t-4 transition-all cursor-pointer group mb-4 rounded-none ${isExpanded ? 'shadow-2xl ring-1 ring-slate-400 z-10' : 'hover:shadow-md'}`}
            style={{ borderTopColor: color }}
        >
            <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden rounded-none shadow-inner">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${prospect.name}`} alt="avatar" className="w-8 h-8" />
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 border border-slate-100">ID: {prospect.id.slice(-4)}</span>
                </div>

                <h4 className="font-900 text-slate-800 text-[14px] leading-tight uppercase tracking-tighter group-hover:text-blue-600 transition-colors mb-1">{prospect.name}</h4>
                <p className="text-[10px] font-700 text-slate-400 uppercase tracking-widest mb-4 italic leading-none">{prospect.contact}</p>

                <div className="mb-4 text-[9px] font-900 text-slate-400 uppercase tracking-tighter">
                    <div className="flex justify-between mb-1.5"><span>Lead Score</span><span>65%</span></div>
                    <div className="w-full h-1 bg-slate-100 overflow-hidden rounded-none"><div className="h-full transition-all duration-1000" style={{ width: '65%', backgroundColor: color }}></div></div>
                </div>

                <div className="flex justify-between items-end border-t border-slate-50 pt-3">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-900 text-slate-300 uppercase leading-none tracking-tighter">Pipeline</span>
                        <span className="text-[16px] font-900 text-slate-900 tracking-tighter leading-none mt-1 italic">{formatCLP(prospect.pipelineValue)}</span>
                    </div>
                    <div className="text-[9px] font-800 text-slate-400 bg-slate-50 px-2 py-1 border border-slate-100 uppercase leading-none font-black italic">
                        {new Date(prospect.lastContacted).toLocaleDateString('es-CL', {day:'2-digit', month:'short'})}
                    </div>
                </div>
                
                {isExpanded && (
                    <div className="mt-5 pt-5 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300 space-y-4 text-left">
                        {/* FILA 1: CONTACTO RÁPIDO */}
                        <div className="flex flex-wrap gap-4 items-center text-slate-600">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100"><IconZap /></div>
                                <span className="text-xs font-700 tracking-tight">{prospect.email}</span>
                            </div>
                            <span className="text-xs font-700 tracking-tight text-slate-400">|</span>
                            <span className="text-xs font-700 tracking-tight">{prospect.phone}</span>
                        </div>

                        {/* FILA 2: AUDITORÍA DE CUMPLIMIENTO (DOMINIO 8) - Movido aquí para ahorrar espacio */}
                        <div className="grid grid-cols-1 gap-2 py-2 border-y border-slate-50">
                            <div className="flex justify-between items-center font-bold text-[10px]">
                                AUDITORIA DE CUMPLIMIENTO (KYC)
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="font-900 text-slate-400 uppercase">Riesgo CMF:</span>
                                <span className={`font-900 font-bold uppercase ${prospect.kycLevel === 'Alto' ? 'text-red-600' : 'text-green-600'}`}>
                                    {prospect.kycLevel || 'Bajo'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="font-900 text-slate-400 uppercase">Estado PEP:</span>
                                <span className="font-700 font-bold text-slate-700">{prospect.isPEP ? '✓ EXPUESTO' : 'NO REGISTRA'}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="font-900 text-slate-400 uppercase">Consentimiento GDPR</span>
                                <span className="font-700 font-bold text-slate-700">{prospect.dataConsent ? 'Documento Firmado' : 'Pendiente de Firma'}</span>
                            </div>
                        </div>

                        {/* --- SECCIÓN VIDA (DOMINIO 5) --- */}
                        {/* Solo se muestra si hay un valor proyectado alto o puedes cambiarlo por prospect.ramo === 'Vida' */}
                        <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
                            <p className="flex justify-between items-center font-bold text-[10px]">DETALLE DE VIDA</p>
                            <div className="flex justify-between items-center mb-2 bg-blue-50/50 p-2 border-l-2 border-blue-500">
                                <span className="text-[9px] font-900 text-slate-500 uppercase">Capital Proyectado</span>
                                <span className="text-xs font-900 text-blue-700 italic tracking-tighter">
                                    {formatCLP(prospect.pipelineValue * 10)} 
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="font-700 text-slate-500 uppercase italic tracking-tighter">Beneficiarios:</span>
                                <span className="font-900 text-blue-600 bg-blue-50 px-1 rounded text-[9px]">GRUPO FAMILIAR 100%</span>
                            </div>
                        </div>
                        
                        {/* FILA 3: ÚLTIMO LOG (Tu diseño original oscuro) */}
                        <div className="bg-[#0f172a] p-4 text-white rounded-sm">
                            <p className="text-[9px] font-900 text-blue-400 uppercase tracking-widest mb-1 leading-none">Último Log de Gestión</p>
                            <p className="text-[11px] font-500 italic text-slate-300 leading-relaxed uppercase tracking-tighter">
                                {prospect.activityLog && prospect.activityLog.length > 0 
                                  ? prospect.activityLog[prospect.activityLog.length - 1].description 
                                  : "Sin actividad registrada"}
                            </p>
                        </div>
                        

                    </div>
                )}                
                
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
const SalesWorkflow: React.FC = () => {
    const { prospects, updateProspect, isLoading } = useAppData();
    const [searchTerm, setSearchTerm] = useState('');
    const [showAnalysis, setShowAnalysis] = useState(true);
    const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
    const [activePeriod, setActivePeriod] = useState('6M');

    // --- LÓGICA DE PERIODICIDAD DEL GRÁFICO ---
    const chartData = useMemo(() => {
        const full = [
            { name: 'Ene 24', Proy: 40, Real: 24 }, { name: 'Mar 24', Proy: 55, Real: 48 },
            { name: 'May 24', Proy: 60, Real: 58 }, { name: 'Jul 24', Proy: 70, Real: 65 },
            { name: 'Sep 24', Proy: 80, Real: 75 }, { name: 'Nov 24', Proy: 90, Real: 85 },
            { name: 'Ene 25', Proy: 100, Real: 95 }, { name: 'Mar 25', Proy: 115, Real: 120 },
            { name: 'May 25', Proy: 130, Real: 140 }, { name: 'Jun 25', Proy: 140, Real: 135 }
        ];
        if (activePeriod === '1M') return full.slice(-4);
        if (activePeriod === '6M') return full.slice(-6);
        return full;
    }, [activePeriod]);

    // --- TOP 3 PARA EL PODIO ---
    const topProspects = useMemo(() => {
        return [...(prospects || [])]
            .sort((a, b) => b.pipelineValue - a.pipelineValue)
            .slice(0, 3);
    }, [prospects]);

    const stages: { id: ProspectStatus; label: string; color: string; bg: string; text: string }[] = [
        { id: 'Nuevo', label: 'LEADS DESCUBIERTOS', color: '#2563eb', bg: 'bg-blue-50/30', text: 'text-blue-900' },
        { id: 'Contactado', label: 'CONTACTO INICIADO', color: '#6366f1', bg: 'bg-indigo-50/30', text: 'text-indigo-900' },
        { id: 'Calificado', label: 'ANÁLISIS DE NECESIDAD', color: '#f59e0b', bg: 'bg-amber-50/30', text: 'text-amber-950' },
        { id: 'Ganado', label: 'OFERTA ACEPTADA', color: '#10b981', bg: 'bg-emerald-50/30', text: 'text-emerald-950' },
    ];

    // --- LÓGICA DE ARRASTRE FUNCIONAL ---
    const onDragOver = (e: React.DragEvent) => e.preventDefault();

    const onDrop = (e: React.DragEvent, newStatus: ProspectStatus) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("prospectId");
        const item = (prospects || []).find(p => p.id === id);
        if (item && item.status !== newStatus) {
            updateProspect({ ...item, status: newStatus, lastContacted: new Date() });
        }
    };

    if (isLoading) return <div className="p-20 text-center font-900 text-slate-300 animate-pulse text-xl uppercase italic">PROCESANDO WORKFLOW...</div>;

    const pipelineTotal = (prospects || []).reduce((a, b) => a + (b.pipelineValue || 0), 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            
            {/* 1. TOOLBAR */}
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex gap-2">
                    <button className="flex items-center gap-3 px-8 py-3 bg-blue-600 text-white rounded-none font-900 text-xs shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all uppercase tracking-widest active:scale-95">
                        <IconPlus /> Nuevo Prospecto
                    </button>
                    <button 
                        onClick={() => setShowAnalysis(!showAnalysis)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-none font-900 text-[10px] transition-all uppercase border ${showAnalysis ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 shadow-sm'}`}
                    >
                        {showAnalysis ? 'Ocultar Análisis' : 'Ver Análisis'}
                    </button>
                </div>

                <div className="flex items-center bg-white p-1 rounded-none border border-slate-200 shadow-sm no-print">
                    <button className="flex items-center gap-2 px-5 py-2 text-[11px] font-900 text-emerald-700 border-r border-slate-100 uppercase italic leading-none"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> EXCEL</button>
                    <button className="flex items-center gap-2 px-5 py-2 text-[11px] font-900 text-rose-800 border-r border-slate-100 uppercase italic leading-none"><div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div> PDF</button>
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2 text-[11px] font-900 text-slate-500 uppercase leading-none"> <IconSearch /> IMPRIMIR</button>
                </div>
            </div>

            {/* 2. KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { l: 'Pipeline Total', v: formatCLP(pipelineTotal), c: 'text-blue-600', t: '↑ 16.2%' },
                    { l: 'Cierres Mes', v: '14.2M', c: 'text-emerald-600', t: '↑ 3.9%' },
                    { l: 'Win Rate', v: '32.8%', c: 'text-indigo-600', t: '↑ 7.0%' },
                    { l: 'Leads Hoy', v: '12', c: 'text-slate-800', t: '↑ 12%' }
                ].map((k, idx) => (
                    <div key={idx} className="bg-white p-6 border border-slate-200 rounded-none shadow-sm flex justify-between items-start group hover:border-blue-500 transition-all">
                        <div><p className="text-[10px] font-800 text-slate-400 uppercase tracking-widest mb-1 leading-none">{k.l}</p><h3 className={`text-2xl font-900 ${k.c} tracking-tighter leading-none mt-2 italic`}>{k.v}</h3><p className="mt-4 text-emerald-500 font-900 text-[10px] uppercase tracking-tighter italic">{k.t} <span className="text-slate-300 font-normal">VS ANT.</span></p></div>
                        <div className="w-10 h-10 bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner"><IconZap /></div>
                    </div>
                ))}
            </div>

            {/* 3. DASHBOARD ANALÍTICO */}
            {showAnalysis && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-in slide-in-from-top duration-500">
                    <div className="lg:col-span-8 bg-white p-8 border border-slate-200 rounded-none shadow-sm flex flex-col">
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex gap-12">
                                <div><p className="text-[10px] font-900 text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none font-black tracking-tighter">Proyectado</p><p className="text-xl font-900 text-slate-800 tracking-tighter italic leading-none">84.5M</p></div>
                                <div><p className="text-[10px] font-900 text-blue-600 uppercase tracking-[0.2em] mb-1 leading-none font-black tracking-tighter">Cerrado Real</p><p className="text-xl font-900 text-blue-700 tracking-tighter italic leading-none">52.8M</p></div>
                            </div>
                            <div className="flex bg-slate-100 p-1 rounded-none border border-slate-200 shadow-inner">
                                {['ALL', '1M', '6M', '1Y'].map(p => (
                                    <button key={p} onClick={() => setActivePeriod(p)} className={`px-4 py-1.5 text-[9px] font-900 rounded-none transition-all ${activePeriod === p ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>{p}</button>
                                ))}
                            </div>
                        </div>
                        <div className="h-56 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient>
                                        <linearGradient id="colorProy" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} tickFormatter={(v) => `${v}M`} />
                                    <Tooltip contentStyle={{borderRadius: '0px', border: '1px solid #e2e8f0', fontWeight: 800, fontSize: '11px'}} />
                                    <Area type="monotone" dataKey="Real" stroke="#2563eb" strokeWidth={3} fill="url(#colorReal)" />
                                    <Area type="monotone" dataKey="Proy" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" fill="url(#colorProy)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col gap-4">
                        <div className="bg-white p-8 border border-slate-200 rounded-none shadow-sm flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-slate-900 flex items-center justify-center text-white rounded-none shadow-lg shadow-slate-900/20"><IconZap /></div>
                                    <div><h4 className="text-[11px] font-900 text-slate-800 uppercase tracking-[0.2em] leading-none font-black italic">Oportunidad Top</h4><p className="text-[10px] font-700 text-slate-400 italic mt-1.5 leading-none tracking-tight uppercase">Ramo: Automotriz Flotas</p></div>
                                </div>
                                <div className="flex items-center justify-between gap-6">
                                    <div className="shrink-0">
                                        <h3 className="text-4xl font-900 text-slate-900 tracking-tighter italic leading-none">425.68 UF</h3>
                                        <p className="text-emerald-500 font-900 text-[10px] mt-2 uppercase tracking-tighter italic">+14.2% TENDENCIA</p>
                                    </div>
                                    <div className="flex-1 space-y-2.5 border-l border-slate-100 pl-6">
                                        <p className="text-[9px] font-900 text-slate-400 uppercase tracking-[0.1em] mb-2 font-black italic">Elite Pipeline</p>
                                        {topProspects.map((p, i) => (
                                            <div key={p.id} className="flex items-center justify-between gap-3 overflow-hidden">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <span className={`text-[9px] font-900 ${i === 0 ? 'text-blue-600' : 'text-slate-300'}`}>#0{i+1}</span>
                                                    <p className="text-[10px] font-800 text-slate-700 truncate uppercase tracking-tighter leading-none">{p.name}</p>
                                                </div>
                                                <span className="text-[10px] font-900 text-slate-900 italic ml-2 shrink-0">{formatCLP(p.pipelineValue/1000000)}M</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0f172a] p-8 rounded-none flex flex-col justify-center relative overflow-hidden shadow-2xl border border-blue-500/20 h-40">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-600 rounded-none text-white shadow-lg shadow-blue-500/40"><IconZap /></div>
                                    <span className="text-[10px] font-900 text-blue-400 uppercase tracking-[0.25em] font-black italic">IA Strategy Insight</span>
                                </div>
                                <p className="text-[13px] font-600 italic text-slate-100 leading-relaxed border-l-2 border-blue-500 pl-4 uppercase tracking-tighter">
                                    "Acelere la transición de estos 3 leads a 'Calificados' para asegurar el trimestre."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 04. KANBAN BOARD FUNCIONAL */}
            <div className="flex gap-4 overflow-x-auto pb-8 custom-scrollbar min-h-[70vh]">
                {stages.map(stage => {
                    const items = (prospects || []).filter(p => p.status === stage.id && 
                        (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.contact.toLowerCase().includes(searchTerm.toLowerCase())));
                    const stageValue = items.reduce((acc, curr) => acc + curr.pipelineValue, 0);

                    return (
                        <div key={stage.id} className="flex-shrink-0 w-80 flex flex-col gap-4">
                            {/* DROP ZONE CONTAINER */}
                            <div 
                                onDragOver={onDragOver}
                                onDrop={(e) => onDrop(e, stage.id)}
                                className="flex-1 flex flex-col gap-4"
                            >
                                <div className="bg-white border border-slate-200 border-t-[5px] p-4 flex flex-col shadow-sm rounded-none" style={{ borderTopColor: stage.color }}>
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="text-[11px] font-900 uppercase tracking-widest text-slate-500 leading-none font-black italic">{stage.label}</h3>
                                        <span className="text-slate-900 font-900 text-[11px] bg-slate-50 px-2 py-0.5 border border-slate-200 shadow-inner font-black"># {items.length}</span>
                                    </div>
                                    <p className="text-slate-800 font-900 text-lg tracking-tighter leading-none mt-2 italic">{formatCLP(stageValue)}</p>
                                </div>

                                <div className="space-y-4">
                                    {items.map(p => (
                                        <ProspectCard 
                                            key={p.id} 
                                            prospect={p} 
                                            color={stage.color} 
                                            isExpanded={expandedCardId === p.id}
                                            onToggle={() => setExpandedCardId(expandedCardId === p.id ? null : p.id)}
                                        />
                                    ))}
                                    {items.length === 0 && (
                                        <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-none text-[10px] font-bold text-slate-300 uppercase tracking-widest italic font-black">Área de Arrastre</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            
            
        </div>
    );
};

export default SalesWorkflow;