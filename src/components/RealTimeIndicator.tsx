import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface RealTimeIndicatorProps {
  isConnected: boolean;
  lastUpdate?: number;
  className?: string;
}

export const RealTimeIndicator: React.FC<RealTimeIndicatorProps> = ({
  isConnected,
  lastUpdate,
  className = ''
}) => {
  const formatLastUpdate = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) { // Less than 1 minute
      return 'Just now';
    } else if (diff < 3600000) { // Less than 1 hour
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    } else {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1">
        {isConnected ? (
          <Wifi className="w-4 h-4 text-green-400" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-400" />
        )}
        <span className="text-xs text-gray-400">
          {isConnected ? 'Live' : 'Offline'}
        </span>
      </div>
      
      {lastUpdate && (
        <span className="text-xs text-gray-500">
          Updated {formatLastUpdate(lastUpdate)}
        </span>
      )}
    </div>
  );
};
