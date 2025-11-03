import { useEffect, useRef } from 'react';
import useAuthStore from '../store/authStore';

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutos 

function SessionManager(): null {
  const { isAuthenticated, updateActivity, logout, checkSession } = useAuthStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetInactivityTimer = (): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    updateActivity();

    timeoutRef.current = setTimeout(() => {
      console.log('Sesión cerrada por inactividad');
      logout();
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    const sessionValid: boolean = checkSession();
    if (!sessionValid) {
      console.log('Sesión expirada al cargar la aplicación');
      return;
    }

    const events: string[] = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    events.forEach((event: string) => {
      window.addEventListener(event, resetInactivityTimer);
    });

    resetInactivityTimer();

    return () => {
      events.forEach((event: string) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isAuthenticated, updateActivity, logout, checkSession]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval: NodeJS.Timeout = setInterval(() => {
      const sessionValid: boolean = checkSession();
      console.log('sessionValid', sessionValid, { interval });
      if (!sessionValid) {
        console.log('Sesión expirada en verificación periódica');
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [isAuthenticated, checkSession]);

  return null;
}

export default SessionManager;

