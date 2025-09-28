import { toast } from 'sonner';
import { ApiError } from '@/shared/errors/api-error';
import { TrekError } from '@/shared/errors/trek-error';
import { tokenKey } from '../constants/session-keys';

interface RequestOptions extends RequestInit {
  // Allows consumers to pass any standard fetch options
}

function apiUrl(path: string) {
  const baseUrl = import.meta.env.VITE_API_URL;
  return `${baseUrl}${path}`;
}

interface GSApiError {
  errors: Array<{
    message: string;
  }>;
}

function getApiMessage(err: unknown): string {
  if (
    err != null &&
    'errors' in (err as GSApiError) &&
    Array.isArray((err as GSApiError).errors)
  ) {
    const message = (err as GSApiError).errors.find(
      (e) => typeof e.message === 'string',
    )?.message;
    if (message != null && message.trim() !== '') {
      return message;
    }
  }
  return 'Error en la solicitud a la API';
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
      let apiMessage = 'Error en la solicitud a la API';
      try {
        const errorData = (await response.json()) as unknown;
        apiMessage = getApiMessage(errorData);
      } catch (err) {}
      throw new ApiError(response.status, apiMessage);
    }
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Fetch operation failed:', error);
    throw new TrekError('Error al conectar con la API');
  }
}

function trekErrorHandler(err: TrekError | ApiError): never {
  toast.error(err.message);
  throw err;
}

function getHeaders({ includeContent } = { includeContent: true }): Headers {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  const token = sessionStorage.getItem(tokenKey);
  if (token != null) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  return headers;
}

async function post<T = unknown>(url: string, body: unknown): Promise<T> {
  try {
    const res = await trekFetch(apiUrl(url), {
      method: 'POST',
      body: JSON.stringify(body),
      headers: getHeaders(),
    });
    if (res.status === 204) {
      return {} as T;
    }
    return (await res.json()) as T;
  } catch (error: unknown) {
    trekErrorHandler(error as TrekError | ApiError);
  }
}

async function get<T>(url: string): Promise<T> {
  try {
    const res = await trekFetch(apiUrl(url), {
      method: 'GET',
      headers: getHeaders({ includeContent: false }),
    });
    return (await res.json()) as T;
  } catch (error: unknown) {
    trekErrorHandler(error as TrekError | ApiError);
  }
}

async function trekDelete<T>(url: string): Promise<T> {
  try {
    const res = await trekFetch(apiUrl(url), {
      method: 'DELETE',
      headers: getHeaders({ includeContent: false }),
    });
    if (res.status === 204) {
      return {} as T;
    }
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
      headers: getHeaders(),
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
      headers: getHeaders(),
    });
    if (res.status === 204) {
      return {} as T;
    }
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
