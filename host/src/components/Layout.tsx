import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutProps } from '../interfaces';

function Layout({ children, onLogout }: LayoutProps): React.ReactElement {
  const location = useLocation();

  const isActive = (path: string): boolean => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Irvin Test React
                </span>
              </div>
              
              <div className="sm:flex sm:space-x-4 sm:items-center">
                <Link
                  to="/rick-morty"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive('/rick-morty')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Rick & Morty
                </Link>
                <Link
                  to="/products"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive('/products')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Productos
                </Link>
                <Link
                  to="/upload"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive('/upload')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Upload
                </Link>
              </div>
            </div>

            <div className="flex items-center">
              <button
                onClick={onLogout}
                className="bg-primary text-primary-text border border-primary px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

export default Layout;

