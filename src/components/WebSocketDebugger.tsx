import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAuth } from '../contexts/AuthContext';

interface WebSocketDebuggerProps {
  className?: string;
}

export const WebSocketDebugger: React.FC<WebSocketDebuggerProps> = ({ className = '' }) => {
  const { currentUser } = useAuth();
  const [diagnostics, setDiagnostics] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Test WebSocket connection with detailed logging
  const { isConnected, error } = useWebSocket({
    enabled: !!currentUser && isExpanded, // Only connect when debugging is active
    onNotificationCreated: (notif) => {
      setDiagnostics(prev => [...prev, `✅ Received notification: ${notif?.title || 'Unknown'}`]);
    },
    onPrivateMessageReceived: (msg) => {
      setDiagnostics(prev => [...prev, `✅ Received message from: ${msg?.sender?.displayName || 'Unknown'}`]);
    },
    onDiscussionCreated: (data) => {
      setDiagnostics(prev => [...prev, `✅ New discussion created: ${data?.discussion?._id || 'Unknown'}`]);
    }
  });

  useEffect(() => {
    if (isExpanded) {
      setDiagnostics([]);
      // Add initial diagnostic info
      const apiUrl = (import.meta as any)?.env?.VITE_API_URL;
      const mode = (import.meta as any)?.env?.MODE;
      const isProd = (import.meta as any)?.env?.PROD;
      
      setDiagnostics([
        `🔍 Environment: ${mode} (Production: ${isProd})`,
        `🔍 API URL: ${apiUrl || 'Not set'}`,
        `🔍 Current User: ${currentUser?.displayName || 'Not logged in'}`,
        `🔍 Frontend Origin: ${window.location.origin}`,
        `🔍 WebSocket connecting...`
      ]);
    }
  }, [isExpanded, currentUser]);

  useEffect(() => {
    if (isExpanded) {
      if (isConnected) {
        setDiagnostics(prev => [...prev, `✅ WebSocket connected successfully!`]);
      } else if (error) {
        setDiagnostics(prev => [...prev, `❌ WebSocket error: ${error}`]);
      }
    }
  }, [isConnected, error, isExpanded]);

  const testConnection = () => {
    setDiagnostics(prev => [...prev, `🔄 Testing connection...`]);
    // The WebSocket hook will automatically try to reconnect
  };

  const clearLogs = () => {
    setDiagnostics([]);
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg transition-all duration-300 ${
          isConnected 
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-red-500 hover:bg-red-600 text-white'
        }`}
        title="WebSocket Diagnostics"
      >
        {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
        <span className="text-sm font-medium">
          {isConnected ? 'Live' : 'Offline'}
        </span>
      </button>

      {/* Debug Panel */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 w-96 max-w-[90vw] bg-white/95 backdrop-blur-md border border-gray-200 rounded-lg shadow-xl p-4 max-h-80 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
              <Info className="w-5 h-5" />
              <span>WebSocket Debug</span>
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={testConnection}
                className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded"
              >
                Test
              </button>
              <button
                onClick={clearLogs}
                className="px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded"
              >
                Clear
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded"
              >
                ×
              </button>
            </div>
          </div>

          {/* Connection Status */}
          <div className={`flex items-center space-x-2 mb-3 p-2 rounded ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isConnected ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {isConnected ? 'Connected' : error || 'Disconnected'}
            </span>
          </div>

          {/* Diagnostic Logs */}
          <div className="bg-gray-50 rounded p-2 max-h-40 overflow-y-auto">
            <div className="text-xs font-mono space-y-1">
              {diagnostics.length === 0 ? (
                <div className="text-gray-500">No logs yet...</div>
              ) : (
                diagnostics.map((log, index) => (
                  <div key={index} className="break-words">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
            <strong>Usage:</strong> This tool helps debug real-time features. 
            Try sending a message or creating a discussion to see if events are received.
          </div>
        </div>
      )}
    </div>
  );
};