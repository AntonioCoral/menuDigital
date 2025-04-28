import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../interfaces/category';
import { Location } from '@angular/common';
import { SubdomainService } from '../../services/subdomainService';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  category: Category[] = [];
  carrito: any[] = [];
  totalQuantity = 0;
  searchQuery: string = '';
  isCartPage: boolean = false;
  isMenuOpen: boolean = false;

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private location: Location,
    private cartService: CartService,
    private subdomainService: SubdomainService
  ) {
    // Detectar si estamos en la página del carrito
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)) // Filtrar solo NavigationEnd
      .subscribe((event: NavigationEnd) => {
        this.isCartPage = event.urlAfterRedirects.includes('/cart');
      });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.cartService.cart$.subscribe((items) => {
      this.carrito = items;
      this.totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
    });
    
  }
  

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (category: Category[]) => {
        this.category = category;
      },
      (error) => {
        console.error('Error fetching categories', error);
      }
    );
    
  }

  buscarProductos(query: string): void {
    const subdomain = this.subdomainService.getSubdomain();
    this.router.navigate(['/product-list'], {
      queryParams: { query, subdomain }
    }).then(() => {
      this.searchQuery = ''; // 🔥 Limpiar el input después de navegar
    });
  }

  filtrarPorCategoria(categoria: any): void {
    const subdomain = this.obtenerSubdominioDesdeURL();
    this.router.navigate(['/categorias', categoria.name], { queryParams: { subdomain } });
    this.isMenuOpen = false;
  }
  obtenerSubdominioDesdeURL(): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('subdomain') || 'defaultCompany';
  }
  
  

  verCarrito(): void {
    const subdomain = this.subdomainService.getSubdomain();
    this.router.navigate(['/cart'], { queryParams: { subdomain } });
  }

  goBackHome(): void {
    this.location.back(); // Navegar hacia atrás
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen; // Alterna la apertura del menú
  }
}
