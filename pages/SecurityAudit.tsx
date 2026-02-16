import React, { useMemo, useState } from 'react';

const IconShield = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;

const SecurityAudit: React.FC = () => {
    const auditLogs = [
        { id: 1, user: 'Carlos Díaz', action: 'Exportación de Cartera', resource: 'Pólizas Vida', date: '20-01-2026 14:30', ip: '192.168.1.45', status: 'Exitoso' },
        { id: 2, user: 'Benjamin Soto', action: 'Modificación de Comisión', resource: 'POL-900045', date: '20-01-2026 12:15', ip: '192.168.1.12', status: 'Advertencia' },
        { id: 3, user: 'John Doe', action: 'Acceso al Sistema', resource: 'Login Manager', date: '20-01-2026 09:00', ip: '201.214.5.11', status: 'Exitoso' },
        { id: 4, user: 'Sistema', action: 'Backup Automático', resource: 'Cloud Sync', date: '20-01-2026 03:00', ip: 'Internal', status: 'Exitoso' },
    ];

    return (
        <div className="space-y-4 animate-in fade-in duration-500 pb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            
            {/* SNAPSHOT DE SEGURIDAD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><IconShield /></div>
                    <div><p className="text-[10px] font-black text-slate-400 uppercase">Integridad de Data</p><p className="text-lg font-900 text-slate-800">100% CIFRADA</p></div>
                </div>
                <div className="bg-white p-5 border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><IconShield /></div>
                    <div><p className="text-[10px] font-black text-slate-400 uppercase">Intentos de Acceso</p><p className="text-lg font-900 text-slate-800">12 HOY</p></div>
                </div>
                <div className="bg-[#0f172a] p-5 border border-slate-800 shadow-sm flex items-center gap-4 text-white">
                    <div className="p-3 bg-blue-600 rounded-lg"><IconShield /></div>
                    <div><p className="text-[10px] font-black text-blue-400 uppercase">Cumplimiento Estándar</p><p className="text-lg font-900">ISO/IEC 27001 READY</p></div>
                </div>
            </div>

            <div className="bg-white rounded-none border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 bg-slate-50 text-[10px] font-900 text-slate-500 uppercase tracking-widest">
                    Bitácora de Auditoría Operativa
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#0f172a] text-white">
                            <tr className="text-[10px] font-900 uppercase">
                                <th className="px-6 py-3 border-r border-slate-700">Usuario</th>
                                <th className="px-6 py-3 border-r border-slate-700">Acción Realizada</th>
                                <th className="px-6 py-3 border-r border-slate-700">Recurso Afectado</th>
                                <th className="px-6 py-3 border-r border-slate-700">Fecha / Hora</th>
                                <th className="px-6 py-3 text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="text-[13px] font-600 text-slate-700">
                            {auditLogs.map(log => (
                                <tr key={log.id} className="hover:bg-blue-50/80 transition-all border-b border-slate-100 py-1.5">
                                    <td className="px-6 py-1.5 font-800 text-slate-900">{log.user}</td>
                                    <td className="px-6 py-1.5 font-700 text-blue-600 uppercase italic text-[11px]">{log.action}</td>
                                    <td className="px-6 py-1.5 font-900 text-slate-500">{log.resource}</td>
                                    <td className="px-6 py-1.5 font-bold text-slate-400">{log.date}</td>
                                    <td className="px-6 py-1.5 text-center">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${log.status === 'Exitoso' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SecurityAudit;