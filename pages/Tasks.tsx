import React, { useState, useMemo } from 'react';
import { useAppData } from '../hooks/useAppData';
import { Task, TaskStatus } from '../types';

// --- ICONOS INTERNOS ---
const IconPlus = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconX = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconCheck = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconClock = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconDrag = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>;
const IconTrash = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;

const Tasks: React.FC = () => {
    const { tasks, agents, users, isLoading, updateTask, addTask, deleteUser } = useAppData(); // Usamos updateTask de tu aplicativo
    const [viewMode, setViewMode] = useState<'kanban' | 'history'>('kanban');
    
    // Estados para el Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const personMap = useMemo(() => {
        const map = new Map();
        [...agents, ...users].forEach(p => map.set(p.id, p.name));
        return map;
    }, [agents, users]);

    const taskStages: { status: TaskStatus; label: string; color: string }[] = [
        { status: 'Pendiente', label: 'Pendientes', color: '#f59e0b' },
        { status: 'En Progreso', label: 'En Ejecución', color: '#3b82f6' },
        { status: 'Completada', label: 'Finalizadas', color: '#10b981' },
    ];

    // --- MANEJO DE MODAL ---
    const openCreateModal = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const openEditModal = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    // --- DRAG & DROP ---
    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        e.dataTransfer.setData("taskId", taskId);
    };

    const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("taskId");
        const taskToMove = tasks.find(t => t.id === taskId);
        if (taskToMove && taskToMove.status !== newStatus) {
            updateTask({ ...taskToMove, status: newStatus });
        }
    };

    if (isLoading) return <div className="p-20 text-center font-900 text-slate-400 animate-pulse text-xl uppercase tracking-widest">Sincronizando Operaciones...</div>;

    return (
        <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500 pb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            
            {/* ACTION BAR */}
            <div className="flex flex-wrap justify-between items-center gap-4 shrink-0">
                <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
                    <button onClick={() => setViewMode('kanban')} className={`px-8 py-2.5 text-[11px] font-900 rounded-xl transition-all uppercase tracking-widest ${viewMode === 'kanban' ? 'bg-[#0f172a] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>Kanban Interactivo</button>
                    <button onClick={() => setViewMode('history')} className={`px-8 py-2.5 text-[11px] font-900 rounded-xl transition-all uppercase tracking-widest ${viewMode === 'history' ? 'bg-[#0f172a] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>Log Histórico</button>
                </div>

                <button onClick={openCreateModal} className="flex items-center gap-3 px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-800 text-xs shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all uppercase tracking-widest active:scale-95">
                    <IconPlus /> Nueva Tarea
                </button>
            </div>

            {viewMode === 'kanban' ? (
                /* VISTA KANBAN */
                <div className="flex gap-6 flex-1 min-h-0 overflow-hidden">
                    {taskStages.map(stage => {
                        const stageTasks = tasks.filter(t => t.status === stage.status && !t.isArchived);
                        return (
                            <div key={stage.status} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, stage.status)} className="flex-1 flex flex-col min-w-[320px] group">
                                <div className="bg-[#0f172a] rounded-t-[2.5rem] p-5 border-b-4" style={{ borderBottomColor: stage.color }}>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: stage.color }}></div>
                                            <h3 className="text-[12px] font-900 text-white uppercase tracking-[0.2em]">{stage.label}</h3>
                                        </div>
                                        <span className="bg-white/10 text-white text-[11px] font-900 px-3 py-1 rounded-xl border border-white/10">{stageTasks.length}</span>
                                    </div>
                                </div>
                                <div className="bg-slate-50/50 flex-1 p-4 space-y-4 border-x border-b border-slate-200 rounded-b-[2.5rem] transition-colors group-hover:bg-slate-100/50 overflow-y-auto custom-scrollbar">
                                    {stageTasks.map(task => {
                                        const dueDate = new Date(task.dueDate);
                                        const isOverdue = dueDate < new Date() && stage.status !== 'Completada';
                                        return (
                                            <div 
                                                key={task.id} 
                                                draggable="true" 
                                                onDragStart={(e) => handleDragStart(e, task.id)}
                                                onClick={() => openEditModal(task)}
                                                className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-200 hover:shadow-xl hover:scale-[1.02] transition-all cursor-grab active:cursor-grabbing group/card relative overflow-hidden"
                                            >
                                                <div className={`absolute top-0 left-0 w-1.5 h-full ${isOverdue ? 'bg-rose-500' : 'bg-blue-400'}`}></div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-800 text-slate-800 text-[14px] leading-tight uppercase tracking-tighter group-hover/card:text-blue-600 transition-colors pr-4">{task.title}</h4>
                                                    <div className="text-slate-300 group-hover/card:text-slate-500 transition-colors"><IconDrag /></div>
                                                </div>
                                                <p className="text-[12px] font-600 text-slate-500 leading-relaxed mb-5 italic">{task.description}</p>
                                                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-xl bg-[#0f172a] text-white flex items-center justify-center text-[10px] font-900 shadow-lg border border-white/10">{personMap.get(task.assignedToId)?.slice(0,2).toUpperCase()}</div>
                                                        <span className="text-[11px] font-800 text-slate-600 uppercase tracking-tighter">{personMap.get(task.assignedToId)?.split(' ')[0]}</span>
                                                    </div>
                                                    <div className={`flex items-center gap-1.5 text-[11px] font-900 px-3 py-1 rounded-lg ${isOverdue ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200' : 'bg-slate-100 text-slate-500'}`}><IconClock /> {dueDate.toLocaleDateString('es-CL', {day:'2-digit', month:'short'})}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* VISTA HISTORIAL */
                <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex-1 min-h-0 overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#0f172a] text-white sticky top-0 z-10">
                            <tr className="text-[11px] font-900 uppercase tracking-widest"><th className="px-8 py-5">Fecha Cierre</th><th className="px-8 py-5">Tarea</th><th className="px-8 py-5">Responsable</th><th className="px-8 py-5 text-right uppercase">Estado</th></tr>
                        </thead>
                        <tbody className="text-[14px] font-600 text-slate-700">
                            {tasks.filter(t => t.status === 'Completada').map(t => (
                                <tr key={t.id} className="border-b border-slate-100 hover:bg-blue-50/50 transition-all even:bg-slate-50/30">
                                    <td className="px-8 py-4 font-800 text-slate-400">{new Date(t.dueDate).toLocaleDateString()}</td>
                                    <td className="px-8 py-4 font-800 text-slate-900 uppercase tracking-tight">{t.title}</td>
                                    <td className="px-8 py-4 font-700 text-slate-500 italic">{personMap.get(t.assignedToId)}</td>
                                    <td className="px-8 py-4 text-right"><span className="status-pill status-pagada">Finalizada</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL: CREAR / EDITAR TAREA (FUSIÓN PREMIUM) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/20">
                        <div className="bg-[#0f172a] p-10 text-white relative">
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400"><IconX /></button>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20 text-white">{editingTask ? <IconCheck /> : <IconPlus />}</div>
                                <div>
                                    <h3 className="text-3xl font-900 uppercase tracking-tighter italic leading-none">{editingTask ? 'Editar Tarea' : 'Nueva Operación'}</h3>
                                    <p className="text-blue-400 text-xs font-800 uppercase tracking-[0.2em] mt-1">{editingTask ? 'Modificación de registro' : 'Asignación de Tareas'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 space-y-6 text-left">
                            <div className="space-y-1.5 text-left">
                                <label className="text-[10px] font-900 text-slate-400 uppercase tracking-widest ml-1">Título de la Tarea</label>
                                <input type="text" defaultValue={editingTask?.title || ""} placeholder="Ej: Auditoría Mon key Adventure" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-700 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner uppercase" />
                            </div>
                            <div className="space-y-1.5 text-left">
                                <label className="text-[10px] font-900 text-slate-400 uppercase tracking-widest ml-1">Descripción Breve</label>
                                <textarea rows={2} defaultValue={editingTask?.description || ""} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-700 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner" placeholder="Instrucciones para el equipo..."></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-6 text-left">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-900 text-slate-400 uppercase tracking-widest ml-1">Asignar a</label>
                                    <select defaultValue={editingTask?.assignedToId || ""} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-700 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner">
                                        {[...agents, ...users].map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-900 text-slate-400 uppercase tracking-widest ml-1">Vencimiento</label>
                                    <input type="date" defaultValue={editingTask ? new Date(editingTask.dueDate).toISOString().split('T')[0] : ""} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-700 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner" />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6">
                                {editingTask && (
                                    <button className="px-6 bg-rose-50 text-rose-600 rounded-2xl font-800 text-[11px] uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center justify-center gap-2">
                                        <IconTrash /> Eliminar
                                    </button>
                                )}
                                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-800 text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all">Cancelar</button>
                                <button className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-800 text-[11px] uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-600/30 transition-all active:scale-95">{editingTask ? 'Guardar Cambios' : 'Asignar Tarea'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tasks;