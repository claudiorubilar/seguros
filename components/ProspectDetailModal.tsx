
import React, { useState } from 'react';
import { Prospect, Task, Quote, ActivityLog } from '../types';
import Modal from './Modal';
import { HistoryIcon, TasksIcon, QuotesIcon, PlusIcon } from './IconComponents';

interface ProspectDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    prospect: Prospect;
    tasks: Task[];
    quotes: Quote[];
    onEdit: () => void;
    onDelete: () => void;
    addTask: (newTaskData: Omit<Task, 'id' | 'status'>) => void;
    addQuote: (newQuoteData: Omit<Quote, 'id' | 'quoteNumber' | 'creationDate' | 'status'>) => void;
}

type Tab = 'details' | 'tasks' | 'quotes' | 'history' | 'compliance';

const formatDate = (date: Date, includeTime = false) => {
    if (!date) return 'N/A';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    return new Date(date).toLocaleString('es-CL', options);
};

const formatCLPCurrency = (value: number) => `$${Math.round(value).toLocaleString('es-CL')}`;

const TabButton: React.FC<{ tabId: Tab, label: string, activeTab: Tab, onClick: (tab: Tab) => void }> = ({ tabId, label, activeTab, onClick }) => (
    <button
      onClick={() => onClick(tabId)}
      className={`px-4 py-2 text-sm font-medium transition-colors ${
        activeTab === tabId
          ? 'border-b-2 border-brand-primary text-brand-primary'
          : 'text-gray-500 hover:text-brand-dark border-b-2 border-transparent'
      }`}
    >
      {label}
    </button>
);

const ProspectDetailModal: React.FC<ProspectDetailModalProps> = ({ isOpen, onClose, prospect, tasks, quotes, onEdit, onDelete, addTask, addQuote }) => {
    const [activeTab, setActiveTab] = useState<Tab>('details');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'details':
                return (
                    <div className="space-y-4 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                            <div><p className="text-gray-500">Contacto Principal</p><p className="font-semibold text-brand-dark">{prospect.contact}</p></div>
                            <div><p className="text-gray-500">Email</p><p className="font-semibold text-brand-dark">{prospect.email}</p></div>
                            <div><p className="text-gray-500">Teléfono</p><p className="font-semibold text-brand-dark">{prospect.phone}</p></div>
                            <div><p className="text-gray-500">Agente Asignado</p><p className="font-semibold text-brand-dark">{prospect.agentId}</p></div>
                        </div>
                    </div>
                );
            case 'tasks':
                return (
                     <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {tasks.map(task => (
                            <div key={task.id} className="p-3 bg-gray-50 rounded-md border">
                                <p className="font-semibold text-brand-dark">{task.title}</p>
                                <p className="text-xs text-gray-500">Vence: {formatDate(task.dueDate)}</p>
                            </div>
                        ))}
                        {tasks.length === 0 && <p className="text-center text-gray-500 py-4">No hay tareas asociadas.</p>}
                    </div>
                );
            case 'quotes':
                return (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {quotes.map(quote => (
                            <div key={quote.id} className="p-3 bg-gray-50 rounded-md border flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-brand-dark">{quote.quoteNumber}</p>
                                    <p className="text-xs text-gray-500">{quote.product}</p>
                                </div>
                                <span className="font-semibold">{`${quote.premium.toLocaleString('es-CL')} ${quote.currency}`}</span>
                            </div>
                        ))}
                        {quotes.length === 0 && <p className="text-center text-gray-500 py-4">No hay cotizaciones asociadas.</p>}
                    </div>
                );
            case 'history':
                return (
                    <ul className="space-y-4 max-h-60 overflow-y-auto pr-2">
                        {prospect.activityLog.map(log => (
                            <li key={log.id} className="flex items-start space-x-3">
                                <div className="bg-gray-200 rounded-full p-1.5 mt-1">
                                    <HistoryIcon />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-700">{log.description}</p>
                                    <p className="text-xs text-gray-500">{log.user} - {formatDate(log.date, true)}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                );
        case 'compliance':
            return (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        {/* Nivel de Riesgo con código de colores según documento */}
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Nivel de Riesgo KYC</p>
                            <span className={`px-2 py-1 rounded text-xs font-black uppercase ${
                                prospect.kycLevel === 'Alto' ? 'bg-red-100 text-red-700' : 
                                prospect.kycLevel === 'Medio' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                            }`}>
                                {prospect.kycLevel || 'Bajo'}
                            </span>
                        </div>

                        {/* Indicador PEP [cite: 993] */}
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Persona Expuesta Políticamente (PEP)</p>
                                <p className="text-xs text-slate-700 mt-1">{prospect.isPEP ? 'SÍ' : 'NO'}</p>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${prospect.isPEP ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
                        </div>
                    </div>

                    {/* Consentimiento de Datos GDPR [cite: 967, 1000] */}
                    <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50">
                        <div className="flex items-center gap-3">
                            <input 
                                type="checkbox" 
                                checked={prospect.dataConsent} 
                                readOnly 
                                className="w-4 h-4 text-blue-600 rounded border-gray-300"
                            />
                            <div>
                                <p className="text-sm font-bold text-slate-800">Consentimiento de Privacidad (GDPR/AML)</p>
                                <p className="text-[10px] text-slate-500">
                                    {prospect.dataConsent 
                                        ? `Aceptado el: ${formatDate(prospect.consentDate || new Date())}` 
                                        : 'Pendiente de firma'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Prospecto: ${prospect.name}`} size="2xl">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-lg font-bold text-green-600">{formatCLPCurrency(prospect.pipelineValue)}</p>
                        <p className="text-sm text-gray-500">Valor del Pipeline</p>
                    </div>
                    <span className="px-3 py-1 text-sm font-bold rounded-md bg-blue-100 text-blue-800">{prospect.status}</span>
                </div>
                
                <div className="border-b mb-4">
                    <nav className="-mb-px flex space-x-4">
                        <TabButton tabId="details" label="Detalles" activeTab={activeTab} onClick={setActiveTab} />
                        <TabButton tabId="tasks" label="Tareas" activeTab={activeTab} onClick={setActiveTab} />
                        <TabButton tabId="quotes" label="Cotizaciones" activeTab={activeTab} onClick={setActiveTab} />
                        <TabButton tabId="history" label="Historial" activeTab={activeTab} onClick={setActiveTab} />
                        <TabButton tabId="compliance" label="Cumplimiento" activeTab={activeTab} onClick={setActiveTab} />
                    </nav>
                </div>

                <div className="py-4 min-h-[150px]">
                    {renderTabContent()}
                </div>

                <div className="flex justify-between items-center pt-4 border-t mt-4">
                    <div className="space-x-2">
                         <button onClick={onEdit} className="px-4 py-2 text-sm bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300">Editar</button>
                         <button onClick={onDelete} className="px-4 py-2 text-sm bg-red-100 text-red-700 font-semibold rounded-md hover:bg-red-200">Eliminar</button>
                    </div>
                     <div className="space-x-2">
                        {/* Quick Actions can be added here in the future */}
                    </div>
                    <button onClick={onClose} className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-md hover:bg-brand-primary/90">Cerrar</button>
                </div>
            </div>
        </Modal>
    );
};

export default ProspectDetailModal;
