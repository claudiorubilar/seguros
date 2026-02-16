import React, { useMemo, useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { useSortableData } from '../hooks/useSortableData';

// --- ICONOS INTERNOS ESTÁNDAR ---
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconSort = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="7 15 12 20 17 15"></polyline><polyline points="7 9 12 4 17 9"></polyline></svg>;
const IconPlus = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconX = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconChevron = ({dir}: {dir:'left'|'right'}) => <svg className={dir==='left'?'rotate-90':'-rotate-90'} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;

const SortableHeader = ({ label, columnKey, sortConfig, requestSort }: any) => (
    <th className="px-6 py-2 border-r border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors select-none text-[10px] uppercase font-900 tracking-wider text-white" onClick={() => requestSort(columnKey)}>
        <div className="flex justify-between items-center whitespace-nowrap">{label} <span className={sortConfig?.key === columnKey ? 'text-blue-400' : 'opacity-20'}><IconSort /></span></div>
    </th>
);

const Quotes: React.FC = () => {
    const { quotes, clients, isLoading, updateQuote } = useAppData();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const UF_VALUE = 39640;
    const fmt = (v: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v);

    // 1. Procesamiento Blindado
    const processedQuotes = useMemo(() => {
        const data = quotes || [];
        return data.map(q => {
            const pStr = String(q.premium || "0");
            const isUF = pStr.toLowerCase().includes('uf');
            const rawVal = parseFloat(pStr.replace(/[^\d.]/g, '')) || 0;
            return { 
                ...q, 
                premiumCLP: isUF ? rawVal * UF_VALUE : rawVal, 
                isUF, 
                rawVal, 
                formattedDate: q.creationDate ? new Date(q.creationDate).toLocaleDateString('es-CL') : 'N/A' 
            };
        });
    }, [quotes]);

    // 2. Filtrado Full-Scan
    const filteredQuotes = useMemo(() => {
        return processedQuotes.filter(q => 
            [q.quoteNumber || '', q.clientId || '', q.product || ''].join(' ').toLowerCase().includes(searchTerm.toLowerCase()) 
            && (statusFilter === 'all' || q.status === statusFilter)
        );
    }, [processedQuotes, searchTerm, statusFilter]);

    // 3. Snapshot con Semáforo de Color (Lógica de Gerencia)
    const snapshot = useMemo(() => {
        const total = filteredQuotes.reduce((acc, curr) => acc + curr.premiumCLP, 0);
        const accepted = filteredQuotes.filter(q => q.status === 'Aceptada').length;
        const totalCount = filteredQuotes.length || 1;
        const convRate = (accepted / totalCount) * 100;
        
        let statusColor = 'bg-blue-600';
        let textColor = 'text-blue-600';
        if (convRate < 30) { statusColor = 'bg-rose-500'; textColor = 'text-rose-600'; }
        else if (convRate > 70) { statusColor = 'bg-emerald-500'; textColor = 'text-emerald-600'; }

        return { total, count: filteredQuotes.length, accepted, convRate, statusColor, textColor };
    }, [filteredQuotes]);

    // 4. Ordenamiento y Paginación
    const { items: sortedItems, requestSort, sortConfig } = useSortableData(filteredQuotes, { key: 'quoteNumber', direction: 'ascending' });
    const totalPages = Math.ceil(sortedItems.length / rowsPerPage);
    const displayedItems = sortedItems.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    if (isLoading) return <div className="p-20 text-center font-900 text-slate-400 animate-pulse text-xl">SINCRO DE VENTAS...</div>;

    return (
        <div className="space-y-4 animate-in fade-in duration-500 pb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            
            {/* ACTION BAR PREMIUM */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-1">
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-3 px-8 py-3 bg-blue-600 text-white rounded-xl font-800 text-xs shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all uppercase tracking-widest active:scale-95">
                    <IconPlus /> Nueva Cotización
                </button>

                <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm no-print">
                    <button className="flex items-center gap-2 px-5 py-2 text-[11px] font-900 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all border-r border-slate-100 uppercase italic"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> EXCEL</button>
                    <button className="flex items-center gap-2 px-5 py-2 text-[11px] font-900 text-rose-800 hover:bg-rose-50 rounded-lg transition-all border-r border-slate-100 uppercase italic"><div className="w-2 h-2 bg-rose-500 rounded-full"></div> PDF</button>
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2 text-[11px] font-900 text-slate-500 hover:bg-slate-50 rounded-lg transition-all uppercase"><IconSearch /> IMPRIMIR</button>
                </div>
            </div>

            {/* SNAPSHOT CON SEMÁFORO DE CONVERSIÓN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white px-5 py-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <p className="text-[10px] font-900 text-slate-400 uppercase tracking-widest mb-1 leading-none">Monto Pipeline</p>
                    <p className="text-xl font-900 text-slate-800 leading-none tracking-tighter italic">{fmt(snapshot.total)}</p>
                </div>
                <div className="bg-white px-5 py-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center text-center">
                    <p className="text-[10px] font-900 text-slate-400 uppercase tracking-widest mb-1 leading-none italic text-center">Ticket Promedio</p>
                    <p className="text-base font-900 text-slate-800 leading-none">{fmt(snapshot.total / (snapshot.count || 1))}</p>
                </div>
                <div className="bg-white px-5 py-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-2">
                        <p className={`text-[10px] font-900 uppercase tracking-widest leading-none ${snapshot.textColor}`}>Tasa de Cierre</p>
                        <span className={`text-[11px] font-900 ${snapshot.textColor}`}>{snapshot.convRate.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${snapshot.statusColor}`} style={{ width: `${snapshot.convRate}%` }}></div>
                    </div>
                </div>
                <div className="bg-white px-5 py-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center text-right">
                    <p className="text-[10px] font-900 text-slate-400 uppercase tracking-widest mb-1 leading-none italic">Total Gestiones</p>
                    <p className="text-xl font-900 text-slate-800 leading-none">{snapshot.count}</p>
                </div>
            </div>

            {/* BUSCADOR */}
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center gap-2">
                <div className="relative flex-1 group w-full">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"><IconSearch /></span>
                    <input type="text" placeholder="Buscador inteligente..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-transparent rounded-lg text-sm font-600 focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all placeholder:text-slate-400" />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full lg:w-auto bg-white border border-slate-200 text-slate-700 text-[10px] font-900 rounded-lg px-4 py-2 outline-none focus:border-blue-400 uppercase tracking-tighter shadow-sm"><option value="all">FILTRAR ESTADOS</option><option value="Borrador">BORRADOR</option><option value="Enviada">ENVIADAS</option><option value="Aceptada">ACEPTADAS</option><option value="Rechazada">RECHAZADAS</option></select>
            </div>

            {/* TABLA COMPACT STANDARD */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center text-[10px] font-800 text-slate-500 uppercase tracking-widest">
                    <div>
                        MOSTRANDO <span className="text-blue-600 font-900 text-sm">{displayedItems.length}</span> DE <span className="text-slate-800 font-900 text-sm">{filteredQuotes.length}</span> REGISTROS 
                        <span className="mx-2 text-slate-300">|</span> VER: 
                        <select value={rowsPerPage} onChange={(e) => {setRowsPerPage(Number(e.target.value)); setCurrentPage(1);}} className="bg-transparent border-none text-blue-600 font-900 outline-none cursor-pointer">
                            <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[850px]">
                        <thead className="bg-[#0f172a] text-white">
                            <tr>
                                <SortableHeader label="Cotización" columnKey="quoteNumber" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader label="Cliente" columnKey="clientId" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader label="Producto" columnKey="product" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader label="Prima Est." columnKey="premiumCLP" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader label="Estado" columnKey="status" sortConfig={sortConfig} requestSort={requestSort} />
                                <th className="px-6 py-2 text-right text-[10px] uppercase font-900 tracking-widest">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="text-[14px] font-600 text-slate-700">
                            {displayedItems.map((q, idx) => (
                                <tr key={idx} className="hover:bg-blue-100/80 even:bg-slate-50/80 transition-all border-b border-slate-200 group">
                                    <td className="px-6 py-1.5 leading-none"><div className="font-900 text-slate-900 leading-none">{q.quoteNumber}</div><div className="text-[10px] text-slate-400 font-900 uppercase mt-1 italic tracking-tighter">{q.formattedDate}</div></td>
                                    <td className="px-6 py-1.5 font-800 text-slate-800 uppercase leading-none truncate max-w-[220px]">{q.clientId}</td>
                                    <td className="px-6 py-1.5 italic text-slate-500 text-[11px] font-900 leading-none uppercase">{q.product}</td>
                                    <td className="px-6 py-1.5 leading-none"><div className="font-900 text-slate-900 leading-none italic">{fmt(q.premiumCLP)}</div></td>
                                    <td className="px-6 py-1.5 leading-none">
                                        <select value={q.status} onChange={(e) => updateQuote({...q, status: e.target.value as any})} className={`status-pill outline-none cursor-pointer font-900 text-[10px] status-${q.status?.toLowerCase().replace(' ', '')}`}>
                                            <option value="Borrador">BORRADOR</option><option value="Enviada">ENVIADA</option><option value="Aceptada">ACEPTADA</option><option value="Rechazada">RECHAZADA</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-1.5 text-right leading-none"><button className="text-slate-300 hover:text-blue-700 transition-all font-900 text-base px-2">•••</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                    <p className="text-[10px] text-slate-500 font-900 uppercase tracking-widest italic leading-none">Página {currentPage} de {totalPages || 1}</p>
                    <div className="flex gap-1.5">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 border border-slate-200 rounded-lg bg-white text-[10px] font-900 shadow-sm hover:bg-slate-100 disabled:opacity-30 transition-all">ANT.</button>
                        <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 border border-slate-200 rounded-lg bg-white text-[10px] font-900 shadow-sm hover:bg-slate-100 disabled:opacity-30 transition-all">SIG.</button>
                    </div>
                </div>
            </div>

            {/* MODAL NUEVA COTIZACIÓN: DISEÑO PREMIUM */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/20 text-left">
                        <div className="bg-[#0f172a] p-10 text-white relative">
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400"><IconX /></button>
                            <h3 className="text-2xl font-900 uppercase tracking-tighter italic leading-none">Nueva Propuesta</h3>
                            <p className="text-blue-400 text-[10px] font-800 uppercase tracking-[0.2em] mt-2">Configuración Comercial</p>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-1.5"><label className="text-[10px] font-900 text-slate-400 uppercase tracking-widest ml-1">Cliente / Contratante</label>
                                <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-700 outline-none focus:border-blue-500 shadow-inner uppercase italic">
                                    <option value="">Seleccionar Cliente...</option>
                                    {(clients || []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5"><label className="text-[10px] font-900 text-blue-600 uppercase tracking-widest ml-1 italic">Monto Prima Est.</label>
                                    <input type="number" placeholder="0" className="w-full bg-blue-50 border-2 border-blue-100 rounded-xl px-5 py-4 text-lg font-900 text-blue-700 outline-none focus:border-blue-600 shadow-inner" />
                                </div>
                                <div className="space-y-1.5"><label className="text-[10px] font-900 text-slate-400 uppercase tracking-widest ml-1">Moneda</label>
                                    <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-700 outline-none focus:border-blue-500 shadow-inner">
                                        <option value="CLP">CLP ($)</option><option value="UF">UF</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-6">
                                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-xl font-800 text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all">Descartar</button>
                                <button className="flex-1 py-5 bg-blue-600 text-white rounded-xl font-800 text-[11px] uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-600/30 transition-all active:scale-95">Lanzar Propuesta</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quotes;