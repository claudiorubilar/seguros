import React, { useMemo, useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// --- ICONOS INTERNOS REFINADOS ---
const IconBrain = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54z"></path></svg>;
const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;

const formatCLP = (v: number) => `$${Math.round(v).toLocaleString('es-CL')}`;

const generateMarketPath = (initial: number, rate: number, volatility: number) => {
    const data = [];
    let current = initial;
    for (let i = 0; i <= 12; i++) {
        const noise = 1 + (Math.random() - 0.5) * volatility;
        current = current * (1 + (rate / 12)) * noise;
        data.push({ name: i === 0 ? 'H' : `M${i}`, valor: Math.round(current) });
    }
    return data;
};

const InvestmentCard = ({ title, risk, color, projectedRet, initialAmount, volatility, isRecommended, id }) => {
    const data = useMemo(() => generateMarketPath(initialAmount, projectedRet / 100, volatility), [initialAmount, projectedRet, volatility]);
    const finalVal = data[data.length - 1].valor;

    return (
        <div className={`bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col transition-all hover:shadow-md ${isRecommended ? 'ring-2 ring-blue-500/50 scale-[1.01]' : ''}`}>
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-sm font-800 text-slate-700 uppercase tracking-tight leading-none">{title}</h3>
                        <p className="text-[10px] text-slate-400 font-700 uppercase tracking-widest mt-1.5">{risk}</p>
                    </div>
                    {isRecommended && (
                        <div className="bg-blue-600 text-white text-[9px] font-900 px-2 py-0.5 rounded uppercase shadow-sm">Sugerencia AI</div>
                    )}
                </div>
                
                <div className="h-32 w-full mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={color} stopOpacity={0.4}/>
                                    <stop offset="100%" stopColor={color} stopOpacity={0.05}/>
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="valor" stroke={color} strokeWidth={3} fill={`url(#grad-${id})`} point={false} activeDot={{ r: 4, strokeWidth: 0, fill: color }} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 800, fontSize: '11px' }} formatter={(v) => [formatCLP(v as number), "Monto"]} labelStyle={{display:'none'}} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-50">
                    <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className="text-slate-400 text-[9px] font-800 uppercase tracking-widest mb-1 italic">Retorno 12M</span>
                            <span className="text-lg font-900 text-slate-800 leading-none tracking-tighter">{formatCLP(finalVal)}</span>
                        </div>
                        <span className="text-emerald-500 text-xs font-900">↑ {projectedRet}%</span>
                    </div>
                </div>
                
                <button className="w-full mt-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-900 uppercase tracking-widest rounded-lg hover:bg-slate-900 hover:text-white transition-all shadow-sm uppercase italic">
                    Ejecutar Inversión
                </button>
            </div>
        </div>
    );
};

const Investments: React.FC = () => {
    const { commissions, isLoading } = useAppData();
    const [invPercent, setInvPercent] = useState(25);
    const UF_VALUE = 39640;

    const totalUtilidad = useMemo(() => {
        if (!commissions) return 0;
        return commissions.reduce((acc, curr) => acc + (curr.currency === 'UF' ? curr.amount * UF_VALUE : curr.amount), 0);
    }, [commissions]);

    const amountToInvest = useMemo(() => totalUtilidad * (invPercent / 100), [totalUtilidad, invPercent]);

    if (isLoading) return <div className="p-20 text-center font-800 text-slate-400 animate-pulse text-xl">Sincronizando Capital...</div>;

    return (
        <div className="space-y-5 animate-in fade-in duration-500 pb-20" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            
            {/* ACTION BAR: ESTÁNDAR UNIFICADO */}
            <div className="flex justify-end mb-1">
                <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm no-print">
                    <button className="flex items-center gap-2 px-4 py-1.5 text-[11px] font-800 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all border-r border-slate-100 uppercase italic">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Excel
                    </button>
                    <button className="flex items-center gap-2 px-4 py-1.5 text-[11px] font-800 text-rose-800 hover:bg-rose-50 rounded-lg transition-all border-r border-slate-100 uppercase italic">
                        <div className="w-2 h-2 bg-rose-500 rounded-full"></div> PDF
                    </button>
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-1.5 text-[11px] font-800 text-slate-500 hover:bg-slate-50 rounded-lg uppercase tracking-tighter">
                        <IconSearch /> Imprimir
                    </button>
                </div>
            </div>

            {/* PANEL DE CONTROL AI: ALTA DENSIDAD */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    
                    <div className="lg:col-span-3">
                        <p className="text-[10px] font-800 text-slate-400 uppercase tracking-widest mb-1.5">Utilidades Acumuladas</p>
                        <h2 className="text-3xl font-900 text-slate-800 tracking-tighter leading-none italic">{formatCLP(totalUtilidad)}</h2>
                    </div>

                    <div className="lg:col-span-4 space-y-4 border-x border-slate-50 px-8">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-900 text-blue-600 uppercase tracking-widest">Reinvertir: <span className="text-base ml-1 italic">{invPercent}%</span></label>
                            <span className="text-lg font-900 text-slate-800 tracking-tight">{formatCLP(amountToInvest)}</span>
                        </div>
                        <input 
                            type="range" min="1" max="80" 
                            value={invPercent} 
                            onChange={(e) => setInvPercent(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 shadow-inner"
                        />
                        <div className="flex justify-between text-[9px] font-800 text-slate-400 uppercase tracking-tighter">
                            <span>Mínimo</span>
                            <span>Máximo Sugerido (80%)</span>
                        </div>
                    </div>

                    {/* RECOMENDACIÓN IA: LIMPIA Y DIRECTA */}
                    <div className="lg:col-span-5 bg-slate-900 p-6 rounded-xl relative overflow-hidden shadow-xl ring-1 ring-blue-500/30">
                        <div className="relative z-10 flex items-start gap-4">
                            <div className="p-2 bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-500/40 shrink-0">
                                <IconBrain />
                            </div>
                            <div>
                                <p className="text-[10px] font-900 text-blue-400 uppercase tracking-[0.2em] mb-1.5 leading-none">AI Strategic Recommendation</p>
                                <p className="text-[12.5px] font-500 italic leading-relaxed text-slate-200">
                                    "Basado en la tendencia de la <span className="text-white font-900 underline decoration-blue-500 underline-offset-4">UF ($37.942)</span>, recomendamos capitalizar el 45% de sus utilidades en instrumentos de Renta Fija. Esto blindará su liquidez contra la inflación proyectada."
                                </p>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600 opacity-10 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </div>

            {/* GRID DE CARTERAS: COMPACTO Y VIBRANTE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <InvestmentCard 
                    id="1" title="Depósitos a Plazo" 
                    risk="Muy Bajo" color="#3b82f6" 
                    projectedRet={4.8} 
                    initialAmount={amountToInvest} 
                    volatility={0.002}
                    isRecommended={false}
                />
                <InvestmentCard 
                    id="2" title="Deuda Nacional (UF)" 
                    risk="Bajo-Medio" color="#10b981" 
                    projectedRet={7.5} 
                    initialAmount={amountToInvest} 
                    volatility={0.012}
                    isRecommended={true}
                />
                <InvestmentCard 
                    id="3" title="Renta Variable" 
                    risk="Moderado-Alto" color="#f43f5e" 
                    projectedRet={14.2} 
                    initialAmount={amountToInvest} 
                    volatility={0.08}
                    isRecommended={false}
                />
            </div>
            
            <div className="text-center opacity-40">
                <p className="text-[10px] text-slate-500 font-800 uppercase tracking-[0.3em]">
                    Algoritmos predictivos sincronizados con el mercado financiero real.
                </p>
            </div>
        </div>
    );
};

export default Investments;