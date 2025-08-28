import React from 'react';

interface BadgeProps {
  badgeId: string;
  metadata: any;
  size?: 'small' | 'medium' | 'large' | 'huge';
  showName?: boolean;
  className?: string;
}

const BadgeDisplay: React.FC<BadgeProps> = ({ 
  badgeId, 
  metadata, 
  size = 'medium', 
  showName = true, 
  className = '' 
}) => {
  const badge = metadata?.[badgeId];
  
  if (!badge) {
    return null;
  }

  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-sm', 
    large: 'w-16 h-16 text-base',
    huge: 'w-24 h-24 text-xl'
  };

  const colorClasses = {
    gold: 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-500',
    blue: 'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-500',
    green: 'bg-gradient-to-br from-green-400 to-green-600 border-green-500',
    purple: 'bg-gradient-to-br from-purple-400 to-purple-600 border-purple-500',
    red: 'bg-gradient-to-br from-red-400 to-red-600 border-red-500',
    orange: 'bg-gradient-to-br from-orange-400 to-orange-600 border-orange-500',
    cyan: 'bg-gradient-to-br from-cyan-400 to-cyan-600 border-cyan-500',
    yellow: 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-500',
    indigo: 'bg-gradient-to-br from-indigo-400 to-indigo-600 border-indigo-500',
    rainbow: 'bg-gradient-to-br from-pink-400 via-purple-400 via-blue-400 via-green-400 to-yellow-400 border-pink-500'
  };

  const badgeSize = (badge.size || size) as keyof typeof sizeClasses;
  const badgeColor = badge.color as keyof typeof colorClasses;
  const baseClasses = `
    ${sizeClasses[badgeSize]} 
    ${colorClasses[badgeColor] || colorClasses.blue}
    border-2 rounded-full flex items-center justify-center 
    shadow-lg transform hover:scale-110 transition-all duration-300
    cursor-pointer ${className}
  `;

  return (
    <div className="flex flex-col items-center group">
      <div 
        className={baseClasses}
        title={`${badge.name} - ${badge.description}`}
      >
        <span className="text-white font-bold drop-shadow-sm">
          {badge.icon}
        </span>
      </div>
      
      {showName && (
        <div className="mt-1 text-center">
          <div className="text-xs font-semibold text-white group-hover:text-yellow-300 transition-colors">
            {badge.name}
          </div>
          <div className="text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity max-w-32 leading-tight">
            {badge.description}
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeDisplay;
