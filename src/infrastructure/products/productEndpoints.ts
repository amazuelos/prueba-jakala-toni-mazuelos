/**
 * Product endpoints — Infrastructure config
 *
 * Define los paths de la API para el dominio de productos.
 */
export const productEndpoints = {
  getAll: '/product',
  getById: (id: string) => `/product/${id}`,
};
