
import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  children: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, description, children }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
      <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-full">
        {children}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-brand-dark">{value}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default DashboardCard;