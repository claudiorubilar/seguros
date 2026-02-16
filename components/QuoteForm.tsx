import React, { useState, useEffect } from 'react';
import { Quote, Client } from '../types';

interface QuoteFormProps {
  quoteToEdit?: Quote;
  clients: Client[];
  onSubmit: (data: Omit<Quote, 'id' | 'quoteNumber' | 'creationDate' | 'status'> | Quote) => void;
  onCancel: () => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ quoteToEdit, clients, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    clientId: quoteToEdit?.clientId || (clients[0]?.id || ''),
    product: quoteToEdit?.product || '',
    premium: quoteToEdit?.premium || 0,
    currency: quoteToEdit?.currency || 'CLP',
  });

  useEffect(() => {
    if (quoteToEdit) {
      setFormData({
        clientId: quoteToEdit.clientId,
        product: quoteToEdit.product,
        premium: quoteToEdit.premium,
        currency: quoteToEdit.currency,
      });
    }
  }, [quoteToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'number' ? parseFloat(value) : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientId || !formData.product || formData.premium <= 0) {
      alert("Por favor complete todos los campos requeridos.");
      return;
    }
    if (quoteToEdit) {
      onSubmit({ ...quoteToEdit, ...formData });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">Cliente</label>
        <select
          id="clientId"
          name="clientId"
          value={formData.clientId}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
        >
          {clients.map(client => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="product" className="block text-sm font-medium text-gray-700">Producto / Ramo</label>
        <input
          type="text"
          id="product"
          name="product"
          value={formData.product}
          onChange={handleChange}
          required
          placeholder="Ej: Seguro de Vida con Ahorro"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="premium" className="block text-sm font-medium text-gray-700">Prima</label>
          <input
            type="number"
            id="premium"
            name="premium"
            value={formData.premium}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Moneda</label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
          >
            <option value="CLP">CLP</option>
            <option value="UF">UF</option>
          </select>
        </div>
      </div>
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
          {quoteToEdit ? 'Guardar Cambios' : 'Crear Cotización'}
        </button>
      </div>
    </form>
  );
};

export default QuoteForm;