import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  gradient = false,
  hover = false 
}) => {
  const baseClasses = 'rounded-xl border border-gray-200 shadow-sm';
  const gradientClasses = gradient 
    ? 'bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm' 
    : 'bg-white';
  const hoverClasses = hover ? 'hover:shadow-lg hover:scale-[1.02] transition-all duration-300' : '';
  
  return (
    <div className={`${baseClasses} ${gradientClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`p-6 border-b border-gray-100 ${className}`}>
    {children}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`p-6 border-t border-gray-100 ${className}`}>
    {children}
  </div>
);