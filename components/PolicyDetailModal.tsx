
import React, { useState, useMemo } from 'react';
import { Policy, Task, User, Agent } from '../types';
import Modal from './Modal';
import { AttachmentIcon, BellIcon, FileDocIcon, FileImageIcon, FilePdfIcon, HistoryIcon, PoliciesIcon, TasksIcon } from './IconComponents';
import TaskForm from './TaskForm';

interface PolicyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: Policy & { clientName?: string, agentName?: string, insurerName?: string, relatedTasks?: Task[] };
  addTask: (newTaskData: Omit<Task, 'id' | 'status'>) => void;
  users: User[];
  agents: Agent[];
}

type Tab = 'summary' | 'installments' | 'attachments' | 'tasks' | 'history';

const PolicyDetailModal: React.FC<PolicyDetailModalProps> = ({ isOpen, onClose, policy, addTask, users, agents }) => {
  const [activeTab, setActiveTab] = useState<Tab>('summary');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const usersAndAgents = useMemo(() => {
    const combined = [
        ...users.map(u => ({ id: u.id, name: `${u.name} (Usuario)` })),
        ...agents.map(a => ({ id: a.id, name: `${a.name} (Agente)` }))
    ];
    return combined.sort((a, b) => a.name.localeCompare(b.name));
  }, [users, agents]);

  if (!isOpen) return null;

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'status'>) => {
    addTask(newTaskData);
    setIsTaskModalOpen(false);
  };
  
  const formatDate = (date?: Date, includeTime = false) => {
    if (!date) return 'N/A';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    return new Date(date).toLocaleString('es-CL', options);
  };
  
  const formatCurrency = (amount: number, currency: 'CLP' | 'UF') => {
    if (currency === 'CLP') return `$${amount.toLocaleString('es-CL')}`;
    return `${amount.toLocaleString('es-CL')} UF`;
  };
  
  const statusBadge = (status: string, baseClasses = "px-2 py-1 text-xs font-semibold rounded-full") => {
    const statusMap: Record<string, string> = {
      'VIGENTE': `${baseClasses} bg-green-100 text-green-800`,
      'VENCIDA': `${baseClasses} bg-red-100 text-red-800`,
      'CANCELADA': `${baseClasses} bg-gray-100 text-gray-800`,
      'Pagada': `${baseClasses} bg-green-100 text-green-800`,
      'Pendiente': `${baseClasses} bg-yellow-100 text-yellow-800`,
      'En Progreso': `${baseClasses} bg-blue-100 text-blue-800`,
      'Completada': `${baseClasses} bg-green-100 text-green-800`,
      'Renovada': `${baseClasses} bg-blue-100 text-blue-800`,
      'No Renovada': `${baseClasses} bg-gray-200 text-gray-800`,
    };
    return statusMap[status] || `${baseClasses} bg-gray-200 text-gray-800`;
  };

  const getFileIcon = (fileType: 'pdf' | 'image' | 'doc') => {
    switch(fileType) {
        case 'pdf': return <FilePdfIcon />;
        case 'image': return <FileImageIcon />;
        case 'doc': return <FileDocIcon />;
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4 text-sm">
            <div><p className="text-gray-500">Contratante</p><p className="font-semibold text-brand-dark">{policy.clientName}</p></div>
            <div><p className="text-gray-500">Agente</p><p className="font-semibold text-brand-dark">{policy.agentName}</p></div>
            <div><p className="text-gray-500">Compañía</p><p className="font-semibold text-brand-dark">{policy.insurerName}</p></div>
            <div><p className="text-gray-500">Vigencia</p><p className="font-semibold text-brand-dark">{formatDate(policy.startDate)} - {formatDate(policy.endDate)}</p></div>
            <div><p className="text-gray-500">Prima Total</p><p className="font-semibold text-brand-dark">{formatCurrency(policy.totalPremium, policy.currency)}</p></div>
            <div><p className="text-gray-500">Estado Renovación</p><p className="font-semibold text-brand-dark"><span className={statusBadge(policy.renewalStatus)}>{policy.renewalStatus}</span></p></div>
          </div>
        );
      case 'installments':
        return (
          <div className="max-h-60 overflow-y-auto border rounded-lg">
            <table className="w-full text-sm text-left text-brand-text">
              <thead className="text-xs text-brand-dark uppercase bg-brand-light sticky top-0">
                <tr>
                  <th scope="col" className="px-4 py-2">N° Cuota</th>
                  <th scope="col" className="px-4 py-2">Vencimiento</th>
                  <th scope="col" className="px-4 py-2">Fecha Pago</th>
                  <th scope="col" className="px-4 py-2 text-right">Monto</th>
                  <th scope="col" className="px-4 py-2 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {policy.installments.map((inst) => (
                  <tr key={inst.id} className="border-b last:border-b-0">
                    <td className="px-4 py-2 font-medium">{inst.installmentNumber}/{inst.totalInstallments}</td>
                    <td className="px-4 py-2">{formatDate(inst.dueDate)}</td>
                    <td className="px-4 py-2">{formatDate(inst.paymentDate)}</td>
                    <td className="px-4 py-2 text-right font-semibold">{formatCurrency(inst.totalAmount, inst.currency)}</td>
                    <td className="px-4 py-2 text-center"><span className={statusBadge(inst.status)}>{inst.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'attachments':
        return (
            <div>
                <div className="flex justify-end mb-4">
                    <button className="px-4 py-2 bg-brand-primary text-white text-sm font-semibold rounded-md hover:bg-brand-primary/90">
                        + Subir Archivo
                    </button>
                </div>
                <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {policy.attachments.map(file => (
                        <li key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                            <div className="flex items-center space-x-3">
                                {getFileIcon(file.fileType)}
                                <div>
                                    <a href="#" className="font-semibold text-brand-primary hover:underline">{file.filename}</a>
                                    <p className="text-xs text-gray-500">Subido el: {formatDate(file.uploadedAt)}</p>
                                </div>
                            </div>
                            <button className="text-xs font-medium text-gray-600 hover:text-red-600">Eliminar</button>
                        </li>
                    ))}
                     {policy.attachments.length === 0 && <p className="text-center text-gray-500 py-4">No hay archivos adjuntos.</p>}
                </ul>
            </div>
        );
      case 'tasks':
        return (
            <div>
                 <div className="flex justify-end mb-4">
                    <button 
                        onClick={() => setIsTaskModalOpen(true)}
                        className="px-4 py-2 bg-brand-primary text-white text-sm font-semibold rounded-md hover:bg-brand-primary/90"
                    >
                        + Nueva Tarea
                    </button>
                </div>
                <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {(policy.relatedTasks || []).map(task => (
                        <li key={task.id} className="p-3 bg-gray-50 rounded-md border">
                            <div className="flex justify-between items-start">
                                <p className="font-semibold text-brand-dark">{task.title}</p>
                                <span className={statusBadge(task.status)}>{task.status}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        </li>
                    ))}
                    {(policy.relatedTasks || []).length === 0 && <p className="text-center text-gray-500 py-4">No hay tareas asociadas.</p>}
                </ul>
            </div>
        );
      case 'history':
        return (
             <ul className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {policy.activityLog.map(log => (
                    <li key={log.id} className="flex items-start space-x-3">
                        <div className="bg-gray-200 rounded-full p-2 mt-1">
                            <HistoryIcon />
                        </div>
                        <div>
                            <p className="text-sm text-gray-700">{log.description}</p>
                            <p className="text-xs text-gray-500">{log.user} - {formatDate(log.date, true)}</p>
                        </div>
                    </li>
                ))}
                 {policy.activityLog.length === 0 && <p className="text-center text-gray-500 py-4">No hay historial de actividad.</p>}
            </ul>
        );
      default:
        return null;
    }
  };

  const TabButton: React.FC<{ tabId: Tab, label: string }> = ({ tabId, label }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`px-4 py-2 text-sm font-medium transition-colors ${
        activeTab === tabId
          ? 'border-b-2 border-brand-primary text-brand-primary'
          : 'text-gray-500 hover:text-brand-dark border-b-2 border-transparent'
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
    <Modal isOpen={isOpen} onClose={onClose} title={`Detalle Póliza #${policy.policyNumber}`} size="3xl">
      <div>
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-lg font-bold text-brand-dark">{policy.product}</h3>
                <p className="text-sm text-gray-500">{policy.lineOfBusiness}</p>
            </div>
            <span className={statusBadge(policy.status, "px-3 py-1 text-sm font-bold rounded-md")}>{policy.status}</span>
        </div>
        
        <div className="border-b mb-4">
            <nav className="-mb-px flex space-x-4">
                <TabButton tabId="summary" label="Resumen" />
                <TabButton tabId="installments" label="Cuotas" />
                <TabButton tabId="attachments" label="Archivos" />
                <TabButton tabId="tasks" label="Tareas" />
                <TabButton tabId="history" label="Historial" />
            </nav>
        </div>

        <div className="py-4 min-h-[220px]">
            {renderTabContent()}
        </div>

        <div className="flex justify-end pt-4 border-t mt-4">
            <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors"
            >
                Cerrar
            </button>
        </div>
      </div>
    </Modal>
     {isTaskModalOpen && (
        <Modal
            isOpen={isTaskModalOpen}
            onClose={() => setIsTaskModalOpen(false)}
            title={`Nueva Tarea para Póliza #${policy.policyNumber}`}
        >
            <TaskForm 
                onSubmit={handleAddTask}
                onCancel={() => setIsTaskModalOpen(false)}
                usersAndAgents={usersAndAgents}
                defaultPolicyId={policy.id}
            />
        </Modal>
     )}
    </>
  );
};

export default PolicyDetailModal;