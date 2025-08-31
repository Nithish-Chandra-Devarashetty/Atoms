import { useEffect, useRef } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// Sends a heartbeat every intervalSeconds when the tab is active and user is logged in
export function useActiveTime(intervalSeconds = 30) {
  const { currentUser } = useAuth();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const isActive = () => document.visibilityState === 'visible' && document.hasFocus();

    const tick = async () => {
      if (!currentUser) return;
      if (!isActive()) return;
      try {
        await apiService.heartbeat(intervalSeconds);
      } catch (e) {
        // Silent fail; network hiccups shouldn't spam console
      }
    };

    const start = () => {
      if (timerRef.current !== null) return;
      // Call once immediately if active
      tick();
      timerRef.current = window.setInterval(tick, intervalSeconds * 1000);
    };

    const stop = () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    if (currentUser) start();

    const onVisibility = () => {
      if (currentUser && isActive()) tick();
    };
    window.addEventListener('focus', onVisibility);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      window.removeEventListener('focus', onVisibility);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [currentUser, intervalSeconds]);
}
