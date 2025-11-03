import type { ReactNode } from 'react';

export interface Rating {
  rate: number;
  count: number;
}

export enum ProductCategory {
  Electronics = 'electronics',
  Jewelery = 'jewelery',
  MenSClothing = "men's clothing",
  WomenSClothing = "women's clothing",
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: ProductCategory | string;
  image: string;
  rating: Rating;
}

export interface CreateProductFormValues {
  title: string;
  price: string;
  description: string;
  image: string;
  category: string;
}

export interface AuthGuardProps {
  children: ReactNode;
}

export interface AuthStorageState {
  state?: {
    isAuthenticated?: boolean;
  };
}

