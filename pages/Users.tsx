import React, { useMemo, useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { User } from '../types';

// --- ICONOS INTERNOS ---
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconX = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconUser = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;

const Users: React.FC = () => {
    const { users, isLoading, toggleUserStatus } = useAppData();
    const [searchTerm, setSearchTerm] = useState('');
    const [modal, setModal] = useState<{ open: boolean, mode: 'add' | 'edit', data: any }>({ open: false, mode: 'add', data: null });

    const hqUsers = useMemo(() => {
        if (!users) return [];
        return users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [users, searchTerm]);

    if (isLoading) return <div className="p-20 text-center font-900 text-slate-300 animate-pulse">Cargando Equipo HQ...</div>;

    return (
        <div className="space-y-4 animate-in fade-in duration-500 pb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            
            {/* ACTION BAR: TITULO Y EXPORTAR (CORREGIDO) */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-2">
                <button 
                    onClick={() => setModal({ open: true, mode: 'add', data: null })} 
                    className="flex items-center gap-3 px-8 py-3 bg-blue-600 text-white rounded-xl font-800 text-xs shadow-xl hover:bg-blue-700 transition-all uppercase tracking-widest active:scale-95"
                >
                    + AGREGAR USUARIO HQ
                </button>

                {/* BLOQUE EXPORTAR ESTÁNDAR CERTIFICADO */}
                <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm no-print">
                    <button className="flex items-center gap-2 px-5 py-2 text-[11px] font-900 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all border-r border-slate-100 uppercase italic">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> EXCEL
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2 text-[11px] font-900 text-rose-800 hover:bg-rose-50 rounded-lg transition-all border-r border-slate-100 uppercase italic">
                        <div className="w-2 h-2 bg-rose-500 rounded-full"></div> PDF
                    </button>
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2 text-[11px] font-900 text-slate-500 hover:bg-slate-50 rounded-lg transition-all uppercase">
                        <IconSearch /> IMPRIMIR
                    </button>
                </div>
            </div>

            {/* BUSCADOR FULL-WIDTH LEAN */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="relative flex-1 group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"><IconSearch /></span>
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre o email en Innosoft HQ..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-lg text-sm font-600 outline-none transition-all focus:ring-1 focus:ring-blue-500" 
                    />
                </div>
            </div>

            {/* TABLA COMPACT STANDARD */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 bg-slate-50 text-[10px] font-900 text-slate-500 uppercase tracking-widest">
                    EQUIPO INTERNO INNOSOFT | {hqUsers.length} REGISTROS
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#0f172a] text-white">
                            <tr className="text-[10px] font-900 uppercase">
                                <th className="px-6 py-3 border-r border-slate-700">Usuario Interno</th>
                                <th className="px-6 py-3 border-r border-slate-700 text-center">Rol</th>
                                <th className="px-6 py-3 border-r border-slate-700 text-center">Estado</th>
                                <th className="px-6 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-[13px] font-600 text-slate-700 uppercase">
                            {hqUsers.map(u => (
                                <tr key={u.id} className="hover:bg-blue-100/80 even:bg-slate-50/80 transition-all border-b border-slate-100">
                                    <td className="px-6 py-1.5 leading-none">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-900 text-[10px] shadow-sm">{u.name.slice(0,2)}</div>
                                            <div>
                                                <div className="font-800 text-slate-900 leading-none">{u.name}</div>
                                                <div className="text-[9px] text-slate-400 mt-1 lowercase font-bold tracking-tight">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-1.5 text-center italic text-slate-500 text-xs leading-none">{u.role}</td>
                                    <td className="px-6 py-1.5 text-center leading-none">
                                        <span className={`status-pill ${u.status === 'Activo' ? 'status-pagada' : 'status-vencida'}`}>{u.status}</span>
                                    </td>
                                    <td className="px-6 py-1.5 text-right leading-none">
                                        <div className="flex justify-end gap-4">
                                            <button onClick={() => setModal({ open: true, mode: 'edit', data: u })} className="text-blue-600 font-900 text-[10px] hover:underline uppercase">Editar</button>
                                            <button onClick={() => toggleUserStatus(u.id)} className={`font-900 text-[10px] px-2 py-1 rounded border ${u.status === 'Activo' ? 'text-amber-600 border-amber-200' : 'text-emerald-600 border-emerald-200'}`}>
                                                {u.status === 'Activo' ? 'OFF' : 'ON'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL INTEGRADO */}
            {modal.open && (
                <div className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 text-left">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/20">
                        <div className="bg-[#0f172a] p-10 text-white relative">
                            <button onClick={() => setModal({ ...modal, open: false })} className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full text-slate-400"><IconX /></button>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-600 rounded-xl shadow-lg text-white"><IconUser /></div>
                                <div><h3 className="text-3xl font-900 uppercase tracking-tighter italic leading-none">{modal.mode === 'add' ? 'NUEVO USUARIO' : 'EDITAR PERFIL'}</h3><p className="text-blue-400 text-xs font-800 uppercase tracking-[0.2em] mt-1">Innosoft HQ Team</p></div>
                            </div>
                        </div>
                        <div className="p-10 space-y-6">
                            <div className="space-y-1.5"><label className="text-[10px] font-900 text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label><input type="text" defaultValue={modal.data?.name} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-700 outline-none focus:border-blue-500 shadow-inner" /></div>
                            <div className="space-y-1.5"><label className="text-[10px] font-900 text-slate-400 uppercase tracking-widest ml-1">Rol HQ</label><select className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-700 outline-none focus:border-blue-500 shadow-inner"><option>SuperAdmin</option><option>Soporte</option><option>Ventas HQ</option></select></div>
                            <div className="flex gap-4 pt-6"><button onClick={() => setModal({ ...modal, open: false })} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-xl font-800 text-[11px] uppercase tracking-widest">Cancelar</button><button className="flex-1 py-5 bg-blue-600 text-white rounded-xl font-800 text-[11px] uppercase shadow-xl shadow-blue-600/30">Guardar</button></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;