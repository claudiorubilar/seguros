import React from 'react';
import { Page } from '../App';
import { 
  DashboardIcon, PoliciesIcon, AgentsIcon, 
  ClientsIcon, CollectionsIcon, UsersIcon, ClaimsIcon, 
  QuotesIcon, CRMIcon, TasksIcon, ReportsIcon, 
  CommissionsIcon, InvestmentsIcon, ShieldCheckIcon
} from './IconComponents';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  role: string;
  onOpenAI: () => void;
}

const ZapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);

const NavItem: React.FC<{ id: Page; label: string; icon: React.ReactNode; activePage: Page; onClick: (page: Page) => void; }> = ({ id, label, icon, activePage, onClick }) => (
    <button onClick={() => onClick(id)} className={`w-full flex items-center p-2.5 my-0.5 transition-all duration-200 group relative border-l-4 ${activePage === id ? 'bg-blue-600/10 text-white border-blue-500' : 'hover:bg-white/5 text-slate-400 hover:text-slate-200 border-transparent'}`}>
        <span className={`flex shrink-0 items-center justify-center w-5 ${activePage === id ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`}><div className="scale-90">{icon}</div></span>
        <span className="ml-3 font-bold text-[11px] uppercase tracking-wider">{label}</span>
    </button>
);

const NavSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    if (React.Children.count(children) === 0) return null;
    return (
        <div className="mb-6">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-4 mb-2">{title}</h2>
            <div className="flex flex-col">{children}</div>
        </div>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, role, onOpenAI }) => {
  
  const canSee = (page: Page): boolean => {
    if (role === 'SuperAdmin') return ['saas-dashboard', 'brokerages', 'plans', 'saas-accounting', 'users'].includes(page);
    if (role === 'Gerente' || role === 'Admin') return !['saas-dashboard', 'brokerages', 'plans', 'saas-accounting'].includes(page);
    if (role === 'Agente') return ['agent-portal', 'policies', 'clients', 'claims', 'quotes', 'sales-workflow', 'tasks'].includes(page);
    if (role === 'Cobranza') return ['collections', 'policies', 'claims', 'tasks', 'reports'].includes(page);
    return false;
  };

  return (
    <div className="bg-[#0f172a] text-white w-full h-full flex flex-col shrink-0 shadow-2xl transition-all duration-300 border-r border-white/5">
      <div className="flex items-center p-6 h-20 border-b border-white/5">
        <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-600/30 text-white"><ZapIcon /></div>
        <h1 className="ml-3 text-xl font-black tracking-tighter italic uppercase">InsurCore <span className="text-blue-500 font-extrabold text-sm align-top">Pro</span></h1>
      </div>
      
      <nav className="flex-1 py-6 overflow-y-auto custom-scrollbar">
        {role === 'SuperAdmin' ? (
          <>
            <NavSection title="SaaS HQ">
              <NavItem id="saas-dashboard" label="Monitor Global" icon={<DashboardIcon />} activePage={activePage} onClick={setActivePage} />
              <NavItem id="brokerages" label="Corredoras" icon={<AgentsIcon />} activePage={activePage} onClick={setActivePage} />
              <NavItem id="plans" label="Planes SaaS" icon={<PoliciesIcon />} activePage={activePage} onClick={setActivePage} />
            </NavSection>
            <NavSection title="Innosoft Finanzas">
              <NavItem id="saas-accounting" label="Pagos Recibidos" icon={<CommissionsIcon />} activePage={activePage} onClick={setActivePage} />
              <NavItem id="users" label="Equipo Interno" icon={<UsersIcon />} activePage={activePage} onClick={setActivePage} />
            </NavSection>
          </>
        ) : (
          <>
            <NavSection title="Operaciones">
              {canSee('dashboard') && <NavItem id="dashboard" label="Dashboard" icon={<DashboardIcon />} activePage={activePage} onClick={setActivePage} />}
              {canSee('agent-portal') && <NavItem id="agent-portal" label="Mi Portal" icon={<DashboardIcon />} activePage={activePage} onClick={setActivePage} />}
              {canSee('policies') && <NavItem id="policies" label="Pólizas" icon={<PoliciesIcon />} activePage={activePage} onClick={setActivePage} />}
              {canSee('collections') && <NavItem id="collections" label="Cobranza" icon={<CollectionsIcon />} activePage={activePage} onClick={setActivePage} />}
              {canSee('claims') && <NavItem id="claims" label="Siniestros" icon={<ClaimsIcon />} activePage={activePage} onClick={setActivePage} />}
              {canSee('commissions') && <NavItem id="commissions" label="Comisiones" icon={<CommissionsIcon />} activePage={activePage} onClick={setActivePage} />}
            </NavSection>

            <NavSection title="Estrategia">
              {canSee('sales-workflow') && <NavItem id="sales-workflow" label="CRM" icon={<CRMIcon />} activePage={activePage} onClick={setActivePage} />}
              {canSee('quotes') && <NavItem id="quotes" label="Cotizaciones" icon={<QuotesIcon />} activePage={activePage} onClick={setActivePage} />}
              {canSee('clients') && <NavItem id="clients" label="Clientes" icon={<ClientsIcon />} activePage={activePage} onClick={setActivePage} />}
              {canSee('agents') && <NavItem id="agents" label="Agentes" icon={<AgentsIcon />} activePage={activePage} onClick={setActivePage} />}
            </NavSection>

            <NavSection title="Administración">
              {canSee('tasks') && <NavItem id="tasks" label="Tareas" icon={<TasksIcon />} activePage={activePage} onClick={setActivePage} />}
              {canSee('reports') && <NavItem id="reports" label="Reportes" icon={<ReportsIcon />} activePage={activePage} onClick={setActivePage} />}
              {canSee('users') && <NavItem id="users" label="Usuarios" icon={<UsersIcon />} activePage={activePage} onClick={setActivePage} />}
              {canSee('investments') && <NavItem id="investments" label="Inversiones AI" icon={<InvestmentsIcon />} activePage={activePage} onClick={setActivePage} />}
              {canSee('incentives') && <NavItem id="incentives" label="Incentivos" icon={<ShieldCheckIcon />} activePage={activePage} onClick={setActivePage} />}
              {canSee('security-audit') && <NavItem id="security-audit" label="Seguridad CMF" icon={<ShieldCheckIcon />} activePage={activePage} onClick={setActivePage} />}
            </NavSection>
          </>
        )}
        <div className="px-4 mt-8 mb-6"><button onClick={onOpenAI} className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-black uppercase transition-all shadow-lg active:scale-95">CONSULTAR IA</button></div>
      </nav>

      <div className="p-4 bg-black/20 border-t border-white/5 uppercase">
        <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs shadow-inner uppercase">{role.slice(0,2)}</div>
            <div className="overflow-hidden"><p className="text-[11px] font-bold text-white truncate tracking-tighter">{role}</p><p className="text-[9px] text-slate-500 font-bold">Cloud Ready</p></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;