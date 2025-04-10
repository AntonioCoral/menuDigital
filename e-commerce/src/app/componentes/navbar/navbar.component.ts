import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../interfaces/category';
import { Location } from '@angular/common';
import { SubdomainService } from '../../services/subdomainService';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  category: Category[] = [];
  carrito = [];
  searchQuery: string = '';
  isCartPage: boolean = false;
  isMenuOpen: boolean = false;

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private location: Location,
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
