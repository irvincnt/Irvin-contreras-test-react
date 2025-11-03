import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../interfaces';
import { getProductById } from '../services';

function ProductDetail(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductDetail = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const productData = await getProductById(id || '');
        setProduct(productData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error('Error fetching product detail:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-600 text-lg">Cargando detalle del producto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg shadow-md p-8 text-center">
        <p className="text-red-600 text-lg">❌ {error || 'Producto no encontrado'}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors duration-200"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          Volver a la lista
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <div className="flex items-center justify-center bg-gray-50 rounded-lg p-8">
            <img
              src={product.image}
              alt={product.title}
              className="max-h-96 max-w-full object-contain"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm capitalize mb-4">
                  {product.category}
                </span>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  {product.title}
                </h1>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center gap-3 py-4 border-t border-b border-gray-200">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-xl">⭐</span>
                  <span className="text-2xl font-bold text-gray-800">
                    {product.rating.rate}
                  </span>
                  <span className="text-gray-500">/ 5</span>
                </div>
                <span className="text-gray-500">
                  ({product.rating.count} valoraciones)
                </span>
              </div>

              <div>
                <p className="text-gray-600 text-sm mb-2">Precio:</p>
                <p className="text-5xl font-bold text-green-600">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </div>


          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Información adicional</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600 text-sm mb-1">ID del producto</p>
            <p className="text-gray-800 font-semibold">#{product.id}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600 text-sm mb-1">Categoría</p>
            <p className="text-gray-800 font-semibold capitalize">{product.category}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600 text-sm mb-1">Disponibilidad</p>
            <p className="text-green-600 font-semibold">En stock</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;

