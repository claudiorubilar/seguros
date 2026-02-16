import React, { useState } from 'react';

const ZapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);

interface LoginProps {
  onLogin: (role: string, email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullEmail = email.toLowerCase().trim();
    const prefix = fullEmail.split('@')[0];
    
    // LÓGICA DE PREFIJOS ESTRICTA
    let detectedRole = 'Gerente'; 
    if (prefix === 'admin') detectedRole = 'SuperAdmin';
    else if (prefix === 'agente') detectedRole = 'Agente';
    else if (prefix === 'cobranza') detectedRole = 'Cobranza';
    else if (prefix === 'gerente') detectedRole = 'Gerente';

    onLogin(detectedRole, fullEmail);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative"
      style={{ 
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop")',
        backgroundSize: 'cover', backgroundPosition: 'center'
      }}>
      <div className="absolute inset-0 bg-[#0f172a]/70 backdrop-blur-sm"></div>
      <div className="relative bg-white rounded-[2rem] max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-700">
        <div className="bg-[#0f172a] md:w-2/5 p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
                <div className="bg-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-blue-500/30 text-white"><ZapIcon /></div>
                <h1 className="text-4xl font-800 mb-6 tracking-tighter leading-none uppercase italic text-white">InsurCore <span className="text-blue-500 block not-italic">Pro</span></h1>
                <p className="text-slate-400 text-sm font-500 leading-relaxed italic border-l-2 border-blue-500/30 pl-4">"Plataforma SaaS para el control total del corretaje de seguros."</p>
            </div>
            <div className="relative z-10 text-[9px] font-800 text-slate-500 font-mono tracking-[0.2em] uppercase">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2 inline-block"></span> SaaS Infrastructure v2.7
            </div>
        </div>
        <div className="p-12 md:w-3/5 bg-white flex flex-col justify-center text-left">
            <h2 className="text-3xl font-800 text-slate-800 mb-2 tracking-tight">Acceso Identificado</h2>
            <p className="text-slate-500 font-600 text-sm italic mb-10">Ingrese su prefijo de rol (admin@, gerente@, etc.)</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-900 text-slate-400 uppercase tracking-widest ml-1">Email de Usuario</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 text-[14px] font-700 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                        placeholder="admin@ / gerente@ / agente@ / cobranza@" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-900 text-slate-400 uppercase tracking-widest ml-1">Contraseña</label>
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 text-[14px] font-700 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                        placeholder="Cualquier contraseña..." />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-800 text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/30 transition-all active:scale-95">Ingresar al Terminal</button>
            </form>
        </div>
      </div>
    </div>
  );
};
export default Login;