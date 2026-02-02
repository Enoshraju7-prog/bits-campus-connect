const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface ApiOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export async function api<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { body, headers: customHeaders, ...rest } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include',
    headers,
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.error?.message || 'Something went wrong');
  }

  return data.data;
}
