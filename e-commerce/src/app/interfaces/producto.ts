export interface ProductOption {
  description: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  barcode: string; //descripcion del producto
  options: ProductOption[];
}
