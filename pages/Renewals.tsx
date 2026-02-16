import React from 'react';

const Renewals: React.FC = () => {
  const data = [
    { id: 1, cliente: "Industrias Beta", poliza: "POL-9928", vcto: "2026-03-15", variacion: "+5.2%", estado: "En Negociación", motivo: "-" },
    { id: 2, cliente: "Juan Pérez", poliza: "AUT-4412", vcto: "2026-02-28", variacion: "-2.0%", estado: "Perdida", motivo: "Precio / Competencia" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <p className="text-[10px] font-bold text-slate-500 uppercase">Tasa de Renovación</p>
          <p className="text-2xl font-black text-blue-600">88.5%</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <p className="text-[10px] font-bold text-slate-500 uppercase">Churn Rate (Fuga)</p>
          <p className="text-2xl font-black text-red-500">11.5%</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <p className="text-[10px] font-bold text-slate-500 uppercase">Prima en Riesgo</p>
          <p className="text-2xl font-black text-amber-500">UF 1.250</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-bold text-slate-600">CLIENTE / PÓLIZA</th>
              <th className="p-4 font-bold text-slate-600">VENCIMIENTO</th>
              <th className="p-4 font-bold text-slate-600">VAR. PRIMA</th>
              <th className="p-4 font-bold text-slate-600">RESULTADO</th>
              <th className="p-4 font-bold text-slate-600">MOTIVO PÉRDIDA</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4">
                  <p className="font-bold text-slate-800">{item.cliente}</p>
                  <p className="text-[10px] text-slate-500">{item.poliza}</p>
                </td>
                <td className="p-4 font-medium">{item.vcto}</td>
                <td className={`p-4 font-bold ${item.variacion.includes('+') ? 'text-red-500' : 'text-green-500'}`}>
                  {item.variacion}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${
                    item.estado === 'Perdida' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                  }`}>{item.estado}</span>
                </td>
                <td className="p-4 text-slate-500 italic">{item.motivo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Renewals;