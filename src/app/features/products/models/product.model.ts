export interface ApiProduct {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  discount: number;
  finalPrice: number;
}

export interface CategoryDiscount {
  category: string;
  discount: number;
}
