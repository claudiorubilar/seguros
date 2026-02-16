import React, { useMemo, useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { useSortableData } from '../hooks/useSortableData';

// Iconos internos estándar
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconSort = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="7 15 12 20 17 15"></polyline><polyline points="7 9 12 4 17 9"></polyline></svg>;
const IconChevron = ({dir}) => <svg className={dir === 'left' ? 'rotate-90' : '-rotate-90'} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const IconPlus = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconX = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconUser = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;

const SortableHeader = ({ label, columnKey, sortConfig, requestSort }) => (
    <th 
        className="px-6 py-3 border-r border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors select-none"
        onClick={() => requestSort(columnKey)}
    >
        <div className="flex justify-between items-center text-[11px] uppercase font-800 tracking-wider whitespace-nowrap">
            {label} 
            <span className={sortConfig?.key === columnKey ? 'text-blue-400' : 'opacity-20'}>
                <IconSort />
            </span>
        </div>
    </th>
);

const Clients: React.FC = () => {
    const { clients, policies, isLoading } = useAppData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [segmentFilter, setSegmentFilter] = useState('all');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Enriquecer data con segmentación inteligente
    const enrichedClients = useMemo(() => {
        if (!clients || !policies) return [];
        return clients.map(client => {
            const clientPolicies = policies.filter(p => p.policyHolderId === client.id);
            const totalPremium = clientPolicies.reduce((acc, curr) => acc + curr.totalPremium, 0);
            
            // Lógica de segmentación para el Gerente
            let segment = 'Individual';
            if (totalPremium > 5000000) segment = 'Corporativo';
            else if (totalPremium > 1000000) segment = 'Pyme';

            return {
                ...client,
                policyCount: clientPolicies.length,
                totalPremium,
                segment,
                searchString: `${client.name} ${client.id} ${segment}`.toLowerCase()
            };
        });
    }, [clients, policies]);

    // Filtros dinámicos
    const filteredClients = useMemo(() => {
        return enrichedClients.filter(c => {
            const matchesSearch = c.searchString.includes(searchTerm.toLowerCase());
            const matchesSegment = segmentFilter === 'all' || c.segment === segmentFilter;
            return matchesSearch && matchesSegment;
        });
    }, [enrichedClients, searchTerm, segmentFilter]);

    const uniqueSegments = useMemo(() => 
        Array.from(new Set(enrichedClients.map(c => c.segment))).sort()
    , [enrichedClients]);

    const { items: sortedItems, requestSort, sortConfig } = useSortableData(filteredClients);
    const totalPages = Math.ceil(sortedItems.length / rowsPerPage);
    const displayedItems = sortedItems.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const fmt = (v) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v);

    if (isLoading) return <div className="p-20 text-center font-800 text-slate-400 animate-pulse text-xl uppercase tracking-widest">Sincronizando Clientes...</div>;

    return (
        <div className="space-y-4 animate-in fade-in duration-500 pb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            
            {/* ACTION BAR */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-2">
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-3 px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-800 text-xs shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all uppercase tracking-widest active:scale-95"
                >
                    <IconPlus /> Nuevo Cliente
                </button>

                <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm no-print">
                    <button className="flex items-center gap-2 px-4 py-2 text-[11px] font-800 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all border-r border-slate-100 uppercase tracking-tighter">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Excel
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-[11px] font-800 text-rose-800 hover:bg-rose-50 rounded-lg transition-all border-r border-slate-100 uppercase tracking-tighter">
                        <div className="w-2 h-2 bg-rose-500 rounded-full"></div> PDF
                    </button>
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 text-[11px] font-800 text-slate-500 hover:bg-slate-50 rounded-lg transition-all uppercase tracking-tighter">
                        <IconSearch /> Imprimir
                    </button>
                </div>
            </div>

            {/* BARRA DE FILTROS (Corregida) */}
            <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap lg:flex-nowrap items-center gap-3">
                <div className="relative flex-1 group min-w-[350px]">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <IconSearch />
                    </span>
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre, RUT o segmento..." 
                        value={searchTerm}
                        onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent rounded-xl text-[14px] font-600 focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-400 outline-none transition-all placeholder:text-slate-400"
                    />
                </div>
                <div className="flex items-center gap-2 pr-1">
                    <select 
                        value={segmentFilter}
                        onChange={(e) => {setSegmentFilter(e.target.value); setCurrentPage(1);}}
                        className="bg-white border border-slate-200 text-slate-700 text-[11px] font-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 cursor-pointer hover:bg-slate-50 shadow-sm uppercase tracking-tighter"
                    >
                        <option value="all">TODOS LOS SEGMENTOS</option>
                        {uniqueSegments.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                    </select>
                </div>
            </div>

            {/* TABLA PREMIUM */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center text-[11px] font-800 text-slate-500 uppercase">
                    <div>
                        MOSTRANDO <span className="text-blue-600 font-900 text-sm">{displayedItems.length}</span> DE <span className="text-slate-800 font-900 text-sm">{filteredClients.length}</span> REGISTROS 
                        <span className="mx-3 text-slate-300">|</span> VER: 
                        <select 
                            value={rowsPerPage} 
                            onChange={(e) => {setRowsPerPage(Number(e.target.value)); setCurrentPage(1);}}
                            className="bg-white border border-slate-300 rounded-lg px-2 py-1 ml-2 text-blue-600 font-900 shadow-sm outline-none cursor-pointer"
                        >
                            <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#0f172a] text-white">
                            <tr>
                                <SortableHeader label="Nombre Cliente" columnKey="name" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader label="RUT" columnKey="id" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader label="Segmento" columnKey="segment" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader label="Pólizas" columnKey="policyCount" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader label="Prima Total" columnKey="totalPremium" sortConfig={sortConfig} requestSort={requestSort} />
                                <th className="px-6 py-4 text-right text-[11px] uppercase font-800">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-[14px] font-500 text-slate-700">
                            {displayedItems.map((c, idx) => (
                                <tr key={c.id || idx} className="hover:bg-blue-100/80 even:bg-slate-100/70 transition-all border-b border-slate-200 group">
                                    <td className="px-6 py-3 font-900 text-slate-900 leading-tight uppercase tracking-tighter">{c.name}</td>
                                    <td className="px-6 py-3 font-700 text-slate-400 font-mono italic tracking-tighter">{c.id}</td>
                                    <td className="px-6 py-3 font-800 uppercase">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] ${c.segment === 'Corporativo' ? 'bg-indigo-100 text-indigo-700' : c.segment === 'Pyme' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {c.segment}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className="bg-white border border-slate-200 text-slate-800 px-3 py-1 rounded-lg font-900 text-xs shadow-sm">{c.policyCount}</span>
                                    </td>
                                    <td className="px-6 py-3 font-900 text-slate-900 italic">{fmt(c.totalPremium)}</td>
                                    <td className="px-6 py-3 text-right">
                                        <button className="p-1.5 text-slate-300 hover:text-blue-700 transition-all font-900 text-lg">•••</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                    <p className="text-[11px] text-slate-500 font-800 uppercase tracking-widest italic">Página {currentPage} de {totalPages || 1}</p>
                    <div className="flex gap-2">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-5 py-2 border-2 border-slate-200 rounded-xl bg-white text-[11px] font-800 shadow-sm hover:bg-slate-100 disabled:opacity-30 transition-all">ANTERIOR</button>
                        <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="px-5 py-2 border-2 border-slate-200 rounded-xl bg-white text-[11px] font-800 shadow-sm hover:bg-slate-100 disabled:opacity-30 transition-all">SIGUIENTE</button>
                    </div>
                </div>
            </div>

            {/* MODAL: NUEVO CLIENTE (RESTAURADO) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/20">
                        <div className="bg-[#0f172a] p-10 text-white relative text-left">
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400"><IconX /></button>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/30 text-white"><IconUser /></div>
                                <div>
                                    <h3 className="text-3xl font-900 uppercase tracking-tighter italic leading-none">Nuevo Cliente</h3>
                                    <p className="text-blue-400 text-xs font-800 uppercase tracking-[0.2em] mt-1">Alta de Persona o Empresa</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 space-y-6 text-left">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-900 text-slate-400 uppercase tracking-widest ml-1">Razón Social / Nombre Completo</label>
                                <input type="text" placeholder="Ej: Servicios Integrales SpA" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-700 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner uppercase" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-900 text-slate-400 uppercase tracking-widest ml-1">RUT</label>
                                    <input type="text" placeholder="12.345.678-9" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-700 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-900 text-slate-400 uppercase tracking-widest ml-1">Tipo de Cliente</label>
                                    <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-700 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner">
                                        <option>Empresa (Pyme/Corp)</option>
                                        <option>Persona Natural</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-800 text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all">Cancelar</button>
                                <button className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-800 text-[11px] uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-600/30 transition-all active:scale-95">Crear Cliente</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clients;