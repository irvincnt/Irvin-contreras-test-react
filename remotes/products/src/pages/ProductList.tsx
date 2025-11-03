import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../interfaces';
import { getProducts } from '../services';

function ProductList(): React.JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredProducts = products.filter((product: Product) =>
    normalizedSearchTerm === ''
      ? true
      : product.title.toLowerCase().includes(normalizedSearchTerm)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-600 text-lg">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg shadow-md p-8 text-center">
        <p className="text-red-600 text-lg">❌ {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors duration-200"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        <label htmlFor="product-search" className="block text-sm font-medium text-gray-700 mb-2">
          Buscar productos
        </label>
        <div className="relative">
          <input
            id="product-search"
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Ingresa el nombre del producto"
            className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
          <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
            🔍
          </span>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">No hay productos disponibles.</p>
        </div>
      ) : filteredProducts.length === 0 && normalizedSearchTerm !== '' ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">
            No se encontraron productos que coincidan con "{searchTerm}".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {filteredProducts.map((product: Product) => (
            <Link
              key={product.id}
              to={`/products/product/${product.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer"
            >
              <div className="bg-white h-64 flex items-center justify-center p-4">
                <img
                  src={product.image}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
                  {product.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-3 flex-1">
                  {product.description}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Categoría:</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs capitalize">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Precio:</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Rating:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm font-semibold">
                        {product.rating.rate}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({product.rating.count})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;

