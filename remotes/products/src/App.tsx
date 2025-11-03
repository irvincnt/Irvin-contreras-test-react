import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ProductList from './pages/ProductList';
import CreateProduct from './pages/CreateProduct';
import ProductDetail from './pages/ProductDetail';
import AuthGuard from './components/AuthGuard';
import './index.css';

function App(): React.ReactElement {
  return (
    <AuthGuard>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Productos</h1>
            <Link
              to="/products/create-producto"
              className="bg-primary text-primary-text border  px-6 py-2 rounded-lg font-semibold"
            >
              Crear producto
            </Link>
          </div>
        </div>


        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/create-producto" element={<CreateProduct />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </div>
    </AuthGuard>
  );
}

export default App;

