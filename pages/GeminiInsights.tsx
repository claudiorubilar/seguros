
import React, { useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { getInsights } from '../services/geminiService';
import { InsightsIcon } from '../components/IconComponents';

const GeminiInsights: React.FC = () => {
  const { policies, clients, agents } = useAppData();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleQuery = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResponse('');
    try {
      const result = await getInsights(query, policies, clients, agents);
      setResponse(result);
    } catch (error) {
      setResponse('Ocurrió un error al procesar la solicitud.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const exampleQueries = [
    "¿Qué clientes tienen cuotas vencidas?",
    "¿Cuál es el ramo con mayor prima total?",
    "Resume las pólizas que vencen en los próximos 6 meses.",
    "¿Hay alguna póliza con prima sobre 5,000,000 CLP?"
  ];
  
  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
          <div className="inline-block p-4 bg-brand-primary/10 rounded-full mb-4">
              <InsightsIcon />
          </div>
        <h1 className="text-4xl font-extrabold text-brand-dark">AI Insights</h1>
        <p className="mt-2 text-lg text-brand-text">
          Haga preguntas en lenguaje natural sobre sus datos y obtenga análisis instantáneos.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleQuery()}
            placeholder="Ej: ¿Cuál es el agente con mayores comisiones?"
            className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary transition-shadow"
            disabled={isLoading}
          />
          <button
            onClick={handleQuery}
            disabled={isLoading || !query.trim()}
            className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-md hover:bg-brand-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analizando...
              </>
            ) : (
              'Generar Insight'
            )}
          </button>
        </div>
        <div className="mt-4 text-sm text-gray-500">
            <span className="font-semibold">Sugerencias:</span>
            <div className="flex flex-wrap gap-2 mt-2">
                {exampleQueries.map(ex => (
                    <button key={ex} onClick={() => handleExampleClick(ex)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                        {ex}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {response && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-brand-dark mb-4">Respuesta del Analista IA:</h2>
          <div className="prose max-w-none text-brand-text" dangerouslySetInnerHTML={{ __html: response }}></div>
        </div>
      )}
    </div>
  );
};

export default GeminiInsights;