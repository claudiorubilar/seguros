import React, { useMemo, useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import DashboardCard from '../components/DashboardCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'];

const Dashboard: React.FC = () => {
  const { policies, isLoading } = useAppData();
  const UF_VALUE = 39640;
  const [timeFilter, setTimeFilter] = useState<'12m' | '24m' | 'all'>('12m');
  const [currencyMode, setCurrencyMode] = useState<'CLP' | 'UF'>('CLP');

  const formatValue = (value: number) => {
    if (currencyMode === 'UF') return `${(value / UF_VALUE).toFixed(2)} UF`;
    return `$${Math.round(value).toLocaleString('es-CL')}`;
  };

  const filteredData = useMemo(() => {
    if (policies.length === 0) return { totalCommission: 0, totalPremium: 0, activePoliciesCount: 0, overdueAmount: 0, monthlyData: [], commissionByLine: [], linesOfBusiness: [] };

    const now = new Date();
    let startDate = new Date();
    if (timeFilter === '12m') startDate.setMonth(now.getMonth() - 12);
    else if (timeFilter === '24m') startDate.setMonth(now.getMonth() - 24);
    else startDate = new Date(0);

    let totalCommission = 0;
    let totalPremium = 0;
    let activePoliciesCount = 0;
    let overdueAmount = 0;
    const commissionByLineMap: { [key: string]: number } = {};
    const monthlyCommissionsMap: { [monthKey: string]: { [line: string]: number } } = {};
    
    policies.forEach(policy => {
        const issueDate = new Date(policy.issueDate);
        if (issueDate >= startDate) {
            totalPremium += policy.currency === 'UF' ? policy.totalPremium * UF_VALUE : policy.totalPremium;
            if (policy.status === 'VIGENTE') activePoliciesCount++;
        }
        
        policy.installments.forEach(inst => {
            const amountCLP = inst.currency === 'UF' ? inst.totalAmount * UF_VALUE : inst.totalAmount;
            if (inst.status === 'Pagada' && inst.paymentDate && new Date(inst.paymentDate) >= startDate) {
                const comm = amountCLP * 0.12;
                totalCommission += comm;
                commissionByLineMap[policy.lineOfBusiness] = (commissionByLineMap[policy.lineOfBusiness] || 0) + comm;
                const monthKey = new Date(inst.paymentDate).toISOString().slice(0, 7);
                if (!monthlyCommissionsMap[monthKey]) monthlyCommissionsMap[monthKey] = {};
                monthlyCommissionsMap[monthKey][policy.lineOfBusiness] = (monthlyCommissionsMap[monthKey][policy.lineOfBusiness] || 0) + comm;
            }
            if (inst.status === 'Vencida') overdueAmount += amountCLP;
        });
    });

    const linesOfBusiness = [...new Set(Object.values(monthlyCommissionsMap).flatMap(m => Object.keys(m)))];
    const monthlyData = Object.keys(monthlyCommissionsMap).sort().map(key => ({
        name: new Date(key + "-01").toLocaleString('es-CL', { month: 'short', year: '2-digit' }),
        ...monthlyCommissionsMap[key]
    }));

    return { totalCommission, totalPremium, activePoliciesCount, overdueAmount, monthlyData, commissionByLine: Object.entries(commissionByLineMap).map(([name, value]) => ({ name, value })), linesOfBusiness };
  }, [policies, timeFilter]);

  if (isLoading) return <div className="p-20 text-center text-slate-400 animate-pulse font-bold uppercase tracking-widest text-lg">Cargando Inteligencia Financiera...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* FILTROS SUPERIORES (Título removido por redundancia) */}
      <div className="flex flex-wrap items-center justify-end gap-4 mb-2">
        <div className="flex items-center gap-3">
            <div className="flex bg-slate-200 p-1 rounded-lg border border-slate-300">
                <button onClick={() => setCurrencyMode('CLP')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${currencyMode === 'CLP' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>CLP</button>
                <button onClick={() => setCurrencyMode('UF')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${currencyMode === 'UF' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>UF</button>
            </div>
            <div className="text-xs font-bold text-slate-500 bg-white px-4 py-2.5 rounded-lg border border-slate-200 shadow-sm">
                REF UF: <span className="text-blue-600 ml-1">$39.640</span>
            </div>
        </div>
      </div>

      {/* KPI CARDS - FUENTES AJUSTADAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Comisión Total</p>
            <h3 className="text-3xl font-bold text-slate-800">{formatValue(filteredData.totalCommission)}</h3>
            <div className="mt-3 text-green-600 text-sm font-bold flex items-center">
                <span className="mr-1">↑</span> 12.5% <span className="text-slate-400 font-normal ml-1">vs mes ant.</span>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Prima Neta</p>
            <h3 className="text-3xl font-bold text-slate-800">{formatValue(filteredData.totalPremium)}</h3>
            <p className="mt-3 text-slate-500 text-sm">En línea con la meta anual</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Pólizas Vigentes</p>
            <h3 className="text-3xl font-bold text-slate-800">{filteredData.activePoliciesCount}</h3>
            <div className="mt-3 text-green-600 text-sm font-bold">↑ 4 nuevas hoy</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border-2 border-red-100 shadow-sm bg-gradient-to-br from-white to-red-50/30">
            <p className="text-xs font-black text-red-500 uppercase tracking-widest mb-2">Cuotas Vencidas</p>
            <h3 className="text-3xl font-bold text-red-700">{formatValue(filteredData.overdueAmount)}</h3>
            <div className="mt-3">
                <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-slate-200">
                    <div className="bg-red-600 w-[60%]" title="+90 días"></div>
                    <div className="bg-orange-400 w-[25%]" title="30-60 días"></div>
                    <div className="bg-yellow-400 w-[15%]" title="0-30 días"></div>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 uppercase font-black tracking-tighter">AGING: 60% CRÍTICA (+90D)</p>
            </div>
        </div>
      </div>

      {/* AI INSIGHT BANNER - FUENTE MÁS GRANDE */}
      <div className="bg-blue-600/10 border border-blue-200 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-600/30">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <p className="text-sm font-semibold text-blue-900 leading-relaxed">
            <span className="font-black uppercase mr-3 text-xs bg-blue-600 text-white px-2 py-1 rounded-lg">AI Insight</span>
            La recaudación del ramo <span className="font-extrabold underline decoration-blue-400">Vehículos</span> está un 15% por debajo de la tendencia histórica. Se sugiere revisión urgente en Mapfre.
          </p>
      </div>

      {/* GRÁFICOS - FUENTES AMPLIADAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest">Comisiones Mensuales por Ramo</h2>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                    {['12m', '24m', 'all'].map(f => (
                        <button key={f} onClick={() => setTimeFilter(f as any)} className={`px-3 py-1.5 text-xs font-bold rounded-md ${timeFilter === f ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>{f.toUpperCase()}</button>
                    ))}
                </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
            <BarChart data={filteredData.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} tickFormatter={(v) => currencyMode === 'UF' ? `${v/UF_VALUE}U` : `$${v/1000}k`} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}} />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '12px', fontWeight: 'bold'}} />
                {filteredData.linesOfBusiness.map((line, index) => (
                    <Bar key={line} dataKey={line} stackId="a" fill={COLORS[index % COLORS.length]} radius={index === filteredData.linesOfBusiness.length - 1 ? [4,4,0,0] : [0,0,0,0]} barSize={30} name={line.toUpperCase()} />
                ))}
            </BarChart>
            </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-8 text-center">Mix de Producción</h2>
            <ResponsiveContainer width="100%" height={280}>
            <PieChart>
                <Pie data={filteredData.commissionByLine} innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                {filteredData.commissionByLine.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '12px'}} />
            </PieChart>
            </ResponsiveContainer>
            <div className="mt-8 grid grid-cols-2 gap-4">
                {filteredData.commissionByLine.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                        <span className="text-xs font-bold text-slate-600 truncate uppercase">{entry.name}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;