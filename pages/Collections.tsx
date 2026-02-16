import React, { useMemo, useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { useSortableData } from '../hooks/useSortableData';

// --- ICONOS INTERNOS ESTÁNDAR ---
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconSort = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="7 15 12 20 17 15"></polyline><polyline points="7 9 12 4 17 9"></polyline></svg>;
const IconChevron = ({dir}: {dir:'left'|'right'}) => <svg className={dir==='left'?'rotate-90':'-rotate-90'} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;

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

interface CollectionsProps {
  isPrivacyActive?: boolean;
}

const Collections: React.FC<CollectionsProps> = ({ isPrivacyActive = false }) => {
    const { policies, isLoading } = useAppData();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'Pendiente' | 'Vencida' | 'Pagada'>('Pendiente');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const UF_VALUE = 39640;

    // --- HELPERS DE PRIVACIDAD ---
    const mask = (val: string) => isPrivacyActive ? "••••••••••" : val;
    const maskMoney = (val: number) => {
        if (isPrivacyActive) return "$ •••••••";
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);
    };

    // 1. Procesamiento de cuotas con protecciones
    const allInstallments = useMemo(() => {
        if (!policies || !Array.isArray(policies)) return [];
        return policies.flatMap(p => (p.installments || []).map(inst => {
            const amount = Number(inst.totalAmount) || 0;
            return {
                ...inst,
                clientName: p.policyHolderId || 'N/A',
                product: p.product || 'Seguro',
                amountCLP: inst.currency === 'UF' ? amount * UF_VALUE : amount
            };
        }));
    }, [policies]);

    // 2. Estadísticas Globales para el Monitor de Salud
    const globalStats = useMemo(() => {
        const total = allInstallments.length || 1;
        const pagada = allInstallments.filter(i => i.status === 'Pagada').length;
        const vencida = allInstallments.filter(i => i.status === 'Vencida').length;
        const pendiente = allInstallments.filter(i => i.status === 'Pendiente').length;
        return {
            pagada, vencida, pendiente, total,
            pPagada: (pagada / total) * 100,
            pVencida: (vencida / total) * 100,
            pPendiente: (pendiente / total) * 100
        };
    }, [allInstallments]);

    // 3. Filtrado Full-Scan
    const filteredItems = useMemo(() => {
        return allInstallments.filter(inst => {
            const matchesTab = inst.status === activeTab;
            const searchFields = [inst.policyNumber, inst.clientName, inst.product].join(' ').toLowerCase();
            return matchesTab && searchFields.includes(searchTerm.toLowerCase());
        });
    }, [allInstallments, activeTab, searchTerm]);

    // 4. Snapshot de la vista actual
    const snapshot = useMemo(() => {
        const totalAmount = filteredItems.reduce((acc, curr) => acc + (curr.amountCLP || 0), 0);
        return { totalAmount, count: filteredItems.length };
    }, [filteredItems]);

    // 5. Ordenamiento con Configuración Inicial
    const { items: sortedItems, requestSort, sortConfig } = useSortableData(filteredItems, {
        key: 'dueDate',
        direction: 'ascending'
    });

    // 6. Paginación
    const totalPages = Math.ceil(sortedItems.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const displayedItems = sortedItems.slice(startIndex, startIndex + rowsPerPage);

    if (isLoading) return <div className="p-20 text-center font-900 text-slate-400 animate-pulse text-xl uppercase tracking-widest">Sincronizando Cobranzas...</div>;

    return (
        <div className="space-y-3 animate-in fade-in duration-500 pb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            
            {/* TOOLBAR SUPERIOR: EXPORTAR ESTÁNDAR Y MONTO EN VISTA */}
            <div className="flex flex-wrap justify-end items-center gap-4 mb-1">
                <div className="flex items-center gap-4">
                    <div className="text-right pr-4 border-r border-slate-200">
                        <p className="text-[10px] font-800 text-slate-400 uppercase tracking-widest leading-none mb-1">Monto en Vista</p>
                        <p className="text-sm font-900 text-blue-600 leading-none">{maskMoney(snapshot.totalAmount)}</p>
                    </div>
                    
                    <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm no-print">
                        <button className="flex items-center gap-2 px-5 py-2 text-[11px] font-900 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all border-r border-slate-100 uppercase italic">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> EXCEL
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2 text-[11px] font-900 text-rose-800 hover:bg-rose-50 rounded-lg transition-all border-r border-slate-100 uppercase italic">
                            <div className="w-2 h-2 bg-rose-500 rounded-full"></div> PDF
                        </button>
                        <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2 text-[11px] font-900 text-slate-500 hover:bg-slate-50 rounded-lg transition-all uppercase tracking-tighter">
                            <IconSearch /> IMPRIMIR
                        </button>
                    </div>
                </div>
            </div>

            {/* SNAPSHOTS ESTRATÉGICOS CON MONITOR DE SALUD */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <p className="text-[9px] font-800 text-slate-400 uppercase tracking-widest mb-1 leading-none text-blue-600 italic">Total en {activeTab}</p>
                    <p className="text-base font-900 text-slate-800 leading-none">{maskMoney(snapshot.totalAmount)}</p>
                </div>
                <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center text-center">
                    <p className="text-[9px] font-800 text-slate-400 uppercase tracking-widest mb-1 leading-none italic text-center">Cuotas en Vista</p>
                    <p className="text-base font-900 text-slate-800 leading-none">{snapshot.count}</p>
                </div>
                <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <p className="text-[9px] font-800 text-slate-400 uppercase tracking-widest mb-1 leading-none text-right italic">Promedio Cuota</p>
                    <p className="text-base font-900 text-slate-800 leading-none text-right">{maskMoney(snapshot.totalAmount / (snapshot.count || 1))}</p>
                </div>

                <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <p className="text-[10px] font-900 text-slate-500 uppercase tracking-widest leading-none mb-2 italic text-center">Salud de Cartera</p>
                    <div className="flex h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-2 shadow-inner">
                        <div className="bg-emerald-500 h-full" style={{ width: `${globalStats.pPagada}%` }}></div>
                        <div className="bg-rose-500 h-full" style={{ width: `${globalStats.pVencida}%` }}></div>
                        <div className="bg-amber-400 h-full" style={{ width: `${globalStats.pPendiente}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-900 uppercase tracking-tighter">
                        <div className="flex items-center gap-1 text-emerald-700"><span>{globalStats.pagada}</span><span className="text-[8px] opacity-60">PAG.</span></div>
                        <div className="flex items-center gap-1 text-rose-700"><span>{globalStats.vencida}</span><span className="text-[8px] opacity-60">VEN.</span></div>
                        <div className="flex items-center gap-1 text-amber-600"><span>{globalStats.pendiente}</span><span className="text-[8px] opacity-60">PEND.</span></div>
                    </div>
                </div>
            </div>

            {/* FILTROS E INTELIGENCIA */}
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center gap-2">
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 w-full lg:w-auto">
                    {(['Pendiente', 'Vencida', 'Pagada'] as const).map(tab => (
                        <button key={tab} onClick={() => {setActiveTab(tab); setCurrentPage(1);}} className={`flex-1 lg:flex-none px-5 py-2 text-[10px] font-800 rounded-lg transition-all ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm font-900' : 'text-slate-500 hover:text-slate-800'}`}>{tab.toUpperCase()}</button>
                    ))}
                </div>
                <div className="relative flex-1 group w-full">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"><IconSearch /></span>
                    <input type="text" placeholder="Buscar por cliente, póliza o producto..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-transparent rounded-xl text-sm font-600 focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all placeholder:text-slate-400 shadow-inner" />
                </div>
            </div>

            {/* TABLA COMPACT STANDARD */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center text-[10px] font-800 text-slate-500 uppercase tracking-widest">
                    <div>MOSTRANDO <span className="text-blue-600 font-900">{displayedItems.length}</span> DE <span className="text-slate-800 font-900">{filteredItems.length}</span> REGISTROS</div>
                    <div className="flex items-center gap-2">
                        VER: 
                        <select value={rowsPerPage} onChange={(e) => {setRowsPerPage(Number(e.target.value)); setCurrentPage(1);}} className="bg-transparent border-none text-blue-600 font-900 outline-none cursor-pointer">
                            <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[850px]">
                        <thead className="bg-[#0f172a] text-white">
                            <tr>
                                <SortableHeader label="Vencimiento" columnKey="dueDate" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader label="Cliente" columnKey="clientName" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader label="N° Póliza" columnKey="policyNumber" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader label="Cuota" columnKey="installmentNumber" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader label="Monto" columnKey="amountCLP" sortConfig={sortConfig} requestSort={requestSort} />
                                <th className="px-6 py-2 text-right text-[10px] uppercase font-900 tracking-widest">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="text-[13px] font-600 text-slate-700">
                            {displayedItems.map((inst, idx) => (
                                <tr key={idx} className="hover:bg-blue-100/80 even:bg-slate-50/80 transition-all border-b border-slate-200 group">
                                    <td className={`px-6 py-1.5 font-900 tracking-tight leading-none ${activeTab === 'Vencida' ? 'text-rose-600' : activeTab === 'Pagada' ? 'text-emerald-600' : 'text-slate-900'}`}>
                                        {new Date(inst.dueDate).toLocaleDateString('es-CL')}
                                    </td>
                                    <td className="px-6 py-1.5 font-800 text-slate-800 uppercase leading-none truncate max-w-[220px]">
                                        {mask(inst.clientName)}
                                    </td>
                                    <td className="px-6 py-1.5 leading-none">
                                        <div className="font-800 text-blue-600 leading-none">{inst.policyNumber}</div>
                                        <div className="text-[10px] text-slate-400 font-800 uppercase tracking-tighter italic mt-0.5">{inst.product}</div>
                                    </td>
                                    <td className="px-6 py-1.5 font-800 text-slate-500 leading-none">{inst.installmentNumber} / {inst.totalInstallments}</td>
                                    <td className="px-6 py-1.5 font-900 text-slate-900 leading-none">{maskMoney(inst.amountCLP)}</td>
                                    <td className="px-6 py-1.5 text-right leading-none">
                                        <button className="text-slate-300 hover:text-blue-700 transition-all font-900 text-base">•••</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                    <p className="text-[10px] text-slate-500 font-900 uppercase tracking-widest italic leading-none">Página {currentPage} de {totalPages || 1}</p>
                    <div className="flex gap-1.5">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 border border-slate-200 rounded-lg bg-white text-[10px] font-900 shadow-sm hover:bg-slate-100 disabled:opacity-30 transition-all font-black uppercase">Ant.</button>
                        <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 border border-slate-200 rounded-lg bg-white text-[10px] font-900 shadow-sm hover:bg-slate-100 disabled:opacity-30 transition-all font-black uppercase">Sig.</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Collections;