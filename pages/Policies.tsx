import React, { useMemo, useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { useSortableData } from '../hooks/useSortableData';

// --- ICONOS INTERNOS (Para evitar fallos de importación) ---
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconSort = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="7 15 12 20 17 15"></polyline><polyline points="7 9 12 4 17 9"></polyline></svg>;
const IconChevron = ({dir}: {dir: 'left' | 'right'}) => <svg className={dir === 'left' ? 'rotate-90' : '-rotate-90'} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;

interface PoliciesProps {
  isPrivacyActive?: boolean;
}

const Policies: React.FC<PoliciesProps> = ({ isPrivacyActive = false }) => {
    const { policies, isLoading } = useAppData();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const UF_VALUE = 39640;

    // --- HELPERS DE PRIVACIDAD ---
    const mask = (val: any) => {
        if (!isPrivacyActive) return val;
        return "••••••••••";
    };

    const maskMoney = (val: number) => {
        if (isPrivacyActive) return "$ •••••••";
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);
    };

    // --- 1. FILTRADO SEGURO ---
    const filteredPolicies = useMemo(() => {
        const data = policies || [];
        return data.filter(p => {
            if (!p) return false;
            const searchFields = [
                p.policyNumber || '',
                p.policyHolderId || '',
                p.product || '',
                p.insurerId || ''
            ].join(' ').toLowerCase();

            const matchesSearch = searchFields.includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [policies, searchTerm, statusFilter]);

    // --- 2. SNAPSHOT SEGURO ---
    const snapshot = useMemo(() => {
        const totalPremium = filteredPolicies.reduce((acc, p) => {
            const val = p.currency === 'UF' ? (p.totalPremium || 0) * UF_VALUE : (p.totalPremium || 0);
            return acc + val;
        }, 0);
        return { 
            totalPremium, 
            total: filteredPolicies.length, 
            vigentes: filteredPolicies.filter(p => p.status === 'VIGENTE').length 
        };
    }, [filteredPolicies]);

    // --- 3. ORDENAMIENTO (Garantizado con Configuración Inicial) ---
    const { items: sortedPolicies, requestSort, sortConfig } = useSortableData(filteredPolicies, { 
        key: 'policyNumber', 
        direction: 'ascending' 
    });

    // --- 4. PAGINACIÓN SEGURA ---
    const totalPages = Math.ceil((sortedPolicies?.length || 0) / rowsPerPage);
    const displayedItems = (sortedPolicies || []).slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    if (isLoading) return <div className="p-20 text-center font-900 text-slate-400 animate-pulse text-xl uppercase tracking-widest italic">Sincronizando Cartera...</div>;

    return (
        <div className="space-y-4 animate-in fade-in duration-500 pb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            
            {/* TOOLBAR EXPORTACIÓN ESTÁNDAR (Como el de Siniestros) */}
            <div className="flex justify-end mb-1">
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

            {/* SNAPSHOT SLIM (Radio 12px) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                    <p className="text-[9px] font-800 text-slate-400 uppercase tracking-widest mb-1 leading-none text-blue-600 italic">Monto Total Cartera</p>
                    <p className="text-base font-900 text-slate-800 leading-none">{maskMoney(snapshot.totalPremium)}</p>
                </div>
                <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center text-right">
                    <p className="text-[9px] font-800 text-slate-400 uppercase tracking-widest mb-1 leading-none italic tracking-tighter">Vigencia</p>
                    <p className="text-base font-900 text-slate-800 leading-none">{snapshot.vigentes} / {snapshot.total}</p>
                </div>
            </div>

            {/* FILTROS E INTELIGENCIA */}
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center gap-2">
                <div className="relative flex-1 group w-full">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <IconSearch />
                    </span>
                    <input 
                        type="text" 
                        placeholder="Buscar por póliza, cliente o ramo..." 
                        value={searchTerm}
                        onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-lg text-sm font-600 focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all placeholder:text-slate-400 shadow-inner"
                    />
                </div>
                <select 
                    value={statusFilter} 
                    onChange={(e) => {setStatusFilter(e.target.value); setCurrentPage(1);}} 
                    className="w-full lg:w-auto bg-white border border-slate-200 text-slate-700 text-[10px] font-900 rounded-lg px-3 py-2.5 outline-none focus:border-blue-400 uppercase tracking-tighter shadow-sm"
                >
                    <option value="all">TODOS LOS ESTADOS</option>
                    <option value="VIGENTE">VIGENTES</option>
                    <option value="VENCIDA">VENCIDAS</option>
                    <option value="CANCELADA">CANCELADAS</option>
                </select>
            </div>

            {/* TABLA COMPACTA (Radio 12px) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center text-[10px] font-800 text-slate-500 uppercase tracking-widest">
                    <div>MOSTRANDO <span className="text-blue-600 font-900">{displayedItems.length}</span> DE <span className="text-slate-800 font-900">{filteredPolicies.length}</span> REGISTROS</div>
                    <div className="flex items-center gap-2">
                        VER: 
                        <select 
                            value={rowsPerPage} 
                            onChange={(e) => {setRowsPerPage(Number(e.target.value)); setCurrentPage(1);}} 
                            className="bg-transparent border-none text-blue-600 font-900 outline-none cursor-pointer"
                        >
                            <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[850px]">
                        <thead className="bg-[#0f172a] text-white">
                            <tr>
                                <th className="px-6 py-2 border-r border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors select-none text-[10px] uppercase font-900 tracking-wider" onClick={() => requestSort('policyNumber')}>
                                    <div className="flex justify-between items-center whitespace-nowrap">Póliza <IconSort /></div>
                                </th>
                                <th className="px-6 py-2 border-r border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors select-none text-[10px] uppercase font-900 tracking-wider" onClick={() => requestSort('policyHolderId')}>
                                    <div className="flex justify-between items-center whitespace-nowrap">Contratante <IconSort /></div>
                                </th>
                                <th className="px-6 py-2 border-r border-slate-700 text-[10px] uppercase font-900 tracking-wider">Compañía</th>
                                <th className="px-6 py-2 border-r border-slate-700 text-[10px] uppercase font-900 tracking-wider">Estado</th>
                                <th className="px-6 py-2 text-right text-[10px] uppercase font-900 tracking-widest">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="text-[13px] font-600 text-slate-700">
                            {displayedItems.map((p, idx) => (
                                <tr key={idx} className="hover:bg-blue-100/80 even:bg-slate-50/80 transition-all border-b border-slate-100 group">
                                    <td className="px-6 py-1.5 leading-none">
                                        <div className="font-800 text-slate-900 leading-none">{p.policyNumber}</div>
                                        <div className="text-[10px] text-slate-400 font-800 uppercase tracking-tighter italic mt-0.5">{p.product}</div>
                                    </td>
                                    <td className="px-6 py-1.5 font-800 text-slate-800 uppercase leading-none truncate max-w-[250px]">
                                        {mask(p.policyHolderId)}
                                    </td>
                                    <td className="px-6 py-1.5 font-800 text-slate-500 italic leading-none uppercase">{p.insurerId}</td>
                                    <td className="px-6 py-1.5 leading-none">
                                        <span className={`status-pill status-${p.status?.toLowerCase()}`}>{p.status}</span>
                                    </td>
                                    <td className="px-6 py-1.5 text-right leading-none">
                                        <button className="text-slate-300 hover:text-blue-700 transition-all font-900 text-base">•••</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PAGINACIÓN */}
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

export default Policies;