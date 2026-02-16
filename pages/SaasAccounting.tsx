import React from 'react';

const formatCLP = (v: number) => `$${Math.round(v).toLocaleString('es-CL')}`;

const SaasAccounting: React.FC = () => {
    const history = [
        { id: '1', date: '05/01/2026', brokerage: 'BrokerMax Chile SpA', concept: 'Suscripción Enterprise', amount: 2500000, status: 'Pagado' },
        { id: '2', date: '04/01/2026', brokerage: 'Seguros Valdés Corredores', concept: 'Suscripción Pro', amount: 750000, status: 'Pagado' },
        { id: '3', date: '02/01/2026', brokerage: 'InsurDirect Chile', concept: 'Suscripción Pyme', amount: 250000, status: 'Vencido' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in pb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-2">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6"><div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black">💰</div><div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Recaudación HQ (Enero)</p><h3 className="text-3xl font-900 text-slate-800 leading-none italic">{formatCLP(3250000)}</h3></div></div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6 border-l-4 border-l-rose-500"><div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center font-black">⚠</div><div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none text-rose-600">Cartera en Mora HQ</p><h3 className="text-3xl font-900 text-rose-700 leading-none italic">{formatCLP(250000)}</h3></div></div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 bg-slate-50 text-[10px] font-800 text-slate-500 uppercase tracking-widest">HISTORIAL DE COBROS INNOSOFT HQ</div>
                <table className="w-full text-left">
                    <thead className="bg-[#0f172a] text-white">
                        <tr className="text-[10px] font-900 uppercase">
                            <th className="px-6 py-4 border-r border-slate-700">Fecha</th>
                            <th className="px-6 py-4 border-r border-slate-700">Corredora</th>
                            <th className="px-6 py-4 border-r border-slate-700">Concepto</th>
                            <th className="px-6 py-4 text-right">Monto</th>
                            <th className="px-6 py-4 text-center">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="text-[13px] font-600 text-slate-700 uppercase">
                        {history.map(h => (
                            <tr key={h.id} className="hover:bg-blue-100/80 transition-all border-b border-slate-100 even:bg-slate-50/50">
                                <td className="px-6 py-2 font-bold text-slate-400">{h.date}</td>
                                <td className="px-6 py-2 font-800 text-slate-900 leading-none italic">{h.brokerage}</td>
                                <td className="px-6 py-2 text-slate-400 text-xs italic">{h.concept}</td>
                                <td className="px-6 py-2 text-right font-900 text-slate-900">{formatCLP(h.amount)}</td>
                                <td className="px-6 py-2 text-center"><span className={`status-pill ${h.status === 'Pagado' ? 'status-pagada' : 'status-vencida'}`}>{h.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SaasAccounting;