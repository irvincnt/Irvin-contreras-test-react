import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CreateProductFormValues } from '../interfaces';
import { createProduct } from '../services';

function CreateProduct(): React.JSX.Element {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductFormValues>({
    defaultValues: {
      title: '',
      price: '',
      description: '',
      image: '',
      category: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (values: CreateProductFormValues): Promise<void> => {
    setApiError(null);

    try {
      await createProduct({
        title: values.title.trim(),
        price: Number(values.price),
        description: values.description.trim(),
        image: values.image.trim(),
        category: values.category,
      });
      reset();

      navigate('/products', { replace: true });
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido al crear el producto.';
      setApiError(message);
      console.error('Error creating product:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear Nuevo Producto</h2>

        {apiError && (
          <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              id="title"
              {...register('title', {
                required: 'El título es obligatorio.',
                pattern: {
                  value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                  message: 'Solo se permiten letras y espacios.',
                },
                minLength: {
                  value: 3,
                  message: 'El título debe tener al menos 3 caracteres.',
                },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ej: Nuevo producto"
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              id="description"
              rows={3}
              {...register('description', {
                required: 'La descripción es obligatoria.',
                pattern: {
                  value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                  message: 'Solo se permiten letras y espacios.',
                },
                minLength: {
                  value: 10,
                  message: 'La descripción debe tener al menos 10 caracteres.',
                },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Describe el producto..."
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Precio ($) *
              </label>
              <input
                type="text"
                id="price"
                {...register('price', {
                  required: 'El precio es obligatorio.',
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: 'Ingresa un número válido (usa punto para decimales).',
                  },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0.00"
                inputMode="decimal"
                disabled={isSubmitting}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Imagen (alfanumérica) *
              </label>
              <input
                type="text"
                id="image"
                {...register('image', {
                  required: 'La imagen es obligatoria.',
                  pattern: {
                    value: /^[A-Za-z0-9\s._/\\-]+$/,
                    message: 'Solo se permiten caracteres alfanuméricos, espacios, punto, guion y guion bajo.',
                  },
                  minLength: {
                    value: 5,
                    message: 'La imagen debe tener al menos 5 caracteres.',
                  },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ej: imagen-producto"
                disabled={isSubmitting}
              />
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              id="category"
              {...register('category', {
                required: 'La categoría es obligatoria.',
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isSubmitting}
            >
              <option value="">Selecciona una categoría</option>
              <option value="electronics">Electrónica</option>
              <option value="jewelery">Joyería</option>
              <option value="men's clothing">Ropa de hombre</option>
              <option value="women's clothing">Ropa de mujer</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creando...' : 'Crear Producto'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-semibold"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProduct;

