import React, { useState } from 'react';

const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconX = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

const Brokerages: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [modal, setModal] = useState<'create' | 'config' | null>(null);

    const brokerages = [
        { id: '1', name: 'BrokerMax Chile SpA', rut: '76.123.456-7', plan: 'Enterprise', users: 45, status: 'Activo', payment: 'Al Día' },
        { id: '2', name: 'Seguros Valdés Corredores', rut: '77.888.111-0', plan: 'Pro', users: 12, status: 'Activo', payment: 'Al Día' },
        { id: '3', name: 'InsurDirect Chile', rut: '76.999.000-K', plan: 'Pyme', users: 4, status: 'Mora', payment: 'Vencido' },
    ];

    return (
        <div className="space-y-4 animate-in fade-in pb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <div className="flex justify-between items-center mb-2">
                <button onClick={() => setModal('create')} className="flex items-center gap-3 px-8 py-3 bg-blue-600 text-white rounded-xl font-800 text-xs shadow-xl hover:bg-blue-700 transition-all uppercase tracking-widest active:scale-95">+ REGISTRAR NUEVA CORREDORA</button>
                <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm no-print">
                    <button className="flex items-center gap-2 px-5 py-2 text-[11px] font-900 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all border-r border-slate-100 uppercase italic"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> EXCEL</button>
                    <button className="flex items-center gap-2 px-5 py-2 text-[11px] font-900 text-rose-800 hover:bg-rose-50 rounded-lg transition-all border-r border-slate-100 uppercase italic"><div className="w-2 h-2 bg-rose-500 rounded-full"></div> PDF</button>
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2 text-[11px] font-900 text-slate-500 hover:bg-slate-50 rounded-lg transition-all uppercase"><IconSearch /> IMPRIMIR</button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center text-[10px] font-900 text-slate-500 uppercase tracking-widest">
                    <span>MOSTRANDO {brokerages.length} REGISTROS</span>
                    <div className="relative w-64"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><IconSearch /></span><input type="text" placeholder="Buscador..." className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500" /></div>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-[#0f172a] text-white">
                        <tr className="text-[10px] font-900 uppercase">
                            <th className="px-6 py-3 border-r border-slate-700">Corredora</th>
                            <th className="px-6 py-3 border-r border-slate-700">RUT</th>
                            <th className="px-6 py-3 border-r border-slate-700 text-center">Plan</th>
                            <th className="px-6 py-3 border-r border-slate-700 text-center text-blue-400">Pago</th>
                            <th className="px-6 py-3 text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="text-[13px] font-600 text-slate-700">
                        {brokerages.map(b => (
                            <tr key={b.id} className="hover:bg-blue-50/80 even:bg-slate-50/80 transition-all border-b border-slate-100">
                                <td className="px-6 py-2 font-800 text-slate-900">{b.name}</td>
                                <td className="px-6 py-2 font-mono text-slate-400 text-xs">{b.rut}</td>
                                <td className="px-6 py-2 text-center"><span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-black uppercase">{b.plan}</span></td>
                                <td className="px-6 py-2 text-center"><span className={`font-black text-[10px] uppercase ${b.payment === 'Al Día' ? 'text-emerald-600' : 'text-rose-600'}`}>● {b.payment}</span></td>
                                <td className="px-6 py-2 text-right"><button onClick={() => setModal('config')} className="text-blue-600 font-900 text-[10px] uppercase hover:underline">Configurar</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODALES CLAVE (COMO TUS CAPTURAS) */}
            {modal && (
                <div className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/20 text-left">
                        <div className="bg-[#0f172a] p-10 text-white relative">
                            <button onClick={() => setModal(null)} className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400"><IconX /></button>
                            <h3 className="text-3xl font-900 uppercase tracking-tighter italic leading-none">{modal === 'create' ? 'NUEVA CORREDORA' : 'CONFIGURAR CUENTA'}</h3>
                            <p className="text-blue-400 text-xs font-800 uppercase tracking-[0.2em] mt-1">SaaS Infrastructure Master</p>
                        </div>
                        <div className="p-10 space-y-6">
                            <div className="space-y-1.5"><label className="text-[10px] font-900 text-slate-400 uppercase tracking-widest ml-1">Nombre Comercial</label><input type="text" placeholder="EJ: BROKERMAX CHILE SPA" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-700 outline-none focus:border-blue-500 uppercase shadow-inner" /></div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5"><label className="text-[10px] font-900 text-slate-400 uppercase tracking-widest ml-1">Plan SaaS</label><select className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-700 outline-none shadow-inner"><option>Pyme</option><option>Pro</option><option>Enterprise</option></select></div>
                                <div className="space-y-1.5"><label className="text-[10px] font-900 text-slate-400 uppercase tracking-widest ml-1">Estado de Pago</label><select className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-700 outline-none shadow-inner"><option>Al Día</option><option>Vencido</option></select></div>
                            </div>
                            <div className="flex gap-4 pt-6"><button onClick={() => setModal(null)} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-xl font-800 text-[11px] uppercase">CANCELAR</button><button className="flex-1 py-5 bg-blue-600 text-white rounded-xl font-800 text-[11px] uppercase shadow-xl shadow-blue-500/30">{modal === 'create' ? 'GUARDAR REGISTRO' : 'GUARDAR CAMBIOS'}</button></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Brokerages;