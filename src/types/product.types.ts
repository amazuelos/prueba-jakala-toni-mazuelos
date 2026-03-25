/**
 * Product — Domain type
 *
 * Tipo central del dominio de productos.
 */
export interface Product {
  id: number;
  name: string;
  binomialName: string;
  price: number;
  imgUrl: string;
  wateringsPerWeek: number;
  fertilizerType: string;
  heightInCm: number;
}
