export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
}

export interface ProductFormValues {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}
