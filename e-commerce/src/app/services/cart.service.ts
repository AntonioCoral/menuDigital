import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product, ProductOption } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: { product: Product; quantity: number }[] = [];

  // NUEVO: BehaviorSubject para emitir actualizaciones en tiempo real
  private cartSubject = new BehaviorSubject<{ product: Product; quantity: number }[]>([]);
  cart$ = this.cartSubject.asObservable();

  // Función para agregar productos al carrito
  addToCart(product: Product, option?: ProductOption): void {
    const productId = option ? `${product.id}-${option.description}` : product.id;
    const item = this.items.find((item) => item.product.id === productId);
  
    if (item) {
      item.quantity += 1;
    } else {
      const totalPrice = option ? Number(option.price) || 0 : Number(product.price) || 0;
  
      const productToAdd: Product = {
        ...product,
        id: productId,
        price: totalPrice,
        name: option ? `${product.name} - ${option.description}` : product.name,
      };
  
      this.items.push({ product: productToAdd, quantity: 1 });
    }
  
    this.cartSubject.next(this.items); // 🔁 Emitir el cambio
  }
  

  // Obtener los items
  getItems(): { product: Product; quantity: number }[] {
    return this.items;
  }

  // Limpiar el carrito
  clearCart(): void {
    this.items = [];
    this.cartSubject.next(this.items); // 🔁 Emitir el cambio
  }

  // Total de precio
  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  // Total de unidades
  getTotalQuantity(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  // Eliminar un producto
  removeFromCart(product: Product, option?: ProductOption): void {
    const productId = option ? `${product.id}-${option.description}` : product.id;
    this.items = this.items.filter(item => item.product.id !== productId);
    this.cartSubject.next(this.items); // 🔁 Emitir el cambio
  }

  // Disminuir cantidad
  decreaseQuantity(product: Product, option?: ProductOption): void {
    const productId = option ? `${product.id}-${option.description}` : product.id;
    const item = this.items.find((item) => item.product.id === productId);

    if (item) {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        this.removeFromCart(product, option);
      }
      this.cartSubject.next(this.items); // 🔁 Emitir el cambio
    }
  }

  // Aumentar cantidad
  increaseQuantity(product: Product, option?: ProductOption): void {
    this.addToCart(product, option);
  }
}
