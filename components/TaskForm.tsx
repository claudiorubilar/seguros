import React, { useState, useEffect } from 'react';
import { Task } from '../types';

interface TaskFormProps {
  taskToEdit?: Task;
  onSubmit: (data: Task | Omit<Task, 'id' | 'status'>) => void;
  onCancel: () => void;
  usersAndAgents: { id: string; name: string }[];
  defaultPolicyId?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel, usersAndAgents, defaultPolicyId, taskToEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedToId: usersAndAgents[0]?.id || '',
    dueDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    policyId: defaultPolicyId,
  });

  useEffect(() => {
    if (taskToEdit) {
        setFormData({
            title: taskToEdit.title,
            description: taskToEdit.description,
            assignedToId: taskToEdit.assignedToId,
            dueDate: new Date(taskToEdit.dueDate).toISOString().split('T')[0],
            policyId: taskToEdit.policyId,
        });
    }
  }, [taskToEdit]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.assignedToId || !formData.dueDate) {
        alert("Por favor, complete todos los campos requeridos.");
        return;
    }

    if (taskToEdit) {
      onSubmit({ ...taskToEdit, ...formData, dueDate: new Date(formData.dueDate) });
    } else {
       onSubmit({
          ...formData,
          dueDate: new Date(formData.dueDate)
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título de la Tarea</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
        />
      </div>
       <div className="grid grid-cols-2 gap-4">
        <div>
            <label htmlFor="assignedToId" className="block text-sm font-medium text-gray-700">Asignar a</label>
            <select
            id="assignedToId"
            name="assignedToId"
            value={formData.assignedToId}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
            >
            {usersAndAgents.map(person => (
                <option key={person.id} value={person.id}>{person.name}</option>
            ))}
            </select>
        </div>
        <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Fecha de Vencimiento</label>
            <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
            />
        </div>
       </div>

      {formData.policyId && (
        <div className="bg-gray-50 p-3 rounded-md border text-sm">
            <p>Esta tarea se vinculará a la póliza <span className="font-semibold text-brand-dark">#{formData.policyId.split('-')[1]}</span>.</p>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-md hover:bg-brand-primary/90 transition-colors"
        >
          {taskToEdit ? 'Guardar Cambios' : 'Crear Tarea'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;