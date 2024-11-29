import { ProductsService } from './../../services/producto..service';
// src/app/components/cart/cart.component.ts
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product } from '../../interfaces/producto';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  items: { product: Product; quantity: number }[] = [];
  totalQuantity = 0;
  totalPrice = 0;
  name: string = '';
  address: string = '';
  phone: string = '';
  paga: string = '';
  locationUrl: string = '';  // Almacena la URL de Google Maps

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.updateCartInfo();
  }

  // Actualizar la información del carrito
  updateCartInfo(): void {
    this.items = this.cartService.getItems();
    this.totalQuantity = this.cartService.getTotalQuantity();
    this.totalPrice = this.cartService.getTotalPrice();
  }

  // Eliminar un producto del carrito
  removeItem(product: Product): void {
    this.cartService.removeFromCart(product);
    this.updateCartInfo();
  }

  // Aumentar la cantidad de un producto en el carrito
  increaseQuantity(product: Product): void {
    this.cartService.addToCart(product);  // Llama a la función que ya tienes en el servicio
    this.updateCartInfo();
  }

  // Disminuir la cantidad de un producto en el carrito
  decreaseQuantity(product: Product): void {
    this.cartService.decreaseQuantity(product);  // Implementa la función en el servicio
    this.updateCartInfo();
  }

  getWhatsAppLink(): string {
    const phoneNumber = '529991508240';
    let message = `Orden de ${this.name}\nDirección: ${this.address}\nTeléfono: ${this.phone}\nPaga: ${this.paga}\nUbicación: ${this.locationUrl}\n\n`;
    message += 'Tu carrito de compras:\n\n';

    this.items.forEach(item => {
      message += `Producto: ${item.product.name}\nCantidad: ${item.quantity}\nPrecio: $${item.product.price}\n\n`;
    });
    message += `Total: $${this.totalPrice}`;

    const encodedMessage = encodeURIComponent(message);
    return `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
  }

  fetchLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.locationUrl = `https://www.google.com/maps/search/?api=1&query=${position.coords.latitude},${position.coords.longitude}`;
      }, () => {
        alert('No se pudo obtener la ubicación');
      });
    } else {
      alert('Geolocalización no soportada por este navegador.');
    }
  }
}
