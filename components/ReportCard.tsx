import React from 'react';

interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, description, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer border-l-4 border-brand-primary">
      <div className="flex items-start space-x-4">
        <div className="text-brand-primary">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-brand-dark mb-1">{title}</h3>
          <p className="text-sm text-brand-text">{description}</p>
        </div>
      </div>
       <div className="text-right mt-4">
            <button className="text-sm font-semibold text-brand-primary hover:text-brand-dark">
                Ver Reporte &rarr;
            </button>
        </div>
    </div>
  );
};

export default ReportCard;
