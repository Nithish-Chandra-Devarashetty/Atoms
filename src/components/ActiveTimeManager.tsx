import React from 'react';
import { useActiveTime } from '../hooks/useActiveTime';

export const ActiveTimeManager: React.FC = () => {
  // Send a heartbeat every 30 seconds when authenticated and tab is active
  useActiveTime(30);
  return null;
};
