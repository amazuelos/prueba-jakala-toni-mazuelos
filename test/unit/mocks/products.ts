import type { Product } from '@/types/product.types';

export const productsMock: Product[] = [
  {
    id: 1,
    name: 'Orquídea',
    binomialName: 'Phalaenopsis',
    price: 4.95,
    imgUrl: 'https://dulces-petalos.jakala.es/images/orquidea.jpg',
    wateringsPerWeek: 1,
    fertilizerType: 'phosphorus',
    heightInCm: 60,
  },
  {
    id: 2,
    name: 'Rosa de damasco',
    binomialName: 'Rosa damascena',
    price: 14.95,
    imgUrl: 'https://dulces-petalos.jakala.es/images/rosa.jpg',
    wateringsPerWeek: 3,
    fertilizerType: 'nitrogen',
    heightInCm: 120,
  },
];

export const productDetailMock: Product = productsMock[0];
