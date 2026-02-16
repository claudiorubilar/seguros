import React from 'react';
import { Page } from '../App';
import { 
    DashboardIcon, PoliciesIcon, AgentsIcon, InsightsIcon, LogoIcon, 
    ClientsIcon, CollectionsIcon, UsersIcon, ClaimsIcon, QuotesIcon, 
    CRMIcon, TasksIcon, ReportsIcon, CommissionsIcon, ShieldCheckIcon, 
    InvestmentsIcon 
} from './IconComponents';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const NavItem: React.FC<{
    item: { id: Page; label: string; icon: React.ReactElement };
    activePage: Page;
    onClick: (page: Page) => void;
}> = ({ item, activePage, onClick }) => (
    <button
        onClick={() => onClick(item.id)}
        className={`w-full flex items-center p-3 my-0.5 rounded-xl transition-all duration-200 group ${
        activePage === item.id
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
            : 'hover:bg-white/10 text-slate-400 hover:text-white'
        }`}
    >
        <span className={`${activePage === item.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`}>
            {item.icon}
        </span>
        <span className="hidden lg:block ml-3 font-bold text-[11px] uppercase tracking-wider">{item.label}</span>
    </button>
);

const NavSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h2 className="hidden lg:block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-3 mb-2">{title}</h2>
        <div className="space-y-0.5">
            {children}
        </div>
    </div>
);

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const sections = [
    {
      title: "Operaciones",
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
        { id: 'policies', label: 'Pólizas', icon: <PoliciesIcon /> },
        { id: 'collections', label: 'Cobranza', icon: <CollectionsIcon /> },
        { id: 'claims', label: 'Siniestros', icon: <ClaimsIcon /> },
        { id: 'commissions', label: 'Comisiones', icon: <CommissionsIcon /> },
      ]
    },
    {
      title: "Ventas y CRM",
      items: [
        { id: 'sales-workflow', label: 'Workflow', icon: <CRMIcon /> },
        { id: 'quotes', label: 'Cotizaciones', icon: <QuotesIcon /> },
        { id: 'clients', label: 'Clientes', icon: <ClientsIcon /> },
        { id: 'agents', label: 'Agentes', icon: <AgentsIcon /> },
      ]
    },
    {
      title: "Gestión",
      items: [
        { id: 'tasks', label: 'Tareas', icon: <TasksIcon /> },
        { id: 'reports', label: 'Reportes', icon: <ReportsIcon /> },
        { id: 'users', label: 'Usuarios', icon: <UsersIcon /> },
        { id: 'investments', label: 'Inversiones', icon: <InvestmentsIcon /> },
      ]
    }
  ];

  return (
    <div className="bg-[#0f172a] text-white w-20 lg:w-60 flex flex-col shrink-0 z-50 shadow-2xl transition-all duration-300">
      <div className="flex items-center p-6 h-20 border-b border-white/5">
        <LogoIcon />
        <h1 className="hidden lg:block ml-3 text-lg font-black tracking-tighter italic uppercase">
          Broker<span className="text-blue-500">Center</span>
        </h1>
      </div>
      
      <nav className="flex-1 px-3 py-6 custom-scrollbar overflow-y-auto">
        {sections.map(section => (
          <NavSection key={section.title} title={section.title}>
            {section.items.map(item => (
              <NavItem 
                key={item.id} 
                item={item as any} 
                activePage={activePage} 
                onClick={setActivePage} 
              />
            ))}
          </NavSection>
        ))}

        <div className="mt-8 pt-6 border-t border-white/5">
            <h2 className="hidden lg:block text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] px-3 mb-3">Inteligencia AI</h2>
            <button
                onClick={() => setActivePage('insights')}
                className={`w-full flex items-center p-3 rounded-xl transition-all ${
                    activePage === 'insights' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 shadow-inner'
                }`}
            >
                <InsightsIcon />
                <span className="hidden lg:block ml-3 font-black text-[11px] uppercase tracking-widest">AI Insights</span>
            </button>
        </div>
      </nav>

      <div className="p-4 bg-black/20 border-t border-white/5">
        <button onClick={() => setActivePage('agent-portal')} className="w-full flex items-center p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all">
            <ShieldCheckIcon />
            <span className="hidden lg:block ml-3 text-[10px] font-bold uppercase tracking-tighter">Portal Agente</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;