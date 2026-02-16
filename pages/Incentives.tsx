import React, { useMemo, useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { useSortableData } from '../hooks/useSortableData';

// --- ICONOS INTERNOS ESTÁNDAR ---
const IconTrophy = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"></path></svg>;
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconPlus = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconX = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconCalendar = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;

const SortableHeader = ({ label, columnKey, sortConfig, requestSort }: any) => (
    <th className="px-6 py-2 border-r border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors select-none text-[10px] uppercase font-900 tracking-wider text-white" onClick={() => requestSort(columnKey)}>
        <div className="flex justify-between items-center whitespace-nowrap">{label} <span className={sortConfig?.key === columnKey ? 'text-blue-400' : 'opacity-20'}>↕</span></div>
    </th>
);

const Incentives: React.FC = () => {
    const { incentives, isLoading } = useAppData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const fmt = (v: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v);

    // 1. Filtrado
    const filteredIncentives = useMemo(() => {
        if (!incentives) return [];
        return incentives.filter(i => `${i.title} ${i.lineOfBusiness || ''}`.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [incentives, searchTerm]);

    // 2. Snapshot
    const snapshot = useMemo(() => {
        return { active: filteredIncentives.length, compliance: 68.4, totalPrizes: 4500000 };
    }, [filteredIncentives]);

    // 3. Ordenamiento
    const { items: sortedItems, requestSort, sortConfig } = useSortableData(filteredIncentives, { key: 'title', direction: 'ascending' });
    const displayedItems = sortedItems.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    if (isLoading) return <div className="p-20 text-center font-900 text-slate-400 animate-pulse text-xl uppercase tracking-widest italic">Sincronizando Incentivos...</div>;

    return (
        <div className="space-y-4 animate-in fade-in duration-500 pb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            
            {/* ACTION BAR */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-2">
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-3 px-8 py-3 bg-blue-600 text-white rounded-xl font-800 text-xs shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all uppercase tracking-widest active:scale-95"
                >
                    <IconPlus /> Crear Campaña
                </button>

                <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm no-print">
                    <button className="px-5 py-2 text-[11px] font-900 text-emerald-700 hover:bg-emerald-50 rounded-lg border-r border-slate-100 uppercase italic"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> EXCEL</button>
                    <button className="px-5 py-2 text-[11px] font-900 text-rose-800 hover:bg-rose-50 rounded-lg border-r border-slate-100 uppercase italic"><div className="w-2 h-2 bg-rose-500 rounded-full"></div> PDF</button>
                    <button onClick={() => window.print()} className="px-5 py-2 text-[11px] font-900 text-slate-500 hover:bg-slate-50 rounded-lg uppercase tracking-tighter"><IconSearch /> IMPRIMIR</button>
                </div>
            </div>

            {/* SNAPSHOTS */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white px-5 py-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <p className="text-[10px] font-800 text-slate-400 uppercase tracking-widest mb-1 leading-none text-blue-600 italic">Campañas Activas</p>
                    <p className="text-xl font-900 text-slate-800 leading-none">{snapshot.active}</p>
                </div>
                <div className="bg-white px-5 py-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <p className="text-[10px] font-800 text-slate-400 uppercase tracking-widest mb-1 leading-none italic">Presupuesto en Premios</p>
                    <p className="text-xl font-900 text-slate-800 leading-none">{fmt(snapshot.totalPrizes)}</p>
                </div>
                <div className="bg-white px-5 py-4 rounded-xl border-l-4 border-l-emerald-500 border border-slate-200 shadow-sm flex flex-col justify-center bg-emerald-50/20">
                    <p className="text-[10px] font-800 text-emerald-600 uppercase tracking-widest mb-1 leading-none italic">Cumplimiento Metas</p>
                    <p className="text-xl font-900 text-emerald-700 leading-none">{snapshot.compliance}%</p>
                </div>
            </div>

            {/* FILTROS */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"><IconSearch /></span>
                    <input type="text" placeholder="Buscar por campaña, meta o incentivo..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-xl text-[14px] font-600 focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all placeholder:text-slate-400" />
                </div>
            </div>

            {/* TABLA CON VIGENCIA */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center text-[10px] font-800 text-slate-500 uppercase tracking-widest">
                    <div>MOSTRANDO <span className="text-blue-600 font-900">{displayedItems.length}</span> DE <span className="text-slate-800 font-900">{filteredIncentives.length}</span> REGISTROS</div>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead className="bg-[#0f172a] text-white">
                            <tr>
                                <SortableHeader label="Campaña / Meta" columnKey="title" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader label="Ramo" columnKey="lineOfBusiness" sortConfig={sortConfig} requestSort={requestSort} />
                                <th className="px-6 py-2 text-[10px] uppercase font-900 tracking-wider text-white">Vigencia (Desde / Hasta)</th>
                                <th className="px-6 py-2 text-[10px] uppercase font-900 tracking-wider text-white">Progreso Real</th>
                                <SortableHeader label="Incentivo" columnKey="reward" sortConfig={sortConfig} requestSort={requestSort} />
                                <th className="px-6 py-2 text-right text-[10px] uppercase font-900">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="text-[13px] font-600 text-slate-700">
                            {displayedItems.map((inc, idx) => {
                                const percent = Math.min(100, (inc.current / inc.target) * 100);
                                return (
                                    <tr key={idx} className="hover:bg-blue-100/80 even:bg-slate-50/80 transition-all border-b border-slate-200 group">
                                        <td className="px-6 py-1.5"><div className="font-800 text-slate-900 leading-none">{inc.title}</div><div className="text-[10px] text-slate-400 font-900 uppercase mt-0.5 tracking-tighter">Meta: {inc.metric === 'Prima' ? fmt(inc.target) : `${inc.target} Pólizas`}</div></td>
                                        <td className="px-6 py-1.5 font-800 text-slate-500 uppercase italic text-[11px] leading-none">{inc.lineOfBusiness || 'GLOBAL'}</td>
                                        <td className="px-6 py-1.5 leading-none">
                                            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold">
                                                <IconCalendar /> 01/01/26 - 31/03/26
                                            </div>
                                        </td>
                                        <td className="px-6 py-1.5 min-w-[180px] leading-none">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden shadow-inner"><div className={`h-full transition-all duration-1000 ${percent >= 100 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]'}`} style={{ width: `${percent}%` }}></div></div>
                                                <span className={`text-[11px] font-900 w-10 ${percent >= 100 ? 'text-emerald-600' : 'text-blue-600'}`}>{percent.toFixed(0)}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-1.5 text-blue-700 font-900 italic tracking-tight leading-none">{inc.reward}</td>
                                        <td className="px-6 py-1.5 text-right leading-none"><button className="p-1.5 text-slate-300 hover:text-blue-700 transition-all font-900 text-base">•••</button></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL: NUEVA CAMPAÑA (RESTAURADO CON DESDE/HASTA) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/20 text-left">
                        <div className="bg-[#0f172a] p-10 text-white relative">
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400"><IconX /></button>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-600 rounded-xl shadow-lg text-white shadow-blue-600/30"><IconTrophy /></div>
                                <div>
                                    <h3 className="text-3xl font-900 uppercase tracking-tighter italic leading-none">Nueva Campaña</h3>
                                    <p className="text-blue-400 text-xs font-800 uppercase tracking-[0.2em] mt-1">Definición de Metas Temporales</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-900 text-slate-400 uppercase tracking-widest ml-1">Nombre de la Campaña</label>
                                <input type="text" placeholder="Ej: Bono Trimestral Salud" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-700 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner uppercase" />
                            </div>

                            {/* FILA DE VIGENCIA (NUEVA) */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-900 text-slate-400 uppercase tracking-widest ml-1">Fecha Inicio (Desde)</label>
                                    <input type="date" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-700 outline-none focus:border-blue-500 shadow-inner" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-900 text-slate-400 uppercase tracking-widest ml-1">Fecha Término (Hasta)</label>
                                    <input type="date" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-700 outline-none focus:border-blue-500 shadow-inner" />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-900 text-slate-400 uppercase tracking-widest ml-1">Métrica</label>
                                    <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-700 outline-none focus:border-blue-500 shadow-inner">
                                        <option>Volumen de Prima</option>
                                        <option>Número de Pólizas</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-900 text-slate-400 uppercase tracking-widest ml-1">Meta Cuantitativa</label>
                                    <input type="number" placeholder="0" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-700 outline-none focus:border-blue-500 shadow-inner" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-900 text-blue-600 uppercase tracking-widest ml-1">Incentivo / Recompensa</label>
                                <input type="text" placeholder="Ej: Bono $750.000 + Almuerzo de Equipo" className="w-full bg-blue-50 border-2 border-blue-100 rounded-xl px-5 py-4 text-sm font-900 text-blue-700 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner" />
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-xl font-800 text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all">Cancelar</button>
                                <button className="flex-1 py-5 bg-blue-600 text-white rounded-xl font-800 text-[11px] uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-600/30 transition-all active:scale-95">Lanzar Incentivo</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Incentives;