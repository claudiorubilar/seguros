
import React from 'react';
import { CsvIcon, ExcelIcon, PdfIcon, PrintIcon } from './IconComponents';
import { exportToCSV, exportToXLSX, exportToPDF, printTable, ExportHeader } from '../utils/exportUtils';

interface ExportButtonsProps {
  data: Record<string, any>[];
  headers: ExportHeader[];
  filenamePrefix: string;
  reportTitle: string;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ data, headers, filenamePrefix, reportTitle }) => {
  const filename = `${filenamePrefix}_${new Date().toLocaleDateString('es-CL').replace(/\//g, '-')}`;

  const buttons = [
    { label: 'CSV', icon: <CsvIcon />, action: () => exportToCSV(data, headers, filename) },
    { label: 'Excel', icon: <ExcelIcon />, action: () => exportToXLSX(data, headers, filename) },
    { label: 'PDF', icon: <PdfIcon />, action: () => exportToPDF(data, headers, filename, reportTitle) },
    { label: 'Imprimir', icon: <PrintIcon />, action: () => printTable(data, headers, reportTitle) },
  ];
  
  return (
    <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-600">Exportar:</span>
        {buttons.map(btn => (
             <button
                key={btn.label}
                onClick={btn.action}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                title={`Exportar a ${btn.label}`}
              >
                {btn.icon}
                <span className="hidden sm:inline">{btn.label}</span>
            </button>
        ))}
    </div>
  );
};

export default ExportButtons;