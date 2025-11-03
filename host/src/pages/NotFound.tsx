import React from 'react';
import { Link } from 'react-router-dom';

function NotFound(): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
      <div>
        <p className="text-sm uppercase tracking-widest text-blue-600 font-semibold">Error 404</p>
        <h1 className="mt-2 text-4xl font-bold text-gray-900">Página no encontrada</h1>
        <p className="mt-3 text-gray-600 max-w-lg">
          La ruta que intentas visitar no existe o fue movida. Revisa la URL o regresa al inicio para continuar navegando.
        </p>
      </div>

      <div className="flex space-x-3">
        <Link
          to="/rick-morty"
          className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Ir al inicio
        </Link>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center px-6 py-3 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          Regresar
        </button>
      </div>
    </div>
  );
}

export default NotFound;

