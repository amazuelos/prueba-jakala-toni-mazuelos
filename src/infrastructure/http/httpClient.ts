/**
 * httpClient — Infrastructure utility
 *
 * Cliente HTTP genérico. Lee la base URL de las variables de entorno.
 * En Next.js usamos NEXT_PUBLIC_API_BASE_URL.
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export async function get<T>(path: string): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${path}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json() as Promise<T>;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`httpClient GET ${path}: ${message}`);
  }
}
