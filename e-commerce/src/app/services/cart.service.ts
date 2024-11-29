import { Injectable } from '@angular/core';
import { Product, ProductOption } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: { product: Product; quantity: number }[] = [];

  // Función para agregar productos al carrito, con opción para incluir opciones de productos
  addToCart(product: Product, option?: ProductOption): void {
    // Creamos un identificador único para el producto, que puede incluir una opción si está presente
    const productId = option ? `${product.id}-${option.description}` : product.id;

    // Buscar el producto en el carrito
    const item = this.items.find((item) => item.product.id === productId);

    if (item) {
      // Si ya está en el carrito, aumentar la cantidad
      item.quantity += 1;
    } else {
      // Si no está en el carrito, añadirlo
      const productToAdd: Product = {
        ...product,
        id: productId,  // Mantener como string si tiene opción
        price: option ? option.price : product.price  // Usar precio de opción si está disponible
      };

      this.items.push({ product: productToAdd, quantity: 1 });
    }
  }

  // Obtener los items en el carrito
  getItems(): { product: Product; quantity: number }[] {
    return this.items;
  }

  // Limpiar el carrito
  clearCart(): void {
    this.items = [];
  }

  // Obtener el precio total de los productos en el carrito
  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  // Obtener la cantidad total de productos en el carrito
  getTotalQuantity(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  // Nueva función para eliminar un producto del carrito
  removeFromCart(product: Product, option?: ProductOption): void {
    // Crear el identificador único para encontrar el producto en el carrito
    const productId = option ? `${product.id}-${option.description}` : product.id;

    this.items = this.items.filter(item => item.product.id !== productId);
  }

  // Nueva función para disminuir la cantidad de un producto en el carrito
  decreaseQuantity(product: Product, option?: ProductOption): void {
    // Crear el identificador único
    const productId = option ? `${product.id}-${option.description}` : product.id;

    const item = this.items.find((item) => item.product.id === productId);

    if (item) {
      if (item.quantity > 1) {
        item.quantity--;  // Si la cantidad es mayor a 1, reducirla
      } else {
        this.removeFromCart(product, option);  // Si es 1, eliminar el producto
      }
    }
  }

  // Nueva función para aumentar la cantidad de un producto en el carrito
  increaseQuantity(product: Product, option?: ProductOption): void {
    this.addToCart(product, option);  // Simplemente reutilizamos la función existente para aumentar la cantidad
  }
}
