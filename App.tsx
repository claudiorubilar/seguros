import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Policies from './pages/Policies';
import Agents from './pages/Agents';
import Clients from './pages/Clients';
import Collections from './pages/Collections';
import Users from './pages/Users';
import Claims from './pages/Claims';
import Quotes from './pages/Quotes';
import SalesWorkflow from './pages/SalesWorkflow';
import Tasks from './pages/Tasks';
import Reports from './pages/Reports';
import Commissions from './pages/Commissions';
import AgentPortal from './pages/AgentPortal';
import Login from './pages/Login';
import Investments from './pages/Investments';
import Incentives from './pages/Incentives';
import SaasDashboard from './pages/SaasDashboard';
import Brokerages from './pages/Brokerages';
import SaasAccounting from './pages/SaasAccounting';
import Plans from './pages/Plans';
import SecurityAudit from './pages/SecurityAudit';
import AIAssistantChat from './components/AIAssistantChat';

export type Page = 
  | 'dashboard' | 'policies' | 'agents' | 'clients' 
  | 'collections' | 'users' | 'claims' | 'quotes' 
  | 'sales-workflow' | 'tasks' | 'reports' | 'commissions' 
  | 'agent-portal' | 'investments' | 'incentives' | 'security-audit'
  | 'saas-dashboard' | 'brokerages' | 'plans' | 'saas-accounting';

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard de Gestión', policies: 'Gestión de Pólizas', agents: 'Rendimiento de Agentes',
  clients: 'Gestión de Clientes', collections: 'Gestión de Cobranza', users: 'Gestión de Usuarios',
  claims: 'Gestión de Siniestros', quotes: 'Gestión de Cotizaciones', 'sales-workflow': 'Workflow de Ventas (CRM)',
  tasks: 'Gestión de Tareas', reports: 'Central de Reportes', commissions: 'Gestión de Comisiones',
  'agent-portal': 'Portal de Agente', investments: 'Gestión de Inversiones AI', incentives: 'Incentivos y Metas',
  'security-audit': 'Auditoría de Seguridad CMF', 'saas-dashboard': 'SaaS Monitor | Innosoft HQ',
  'brokerages': 'Control de Corredoras', 'plans': 'Gestión de Planes', 'saas-accounting': 'Contabilidad SaaS',
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<{ role: string, email: string } | null>(null);
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPrivacyActive, setIsPrivacyActive] = useState(false);

  const handleLogin = (role: string, email: string) => {
    setCurrentUser({ role, email });
    if (role === 'SuperAdmin') setActivePage('saas-dashboard');
    else if (role === 'Agente') setActivePage('agent-portal');
    else if (role === 'Cobranza') setActivePage('collections');
    else setActivePage('dashboard');
  };

  const renderPage = () => {
    const commonProps = { isPrivacyActive };

    if (currentUser?.role === 'SuperAdmin') {
      switch (activePage) {
        case 'brokerages': return <Brokerages />;
        case 'plans': return <Plans />;
        case 'saas-accounting': return <SaasAccounting />;
        case 'users': return <Users />;
        default: return <SaasDashboard />;
      }
    }

    switch (activePage) {
      case 'dashboard': return <Dashboard {...commonProps} />;
      case 'policies': return <Policies {...commonProps} />;
      case 'agents': return <Agents />;
      case 'clients': return <Clients {...commonProps} />;
      case 'collections': return <Collections {...commonProps} />;
      case 'users': return <Users />;
      case 'claims': return <Claims {...commonProps} />;
      case 'quotes': return <Quotes {...commonProps} />;
      case 'sales-workflow': return <SalesWorkflow />;
      case 'tasks': return <Tasks />;
      case 'reports': return <Reports />;
      case 'commissions': return <Commissions {...commonProps} />;
      case 'agent-portal': return <AgentPortal />;
      case 'investments': return <Investments />;
      case 'incentives': return <Incentives />;
      case 'security-audit': return <SecurityAudit />;
      default: return <Dashboard {...commonProps} />;
    }
  };

  if (!currentUser) return <Login onLogin={handleLogin} />;

  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className={`fixed inset-0 z-[60] transition-all duration-300 lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className="relative w-60 h-full shadow-2xl">
          <Sidebar activePage={activePage} setActivePage={(p) => { setActivePage(p); setIsMobileMenuOpen(false); }} role={currentUser.role} onOpenAI={() => setIsAIChatOpen(true)} />
        </div>
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header 
          title={pageTitles[activePage]} 
          onLogout={() => setCurrentUser(null)} 
          onMenuClick={() => setIsMobileMenuOpen(true)}
          isPrivacyActive={isPrivacyActive}
          setIsPrivacyActive={setIsPrivacyActive}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 relative custom-scrollbar">
          {renderPage()}
        </main>
        <AIAssistantChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
      </div>
    </div>
  );
};

export default App;