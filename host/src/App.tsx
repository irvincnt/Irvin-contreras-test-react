import React, { Suspense, lazy, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout';
import SessionManager from './components/SessionManager';
import useAuthStore from './store/authStore';
import NotFound from './pages/NotFound';
import { AuthHandlerProps, ProtectedRouteProps } from './interfaces';

const RickMortyApp = lazy(() => import('rickMorty/RickMortyApp'));
const ProductsApp = lazy(() => import('products/ProductsApp'));
const UploadApp = lazy(() => import('upload/UploadApp'));

function AuthHandler({ children }: AuthHandlerProps): React.ReactElement {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      console.log('Usuario no autenticado, redirigiendo al login...');
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return <>{children}</>;
}

function ProtectedRoute({ children }: ProtectedRouteProps): React.ReactElement {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function App(): React.ReactElement {
  const logout = useAuthStore((state) => state.logout);

  return (
    <Router>
      <AuthHandler>
        <SessionManager />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout onLogout={logout}>
                  <Suspense fallback={
                    <div className="flex items-center justify-center h-screen">
                      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                    </div>
                  }>
                    <Routes>
                      <Route path="/" element={<Navigate to="/rick-morty" replace />} />
                      <Route path="/rick-morty" element={<RickMortyApp />} />
                      <Route path="/products/*" element={<ProductsApp />} />
                      <Route path="/upload" element={<UploadApp />} />
                      <Route path="/404" element={<NotFound />} />
                      <Route path="*" element={<Navigate to="/404" replace />} />
                    </Routes>
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthHandler>
    </Router>
  );
}

export default App;

