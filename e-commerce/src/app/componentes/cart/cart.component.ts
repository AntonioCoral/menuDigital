import { ConfigService } from './../../services/config.service';
import { ProductsService } from './../../services/producto..service';
// src/app/components/cart/cart.component.ts
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product } from '../../interfaces/producto';
import { SubdomainService } from '../../services/subdomainService';

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
  paymentMethod: string = ''
  locationUrl: string = '';  // Almacena la URL de Google Maps
  step: number = 1; // Paso inicial del modal
  phoneNumber: string = ''; // Variable para almacenar el número de teléfono dinámico
  bankAccount: string = '';
  clabe: string = '';
  bankName: string = '';
  accountHolder: string = '';
  deliveryType: string = 'Domicilio'; // Valor inicial
  isOpen: boolean = false;

  constructor(
    private cartService: CartService,
    private ConfigService: ConfigService,
    private subdomainService: SubdomainService
  ) {}

  ngOnInit(): void {
      this.cartService.cart$.subscribe(items => {
        this.items = items;
        this.totalQuantity = this.cartService.getTotalQuantity();
        this.totalPrice = this.cartService.getTotalPrice();
      });

      this.loadPhoneNumber();
      this.loadContactInfo();
    }


  // Cargar el número de teléfono desde la base de datos
  loadPhoneNumber(): void {
    this.ConfigService.getPhoneNumber().subscribe(
      (response) => {
        this.phoneNumber = response?.phoneNumber || '';
      },
      (error) => {
        console.error('Error al cargar el número de teléfono:', error);
      }
    );
  }
  // Cargar la información de contacto
  loadContactInfo(): void {
    this.ConfigService.getContactInfo().subscribe(
      (response) => {
        this.bankAccount = response?.bankAccount || '';
        this.clabe = response?.clabe || '';
        this.bankName = response?.bankName;
        this.accountHolder = response?.accountHolder || '';
      },
      (error) => {
        console.error('Error al cargar la información de contacto:', error);
      }
    );
  }

  // Actualizar la información del carrito
  updateCartInfo(): void {
    this.items = this.cartService.getItems();
    this.totalQuantity = this.cartService.getTotalQuantity();
    this.totalPrice = this.cartService.getTotalPrice();
  }

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  nextStep(): void {
  if (this.step === 1) {
    if (!this.deliveryType) {
      alert('Selecciona cómo deseas recibir tu pedido.');
      return;
    }

    if (this.deliveryType === 'Domicilio' && !this.address.trim()) {
      alert('Por favor ingresa tu dirección para la entrega.');
      return;
    }
  }

  if (this.step < 3) {
    this.step++;
  }
}


  previousStep(): void {
    if (this.step > 1) {
      this.step--;
    }
  }

  goToStep(step: number): void {
  if (step >= 1 && step <= 3) {
    this.step = step;
  }
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
    if (!this.phoneNumber) {
      return ''; // Si no hay número, evita crear el enlace
    }
  
    // Encabezado con emojis
    let message = `🛒 *Orden de Compra* 🛒\n\n`;
    message += `👤 *Nombre:* ${this.name}\n📞 *Teléfono:* ${this.phone}\n🏠 *Dirección:* ${this.address}\n📍 *Ubicación:* ${this.locationUrl}\n💳 *Método de Pago:* ${this.paymentMethod}\n`;
    message += `🚚 *Tipo de entrega:* ${this.deliveryType}\n`;
    // Detalle del método de pago
    if (this.paymentMethod === 'efectivo') {
      message += `💵 *Pagará con:* ${this.paga}\n`;
    } else if (this.paymentMethod === 'transferencia') {
      message += `🏦 *Realizará el pago por transferencia.*\n`;
    }
  
    // Separador para los productos
    message += `\n🛍️ *Productos en el carrito:*\n`;
    this.items.forEach((item, index) => {
      message += `\n${index + 1}. 🛒 *Producto:* ${item.product.name}\n   📦 *Cantidad:* ${item.quantity}\n   💲 *Precio:* ${item.product.price}\n`;
    });
  
    // Total de la compra
    message += `\n💰 *Total:* ${this.totalPrice}\n`;
  
    // Generar el enlace de WhatsApp
    const encodedMessage = encodeURIComponent(message);
    return `https://api.whatsapp.com/send?phone=${this.phoneNumber}&text=${encodedMessage}`;
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
  submitOrder(): void {
    const link = this.getWhatsAppLink();
    window.open(link, '_blank');
    this.clearCartAndShowSuccess();
  }

  clearCartAndShowSuccess(): void {
    this.cartService.clearCart();
    this.updateCartInfo();
    this.step = 1;
    alert('¡Orden enviada con éxito!');
  }

  //funcion para copiar los datos de la tarjeta

  copyToClipboard(data: string): void {
    navigator.clipboard.writeText(data).then(() => {
      alert('¡Copiado al portapapeles!');
    }).catch(err => {
      console.error('Error al copiar al portapapeles:', err);
    });
  }  

      isModalOpen: boolean = false;

    openModal(): void {
      this.isModalOpen = true;

      // Cargar la información bancaria al abrir el modal
      this.ConfigService.getContactInfo().subscribe(
        (response) => {
          this.bankAccount = response?.bankAccount || '';
          this.clabe = response?.clabe || '';
          this.bankName = response?.bankName;
          this.accountHolder = response?.accountHolder || '';
        },
        (error) => {
          console.error('Error al cargar la información de contacto:', error);
        }
      );
    }


    closeModal(): void {
      this.isModalOpen = false;
    }


}
