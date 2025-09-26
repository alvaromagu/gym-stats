/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { toast } from 'sonner';
import { ApiError } from '@/shared/errors/api-error';
import { TrekError } from '@/shared/errors/trek-error';

interface RequestOptions extends RequestInit {
  // Allows consumers to pass any standard fetch options
}

function apiUrl(path: string) {
  const baseUrl = import.meta.env.VITE_API_URL;
  return `${baseUrl}${path}`;
}

async function trekFetch(
  url: string,
  options: RequestOptions = {},
): Promise<Response> {
  const finalOptions: RequestOptions = {
    ...options,
  };
  try {
    const response = await fetch(url, finalOptions);
    if (!response.ok) {
      console.error('HTTP error! status:', response.status);
      throw new ApiError(response.status, 'Error en la solicitud a la API');
    }
    return response;
  } catch (error) {
    console.error('Fetch operation failed:', error);
    throw new TrekError('Error al conectar con la API');
  }
}

function trekErrorHandler(err: TrekError | ApiError): never {
  toast.error(err.message);
  throw err;
}

async function post<T = unknown>(url: string, body: unknown): Promise<T> {
  try {
    const res = await trekFetch(apiUrl(url), {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return (await res.json()) as T;
  } catch (error: unknown) {
    trekErrorHandler(error as TrekError | ApiError);
  }
}

async function get<T>(url: string): Promise<T> {
  try {
    const res = await trekFetch(apiUrl(url));
    return (await res.json()) as T;
  } catch (error: unknown) {
    trekErrorHandler(error as TrekError | ApiError);
  }
}

async function trekDelete<T>(url: string): Promise<T> {
  try {
    const res = await trekFetch(apiUrl(url), {
      method: 'DELETE',
    });
    return (await res.json()) as T;
  } catch (error: unknown) {
    trekErrorHandler(error as TrekError | ApiError);
  }
}

async function put<T>(url: string, body: unknown): Promise<T> {
  try {
    const res = await trekFetch(apiUrl(url), {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return (await res.json()) as T;
  } catch (error: unknown) {
    trekErrorHandler(error as TrekError | ApiError);
  }
}

async function patch<T>(url: string, body: unknown): Promise<T> {
  try {
    const res = await trekFetch(apiUrl(url), {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return (await res.json()) as T;
  } catch (error: unknown) {
    trekErrorHandler(error as TrekError | ApiError);
  }
}

const trek = {
  fetch: trekFetch,
  post,
  get,
  patch,
  put,
  delete: trekDelete,
};

export { trek };
