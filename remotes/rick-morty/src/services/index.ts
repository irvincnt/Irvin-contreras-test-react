import { ApiResponse } from '../interfaces';

const RICK_MORTY_BASE_URL = 'https://rickandmortyapi.com/api';

async function handleResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  if (!response.ok) {
    const rawMessage = await response.text();
    throw new Error(rawMessage || fallbackMessage);
  }

  return response.json() as Promise<T>;
}

export async function getCharacters(page: number): Promise<ApiResponse> {
  const response = await fetch(`${RICK_MORTY_BASE_URL}/character?page=${page}`);
  return handleResponse<ApiResponse>(response, 'No se pudo cargar la lista de personajes');
}


