import React, { useMemo, useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { useSortableData } from '../hooks/useSortableData';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area 
} from 'recharts';

// --- ICONOS INTERNOS ESTÁNDAR (Blindados) ---
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconSort = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="7 15 12 20 17 15"></polyline><polyline points="7 9 12 4 17 9"></polyline></svg>;
const IconZap = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;

const RAMO_COLORS = { VIDA: '#3b82f6', SALUD: '#f43f5e', VEHICULOS: '#f59e0b', INCENDIO: '#10b981' };
const AGENT_ID = 'a2'; // ID del agente para el filtro
const UF_VALUE = 39640;

const formatCLP = (v: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v);

const AgentPortal: React.FC = () => {
    const { policies, commissions, claims, tasks, clients, incentives, isLoading } = useAppData();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [rowsPerPage] = useState(10);

    // --- 1. PROCESAMIENTO DE DATOS CON QA ---
    const clientMap = useMemo(() => new Map(clients.map(c => [c.id, c.name])), [clients]);

    const agentData = useMemo(() => {
        const myPolicies = policies.filter(p => p.agentId === AGENT_ID);
        const myCommissions = commissions.filter(c => c.agentId === AGENT_ID);
        const myTasks = tasks.filter(t => t.assignedToId === AGENT_ID);
        
        const policyNums = new Set(myPolicies.map(p => p.policyNumber));
        const myClaims = claims.filter(c => policyNums.has(c.policyNumber));

        const now = new Date();
        const myRenewals = myPolicies.filter(p => {
            const days = (new Date(p.endDate).getTime() - now.getTime()) / 86400000;
            return days > 0 && days <= 90;
        });

        const totalVentas = myPolicies.reduce((acc, p) => acc + (p.currency === 'UF' ? p.totalPremium * UF_VALUE : p.totalPremium), 0);
        const totalCom = myCommissions.reduce((acc, c) => acc + (c.currency === 'UF' ? c.amount * UF_VALUE : c.amount), 0);

        const chart12m = [
            { name: 'Feb', VIDA: 4000, SALUD: 8000, VEHICULOS: 12000 }, { name: 'Mar', VIDA: 6000, SALUD: 9000, VEHICULOS: 11000 },
            { name: 'Abr', VIDA: 15000, SALUD: 30000, VEHICULOS: 80000 }, { name: 'May', VIDA: 7000, SALUD: 12000, VEHICULOS: 14000 },
            { name: 'Jun', VIDA: 8000, SALUD: 10000, VEHICULOS: 11000 }, { name: 'Jul', VIDA: 45000, SALUD: 60000, VEHICULOS: 95000 },
            { name: 'Ago', VIDA: 9000, SALUD: 11000, VEHICULOS: 13000 }, { name: 'Sep', VIDA: 11000, SALUD: 13000, VEHICULOS: 15000 },
            { name: 'Oct', VIDA: 10000, SALUD: 9000, VEHICULOS: 11000 }, { name: 'Nov', VIDA: 12000, SALUD: 14000, VEHICULOS: 13000 },
            { name: 'Dic', VIDA: 8000, SALUD: 11000, VEHICULOS: 9000 }, { name: 'Ene', VIDA: 52000, SALUD: 45000, VEHICULOS: 70000 }
        ];

        return { myPolicies, myCommissions, myClaims, myRenewals, myTasks, totalVentas, totalCom, chart12m };
    }, [policies, commissions, claims, tasks]);

    // --- 2. COMPONENTE DE TABLA ESTÁNDAR (REVISADO) ---
    const RenderTable = ({ data, cols }: { data: any[], cols: {k:string, l:string, f?:any}[] }) => {
        const filtered = data.filter(item => Object.values(item).some(v => String(v).toLowerCase().includes(searchTerm.toLowerCase())));
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
                <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <div className="text-[10px] font-900 text-slate-500 uppercase tracking-widest">
                        MOSTRANDO <span className="text-blue-600 font-900">{filtered.length}</span> REGISTROS
                    </div>
                    <div className="relative group w-64">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500"><IconSearch /></span>
                        <input type="text" placeholder="Buscador..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#0f172a] text-white">
                            <tr>
                                {cols.map(c => <th key={c.k} className="px-6 py-2 text-[10px] uppercase font-900 border-r border-slate-700">{c.l}</th>)}
                                <th className="px-6 py-2 text-right text-[10px] font-900 uppercase">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="text-[13px] font-600 text-slate-700">
                            {filtered.slice(0, rowsPerPage).map((row, i) => (
                                <tr key={i} className="hover:bg-blue-50/60 even:bg-slate-50/80 transition-all border-b border-slate-100">
                                    {cols.map(c => <td key={c.k} className="px-6 py-1.5">{c.f ? c.f(row[c.k], row) : row[c.k]}</td>)}
                                    <td className="px-6 py-1.5 text-right"><button className="text-slate-300 hover:text-blue-600 font-black text-base">•••</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    if (isLoading) return <div className="p-20 text-center font-900 text-slate-300 animate-pulse text-2xl">Sincronizando Portal...</div>;

    return (
        <div className="space-y-4 animate-in fade-in duration-500 pb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            
            {/* HEADER CON EXPORTAR PREMIUM */}
            <div className="flex flex-wrap justify-between items-end gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-900 text-slate-800 tracking-tighter italic">Hola, Carlos Díaz!</h1>
                    <p className="text-blue-600 font-800 text-[10px] uppercase tracking-[0.2em] mt-1">Status: Agente Senior Elite #2</p>
                </div>
                <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm no-print">
                    <button className="flex items-center gap-2 px-5 py-2 text-[11px] font-900 text-emerald-700 border-r border-slate-100 uppercase italic"> <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> EXCEL</button>
                    <button className="flex items-center gap-2 px-5 py-2 text-[11px] font-900 text-rose-800 border-r border-slate-100 uppercase italic"> <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div> PDF</button>
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2 text-[11px] font-900 text-slate-500 hover:bg-slate-50 rounded-lg transition-all uppercase tracking-tighter"><IconSearch /> IMPRIMIR</button>
                </div>
            </div>

            {/* TABS NAVEGACIÓN */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-1 overflow-x-auto no-print">
                <div className="flex min-w-max">
                    {[
                        ['dashboard', 'Dashboard'], ['policies', 'Mis Pólizas'], ['renewals', 'Renovaciones'], 
                        ['commissions', 'Mis Comisiones'], ['claims', 'Siniestros'], ['tasks', 'Historial de Tareas'], ['incentives', 'Incentivos']
                    ].map(([id, label]) => (
                        <button key={id} onClick={() => {setActiveTab(id); setSearchTerm('');}} className={`px-6 py-2.5 text-[11px] font-900 uppercase tracking-widest transition-all border-b-4 ${activeTab === id ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-400'}`}>
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- VISTA: DASHBOARD --- */}
            {activeTab === 'dashboard' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center group">
                            <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ventas Totales (Prima)</p><h3 className="text-2xl font-900 text-slate-800 tracking-tighter">{formatCLP(agentData.totalVentas)}</h3><p className="text-emerald-500 text-[10px] font-black mt-2">↑ 12.5% VS MES ANT.</p></div>
                            <div className="h-12 w-20 opacity-30 group-hover:opacity-100"><ResponsiveContainer><AreaChart data={[{v:30},{v:50},{v:40},{v:85},{v:70},{v:95}]}><Area type="monotone" dataKey="v" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2}/></AreaChart></ResponsiveContainer></div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-indigo-600">
                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Comisión Generada</p><h3 className="text-2xl font-900 text-slate-800 tracking-tighter">{formatCLP(agentData.totalCom)}</h3><p className="text-slate-400 text-[10px] font-bold mt-2 uppercase">Liquidación: 25 Ene</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pólizas Vigentes</p><h3 className="text-2xl font-900 text-slate-800 tracking-tighter">{agentData.myPolicies.length} Activas</h3><p className="text-emerald-500 text-[10px] font-black mt-2 uppercase flex items-center gap-1"><IconZap /> 98% RETENCIÓN</p>
                        </div>
                    </div>

                    <div className="bg-blue-600/10 border border-blue-200 p-4 rounded-xl flex items-center gap-4 shadow-sm">
                        <div className="bg-blue-600 p-2 rounded-xl text-white animate-pulse"><IconZap /></div>
                        <p className="text-sm font-bold text-blue-900 italic"><span className="font-black uppercase mr-3 text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded">AI Coach</span>Carlos, el ramo de <span className="text-rose-600 font-black">Salud</span> requiere atención inmediata. Enfócate en las 4 renovaciones críticas.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-md">
                            <h4 className="text-xs font-900 text-slate-500 uppercase tracking-widest mb-8">Producción Mensual por Ramo (CLP)</h4>
                            <div className="h-[320px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={agentData.chart12m}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800}} />
                                        <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                                        <Tooltip cursor={{fill: '#f8fafc'}} />
                                        <Legend iconType="circle" />
                                        <Bar dataKey="VIDA" stackId="a" fill={RAMO_COLORS.VIDA} />
                                        <Bar dataKey="SALUD" stackId="a" fill={RAMO_COLORS.SALUD} />
                                        <Bar dataKey="VEHICULOS" stackId="a" fill={RAMO_COLORS.VEHICULOS} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md flex flex-col items-center">
                            <h4 className="text-xs font-900 text-slate-500 uppercase tracking-widest mb-8 text-center">Mix de Cartera Actual</h4>
                            <div className="h-[240px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={[{n:'Vida',v:60},{n:'Vehículos',v:25},{n:'Salud',v:15}]} innerRadius={75} outerRadius={105} paddingAngle={8} dataKey="v" stroke="none">
                                            <Cell fill={RAMO_COLORS.VIDA} /><Cell fill={RAMO_COLORS.VEHICULOS} /><Cell fill={RAMO_COLORS.SALUD} />
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- VISTAS DE TABLA POBLADAS --- */}
            {activeTab === 'policies' && (
                <RenderTable data={agentData.myPolicies} title="Pólizas" cols={[
                    {k:'policyNumber', l:'N° Póliza', f:(v)=><span className="text-blue-600 font-900">{v}</span>},
                    {k:'policyHolderId', l:'Cliente', f:(v)=>clientMap.get(v) || v},
                    {k:'product', l:'Producto', f:(v)=><span className="italic text-slate-400 text-[11px] uppercase font-800">{v}</span>},
                    {k:'totalPremium', l:'Prima', f:(v)=>formatCLP(v)},
                    {k:'status', l:'Estado', f:(v)=><span className={`status-pill status-${v.toLowerCase()}`}>{v}</span>}
                ]} />
            )}

            {activeTab === 'renewals' && (
                <RenderTable data={agentData.myRenewals} title="Renovaciones" cols={[
                    {k:'policyNumber', l:'Póliza'},
                    {k:'policyHolderId', l:'Cliente', f:(v)=>clientMap.get(v) || v},
                    {k:'endDate', l:'Término', f:(v)=><span className="text-rose-600 font-900">{new Date(v).toLocaleDateString()}</span>},
                    {k:'totalPremium', l:'Monto', f:(v)=>formatCLP(v)}
                ]} />
            )}

            {activeTab === 'commissions' && (
                <RenderTable data={agentData.myCommissions} title="Comisiones" cols={[
                    {k:'policyNumber', l:'Póliza'},
                    {k:'calculationDate', l:'Fecha', f:(v)=>new Date(v).toLocaleDateString()},
                    {k:'type', l:'Tipo', f:(v)=><span className="italic uppercase text-slate-400 text-[10px] font-black">{v}</span>},
                    {k:'amount', l:'Monto', f:(v)=>formatCLP(v)}
                ]} />
            )}

            {activeTab === 'claims' && (
                <RenderTable data={agentData.myClaims} title="Siniestros" cols={[
                    {k:'claimNumber', l:'Siniestro', f:(v)=><span className="font-900 uppercase text-slate-800">{v}</span>},
                    {k:'policyNumber', l:'Póliza'},
                    {k:'notificationDate', l:'Notificación', f:(v)=>new Date(v).toLocaleDateString()},
                    {k:'status', l:'Estado', f:(v)=><span className={`status-pill status-${v.toLowerCase().replace(' ','')}`}>{v}</span>}
                ]} />
            )}

            {activeTab === 'tasks' && (
                <RenderTable data={agentData.myTasks} title="Tareas" cols={[
                    {k:'title', l:'Título', f:(v)=><span className="font-800 uppercase tracking-tighter">{v}</span>},
                    {k:'dueDate', l:'Vencimiento', f:(v)=>new Date(v).toLocaleDateString()},
                    {k:'status', l:'Estado', f:(v)=><span className={`status-pill status-${v.toLowerCase().replace(' ','')}`}>{v}</span>}
                ]} />
            )}

            {/* --- VISTA: INCENTIVOS --- */}
            {activeTab === 'incentives' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in">
                    {incentives.slice(0,2).map((inc, i) => {
                        const per = Math.min(100, (inc.current / inc.target) * 100);
                        return (
                            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                                <h4 className="text-xl font-900 text-slate-800 tracking-tighter uppercase italic mb-2">{inc.title}</h4>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 leading-none">Incentivo: <span className="text-blue-600 underline">{inc.reward}</span></p>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-[11px] font-900 uppercase"><span>Progreso</span><span className="text-blue-600 font-black">{per.toFixed(0)}%</span></div>
                                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner"><div className="h-full transition-all duration-1000" style={{ width: `${per}%`, backgroundColor: per > 80 ? '#10b981' : '#3b82f6' }}></div></div>
                                    <div className="flex justify-between text-[10px] font-black text-slate-400 italic"><span>Actual: {inc.current}</span><span>Meta: {inc.target}</span></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AgentPortal;