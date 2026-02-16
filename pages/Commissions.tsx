import React, { useState, useMemo } from 'react';
import { useAppData } from '../hooks/useAppData';
import { useSortableData } from '../hooks/useSortableData';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// --- ICONOS INTERNOS ESTÁNDAR ---
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconSort = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="7 15 12 20 17 15"></polyline><polyline points="7 9 12 4 17 9"></polyline></svg>;

const SortableHeader = ({ label, columnKey, sortConfig, requestSort }: any) => (
    <th 
        className="px-6 py-2 border-r border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors select-none text-[10px] uppercase font-900 tracking-wider text-white" 
        onClick={() => requestSort(columnKey)}
    >
        <div className="flex justify-between items-center whitespace-nowrap">
            {label} 
            <span className={sortConfig?.key === columnKey ? 'text-blue-400' : 'opacity-20'}>
                <IconSort />
            </span>
        </div>
    </th>
);

const Commissions: React.FC<{ isPrivacyActive?: boolean }> = ({ isPrivacyActive = false }) => {
    const { commissions, agents, users, isLoading } = useAppData();
    const [searchTerm, setSearchTerm] = useState('');
    const [agentFilter, setAgentFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const UF_VALUE = 39640;

    // --- HELPERS DE PRIVACIDAD ---
    const maskMoney = (val: number) => {
        if (isPrivacyActive) return "$ •••••••";
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);
    };
    const fmt = (v: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v);

    // 1. Enriquecimiento y Filtrado de Datos
    const personMap = useMemo(() => new Map([...agents, ...users].map(p => [p.id, p.name])), [agents, users]);

    const enrichedData = useMemo(() => {
        if (!commissions) return [];
        return commissions.map(c => {
            const amount = Number(c.amount) || 0;
            return {
                ...c,
                agentName: personMap.get(c.agentId) || 'N/A',
                amountCLP: c.currency === 'UF' ? amount * UF_VALUE : amount,
                formattedDate: new Date(c.calculationDate).toLocaleDateString('es-CL')
            };
        });
    }, [commissions, personMap]);

    const uniqueAgents = useMemo(() => Array.from(new Set(enrichedData.map(d => d.agentName))).sort(), [enrichedData]);
    const uniqueTypes = useMemo(() => Array.from(new Set(enrichedData.map(d => d.type))).sort(), [enrichedData]);

    const filteredData = useMemo(() => {
        return enrichedData.filter(c => 
            [c.agentName, c.policyNumber, c.type].join(' ').toLowerCase().includes(searchTerm.toLowerCase()) &&
            (agentFilter === 'all' || c.agentName === agentFilter) &&
            (typeFilter === 'all' || c.type === typeFilter)
        );
    }, [enrichedData, searchTerm, agentFilter, typeFilter]);

    // 2. Lógica de Ordenamiento y Paginación
    const { items: sortedItems, requestSort, sortConfig } = useSortableData(filteredData, { key: 'calculationDate', direction: 'descending' });
    const totalPages = Math.ceil(sortedItems.length / rowsPerPage);
    const displayedItems = sortedItems.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    // 3. Métricas para Calugas de Inteligencia
    const totalComission = useMemo(() => enrichedData.reduce((a, b) => a + b.amountCLP, 0), [enrichedData]);
    const totalOverrides = useMemo(() => enrichedData.filter(d => d.type === 'Override').reduce((a, b) => a + b.amountCLP, 0), [enrichedData]);
    const trendData = [{v:400},{v:600},{v:550},{v:900},{v:800},{v:1100}];

    if (isLoading) return <div className="p-20 text-center font-900 text-slate-400 animate-pulse text-xl uppercase tracking-widest">Calculando Comisiones...</div>;

    return (
        <div className="space-y-4 animate-in fade-in duration-500 pb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            
            <div className="flex justify-end mb-1">
                <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm no-print">
                    <button className="px-5 py-2 text-[11px] font-900 text-emerald-700 hover:bg-emerald-50 rounded-lg border-r border-slate-100 uppercase italic">Excel</button>
                    <button className="px-5 py-2 text-[11px] font-900 text-rose-800 hover:bg-rose-50 rounded-lg border-r border-slate-100 uppercase italic">PDF</button>
                    <button onClick={() => window.print()} className="px-5 py-2 text-[11px] font-900 text-slate-500 uppercase">Imprimir</button>
                </div>
            </div>

            {/* CALUGAS DE INTELIGENCIA ESTRATÉGICA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center group">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Comisión Total</p>
                        <h3 className="text-xl font-900 text-slate-800 leading-none">{maskMoney(totalComission)}</h3>
                        <p className="text-emerald-500 text-[10px] font-bold mt-2">↑ 8.4% <span className="text-slate-300 font-normal italic">VS MES ANT.</span></p>
                    </div>
                    <div className="h-12 w-20 opacity-40 group-hover:opacity-100 transition-opacity">
                        <ResponsiveContainer width="100%" height="100%"><AreaChart data={trendData}><Area type="monotone" dataKey="v" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2}/></AreaChart></ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Overrides</p>
                        <span className="text-[10px] font-900 text-indigo-600 italic">{((totalOverrides / totalComission) * 100).toFixed(0)}% MIX</span>
                    </div>
                    <h3 className="text-xl font-900 text-slate-800 leading-none mb-3">{maskMoney(totalOverrides)}</h3>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="bg-indigo-500 h-full" style={{ width: `${(totalOverrides / totalComission) * 100}%` }}></div></div>
                </div>
                <div className="bg-white p-5 rounded-xl border-l-4 border-l-emerald-500 border border-slate-200 shadow-sm flex flex-col justify-center">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">Performance</p>
                    <div className="flex items-baseline gap-2 mb-2">
                        <h3 className="text-3xl font-900 text-slate-800 leading-none tracking-tighter">94.2%</h3>
                        <p className="text-[10px] font-900 text-emerald-600 uppercase italic">EN META</p>
                    </div>
                    <div className="flex gap-1 h-1.5"><div className="flex-1 bg-emerald-500 rounded-full"></div><div className="flex-1 bg-emerald-500 rounded-full"></div><div className="flex-1 bg-emerald-500 rounded-full"></div><div className="flex-1 bg-slate-100 rounded-full"></div></div>
                </div>
            </div>

            {/* BARRA DE FILTROS */}
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center gap-2">
                <div className="relative flex-1 group w-full">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"><IconSearch /></span>
                    <input type="text" placeholder="Buscar por agente, póliza o tipo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-transparent rounded-lg text-sm font-600 focus:ring-2 focus:ring-blue-500/10 focus:bg-white outline-none transition-all placeholder:text-slate-400" />
                </div>
                <div className="flex gap-2 w-full lg:w-auto">
                    <select value={agentFilter} onChange={(e) => setAgentFilter(e.target.value)} className="flex-1 lg:w-auto bg-white border border-slate-200 text-slate-700 text-[10px] font-900 rounded-lg px-3 py-2 outline-none focus:border-blue-400 uppercase tracking-tighter shadow-sm"><option value="all">AGENTES</option>{uniqueAgents.map(a=><option key={a} value={a}>{a}</option>)}</select>
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="flex-1 lg:w-auto bg-white border border-slate-200 text-slate-700 text-[10px] font-900 rounded-lg px-3 py-2 outline-none focus:border-blue-400 uppercase tracking-tighter shadow-sm"><option value="all">TIPOS</option>{uniqueTypes.map(t=><option key={t} value={t}>{t}</option>)}</select>
                </div>
            </div>

            {/* TABLA COMPACTA */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center text-[10px] font-800 text-slate-500 uppercase tracking-widest">
                    <div>MOSTRANDO <span className="text-blue-600 font-900">{displayedItems.length}</span> DE <span className="text-slate-800 font-900">{filteredData.length}</span> REGISTROS</div>
                    <div className="flex items-center gap-2">VER: <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))} className="bg-transparent border-none text-blue-600 font-900 outline-none cursor-pointer"><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option></select></div>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[850px]">
                        <thead className="bg-[#0f172a] text-white">
                            <tr>
                                <SortableHeader label="Fecha" columnKey="calculationDate" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader label="Agente" columnKey="agentName" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader label="Póliza" columnKey="policyNumber" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader label="Tipo" columnKey="type" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader label="Monto" columnKey="amountCLP" sortConfig={sortConfig} requestSort={requestSort} />
                                <th className="px-6 py-2 text-right text-[10px] uppercase font-900">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="text-[13px] font-600 text-slate-700">
                            {displayedItems.map((c, idx) => (
                                <tr key={idx} className="hover:bg-blue-100/80 even:bg-slate-50/80 transition-all border-b border-slate-200 group">
                                    <td className="px-6 py-1.5 font-900 text-slate-400 leading-none">{c.formattedDate}</td>
                                    <td className="px-6 py-1.5 font-800 text-slate-800 uppercase leading-none truncate max-w-[250px]">{c.agentName}</td>
                                    <td className="px-6 py-1.5 font-900 text-blue-600 leading-none uppercase">{c.policyNumber}</td>
                                    <td className="px-6 py-1.5 italic text-slate-500 text-[11px] leading-none uppercase">{c.type}</td>
                                    <td className="px-6 py-1.5 font-900 text-slate-900 leading-none">{maskMoney(c.amountCLP)}</td>
                                    <td className="px-6 py-1.5 text-right leading-none"><button className="text-slate-300 hover:text-blue-700 transition-all font-900 text-base">•••</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                    <p className="text-[10px] text-slate-500 font-900 uppercase tracking-widest italic">Pág {currentPage} de {totalPages || 1}</p>
                    <div className="flex gap-1.5">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 border border-slate-200 rounded-lg bg-white text-[10px] font-900 shadow-sm hover:bg-slate-100 disabled:opacity-30">ANT.</button>
                        <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 border border-slate-200 rounded-lg bg-white text-[10px] font-900 shadow-sm hover:bg-slate-100 disabled:opacity-30">SIG.</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Commissions;