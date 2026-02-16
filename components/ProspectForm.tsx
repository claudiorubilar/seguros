
import React, { useState, useEffect } from 'react';
import { Prospect, Agent } from '../types';

interface ProspectFormProps {
  prospectToEdit?: Prospect;
  agents: Agent[];
  onSubmit: (data: Omit<Prospect, 'id' | 'status' | 'lastContacted' | 'attachments' | 'activityLog'> | Prospect) => void;
  onCancel: () => void;
}

const ProspectForm: React.FC<ProspectFormProps> = ({ prospectToEdit, agents, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    agentId: agents[0]?.id || '',
    pipelineValue: 0,
  });

  useEffect(() => {
    if (prospectToEdit) {
      setFormData({
        name: prospectToEdit.name,
        contact: prospectToEdit.contact,
        email: prospectToEdit.email,
        phone: prospectToEdit.phone,
        agentId: prospectToEdit.agentId,
        pipelineValue: prospectToEdit.pipelineValue,
      });
    }
  }, [prospectToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'number' ? parseFloat(value) : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prospectToEdit) {
      onSubmit({ ...prospectToEdit, ...formData });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Prospecto</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Persona de Contacto</label>
            <input type="text" name="contact" id="contact" value={formData.contact} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
        </div>
        <div>
            <label htmlFor="agentId" className="block text-sm font-medium text-gray-700">Agente Asignado</label>
            <select name="agentId" id="agentId" value={formData.agentId} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary">
                {agents.map(agent => <option key={agent.id} value={agent.id}>{agent.name}</option>)}
            </select>
        </div>
      </div>
       <div className="grid grid-cols-2 gap-4">
         <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
        </div>
        <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
        </div>
      </div>
      <div>
        <label htmlFor="pipelineValue" className="block text-sm font-medium text-gray-700">Valor Estimado del Pipeline (CLP)</label>
        <input type="number" name="pipelineValue" id="pipelineValue" value={formData.pipelineValue} onChange={handleChange} required min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300">Cancelar</button>
        <button type="submit" className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-md hover:bg-brand-primary/90">{prospectToEdit ? 'Guardar Cambios' : 'Crear Prospecto'}</button>
      </div>
    </form>
  );
};

export default ProspectForm;
