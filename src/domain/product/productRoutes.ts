/**
 * Product routes — Domain routing definitions
 *
 * Define los paths de navegación del dominio de productos.
 */
export const productRoutes = {
  list: '/',
  detail: (id: string | number) => `/product/${id}`,
};
