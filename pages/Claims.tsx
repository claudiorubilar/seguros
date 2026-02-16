import React, { useMemo, useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { useSortableData } from '../hooks/useSortableData';

// --- ICONOS INTERNOS ESTÁNDAR ---
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconSort = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="7 15 12 20 17 15"></polyline><polyline points="7 9 12 4 17 9"></polyline></svg>;
const IconChevron = ({dir}: {dir:'left'|'right'}) => <svg className={dir === 'left' ? 'rotate-90' : '-rotate-90'} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const IconAlert = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;

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

const Claims: React.FC<{ isPrivacyActive?: boolean }> = ({ isPrivacyActive = false }) => {
    const { claims, isLoading } = useAppData();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const UF_VALUE = 39640;

    // --- HELPERS DE PRIVACIDAD ---
    const mask = (val: string) => isPrivacyActive ? "••••••••••" : val;
    const maskMoney = (val: number) => {
        if (isPrivacyActive) return "$ •••••••";
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);
    };

    // 1. Filtrado Full-Scan y por Estado
    const filteredClaims = useMemo(() => {
        if (!claims) return [];
        return claims.filter(c => {
            const searchFields = [c.claimNumber || '', c.policyNumber || '', c.policyHolderId || '', c.lineOfBusiness || ''].join(' ').toLowerCase();
            return searchFields.includes(searchTerm.toLowerCase()) && (statusFilter === 'all' || c.status === statusFilter);
        });
    }, [claims, searchTerm, statusFilter]);

    // 2. Snapshot Estratégico (Valor para Gerencia)
    const snapshot = useMemo(() => {
        const totalAmount = filteredClaims.reduce((acc, c) => {
            const isUF = String(c.claimedAmount).includes('UF');
            const val = parseFloat(c.claimedAmount as any) || 0;
            return acc + (isUF ? val * UF_VALUE : val);
        }, 0);
        const openCases = filteredClaims.filter(c => c.status === 'Abierto' || c.status === 'En Proceso').length;
        const total = filteredClaims.length || 1;
        const closed = total - openCases;

        return {
            totalAmount,
            openCases,
            efficiency: (closed / total) * 100,
            count: total,
        };
    }, [filteredClaims]);

    // 3. Ordenamiento y Paginación
    const { items: sortedClaims, requestSort, sortConfig } = useSortableData(filteredClaims, { key: 'claimNumber', direction: 'descending' });
    const totalPages = Math.ceil(sortedClaims.length / rowsPerPage);
    const displayedItems = sortedClaims.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const getStatusStyles = (status: string) => {
        const s = status?.toLowerCase().replace(/\s+/g, '');
        const map: Record<string, string> = {
            abierto: 'bg-blue-50 text-blue-700 border-blue-200',
            enproceso: 'bg-amber-50 text-amber-700 border-amber-200',
            cerrado: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            rechazado: 'bg-rose-50 text-rose-700 border-rose-200'
        };
        return map[s] || 'bg-slate-50 text-slate-600 border-slate-200';
    };

    if (isLoading) return <div className="p-20 text-center font-900 text-slate-400 animate-pulse text-xl uppercase italic">Sincronizando Siniestros...</div>;

    return (
        <div className="space-y-4 animate-in fade-in duration-500 pb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            
            {/* TOOLBAR ESTÁNDAR */}
            <div className="flex justify-end mb-1">
                <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm no-print">
                    <button className="px-5 py-2 text-[11px] font-900 text-emerald-700 hover:bg-emerald-50 rounded-lg border-r border-slate-100 uppercase italic"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Excel</button>
                    <button className="px-5 py-2 text-[11px] font-900 text-rose-800 hover:bg-rose-50 rounded-lg border-r border-slate-100 uppercase italic"><div className="w-2 h-2 bg-rose-500 rounded-full"></div> PDF</button>
                    <button onClick={() => window.print()} className="px-5 py-2 text-[11px] font-900 text-slate-500 hover:bg-slate-50 rounded-lg uppercase"><IconSearch /> Imprimir</button>
                </div>
            </div>

            {/* SNAPSHOT SLIM CON MÉTRICAS DE VALOR */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <p className="text-[9px] font-800 text-slate-400 uppercase tracking-widest mb-1 leading-none">Monto Reclamado</p>
                    <p className="text-base font-900 text-blue-600 leading-none">{maskMoney(snapshot.totalAmount)}</p>
                </div>
                <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center border-l-4 border-l-amber-500 bg-amber-50/20">
                    <p className="text-[9px] font-800 text-amber-600 uppercase tracking-widest mb-1 leading-none font-black">Casos en Gestión</p>
                    <p className="text-base font-900 text-amber-700 leading-none">{snapshot.openCases}</p>
                </div>
                <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <p className="text-[9px] font-800 text-slate-400 uppercase tracking-widest mb-1 leading-none">Eficiencia de Cierre</p>
                    <p className="text-base font-900 text-emerald-600 leading-none">{snapshot.efficiency.toFixed(0)}%</p>
                </div>
                <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center text-right">
                    <p className="text-[9px] font-800 text-slate-400 uppercase tracking-widest mb-1 leading-none italic">Total Registros</p>
                    <p className="text-base font-900 text-slate-800 leading-none">{snapshot.count}</p>
                </div>
            </div>

            {/* BARRA DE FILTROS */}
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center gap-2">
                <div className="relative flex-1 group w-full">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"><IconSearch /></span>
                    <input type="text" placeholder="Buscar por siniestro, póliza o cliente..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-transparent rounded-lg text-sm font-600 focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all" />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full lg:w-auto bg-white border border-slate-200 text-slate-700 text-[10px] font-900 rounded-lg px-3 py-2 outline-none focus:border-blue-400 uppercase tracking-tighter shadow-sm"><option value="all">TODOS LOS ESTADOS</option><option value="Abierto">ABIERTOS</option><option value="En Proceso">EN PROCESO</option><option value="Cerrado">CERRADOS</option></select>
            </div>

            {/* TABLA COMPACTA CON PRIVACIDAD */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center text-[10px] font-800 text-slate-500 uppercase tracking-widest">
                    <div>MOSTRANDO <span className="text-blue-600 font-900">{displayedItems.length}</span> DE <span className="text-slate-800 font-900">{filteredClaims.length}</span> REGISTROS</div>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[850px]">
                        <thead className="bg-[#0f172a] text-white">
                            <tr>
                                <SortableHeader label="Siniestro" columnKey="claimNumber" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader label="Póliza" columnKey="policyNumber" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader label="Cliente" columnKey="policyHolderId" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader label="Monto Reclamado" columnKey="claimedAmount" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader label="Estado" columnKey="status" sortConfig={sortConfig} requestSort={requestSort} />
                                <th className="px-6 py-2 text-right text-[10px] uppercase font-900">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="text-[13px] font-600 text-slate-700">
                            {displayedItems.map((c, idx) => {
                                const isUF = String(c.claimedAmount).includes('UF');
                                const rawAmount = parseFloat(c.claimedAmount as any) || 0;
                                const clpVal = isUF ? rawAmount * UF_VALUE : rawAmount;
                                return (
                                    <tr key={idx} className="hover:bg-blue-100/80 even:bg-slate-50/80 transition-all border-b border-slate-200 group">
                                        <td className="px-6 py-1.5 font-900 text-slate-900 tracking-tight uppercase leading-none">{c.claimNumber}</td>
                                        <td className="px-6 py-1.5"><div className="font-800 text-blue-600 leading-none">{c.policyNumber}</div><div className="text-[10px] text-slate-400 font-800 uppercase tracking-tighter italic mt-0.5">{c.lineOfBusiness}</div></td>
                                        <td className="px-6 py-1.5 font-800 text-slate-800 uppercase leading-none truncate max-w-[200px]">{mask(c.policyHolderId)}</td>
                                        <td className="px-6 py-1.5 font-900 text-slate-900 leading-none">{maskMoney(clpVal)}</td>
                                        <td className="px-6 py-1.5 leading-none"><span className={`px-2.5 py-0.5 rounded-full text-[9px] font-900 uppercase border tracking-tighter ${getStatusStyles(c.status)}`}>{c.status}</span></td>
                                        <td className="px-6 py-1.5 text-right leading-none"><button className="text-slate-300 hover:text-blue-700 transition-all font-900 text-base px-2">•••</button></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                    <p className="text-[10px] text-slate-500 font-900 uppercase tracking-widest italic leading-none">Página {currentPage} de {totalPages || 1}</p>
                    <div className="flex gap-1.5">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 border border-slate-200 rounded-lg bg-white text-[10px] font-900 shadow-sm hover:bg-slate-100 disabled:opacity-30 transition-all uppercase font-black">Ant.</button>
                        <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 border border-slate-200 rounded-lg bg-white text-[10px] font-900 shadow-sm hover:bg-slate-100 disabled:opacity-30 transition-all uppercase font-black">Sig.</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Claims;