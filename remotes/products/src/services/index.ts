import { Product } from '../interfaces';

const PRODUCTS_BASE_URL = 'https://fakestoreapi.com';

async function handleResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  if (!response.ok) {
    const rawMessage = await response.text();
    throw new Error(rawMessage || fallbackMessage);
  }

  return response.json() as Promise<T>;
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${PRODUCTS_BASE_URL}/products`);
  return handleResponse<Product[]>(response, 'Error al cargar los productos');
}

export async function getProductById(id: string | number): Promise<Product> {
  const response = await fetch(`${PRODUCTS_BASE_URL}/products/${id}`);
  return handleResponse<Product>(response, 'Error al cargar el producto');
}

export interface CreateProductPayload {
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const response = await fetch(`${PRODUCTS_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<Product>(response, 'No se pudo crear el producto. Intenta nuevamente.');
}


