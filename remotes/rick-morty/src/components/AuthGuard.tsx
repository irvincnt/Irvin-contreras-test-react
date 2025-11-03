import React, { useEffect, useState } from 'react';
import { AuthGuardProps, AuthStorageState } from '../interfaces';

function AuthGuard({ children }: AuthGuardProps): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      try {
        const { default: useAuthStore } = await import('host/AuthStore');
        const auth: boolean = useAuthStore.getState().isAuthenticated;
        setIsAuthenticated(auth);
      } catch (error) {
        console.error('No se pudo cargar el store de autenticación desde el host:', error);
        const localStorageAuth: string | null = localStorage.getItem('auth-storage');
        if (localStorageAuth) {
          try {
            const parsed: AuthStorageState = JSON.parse(localStorageAuth);
            setIsAuthenticated(parsed.state?.isAuthenticated || false);
          } catch (e) {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-500 to-pink-500">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600 mb-6">
            Este módulo solo puede ser accedido a través de la aplicación principal.
          </p>
          <a
            href="http://localhost:3000"
            className="inline-block bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 font-semibold"
          >
            Ir a la Aplicación Principal
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthGuard;

