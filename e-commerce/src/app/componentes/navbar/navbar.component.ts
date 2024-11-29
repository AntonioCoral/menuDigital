import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../interfaces/category';
import { Location } from '@angular/common';

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
    private location: Location
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

  buscarProductos(): void {
    if (this.searchQuery) {
      this.router.navigate(['/product-list'], { queryParams: { query: this.searchQuery.trim() } });
    }
  }

  filtrarPorCategoria(categoria: any): void {
    this.router.navigate(['/categorias', categoria.name]);
    this.isMenuOpen = false; // Cierra el menú al seleccionar una categoría
  }

  verCarrito(): void {
    this.router.navigate(['/cart']);
  }

  goBackHome(): void {
    this.location.back(); // Navegar hacia atrás
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen; // Alterna la apertura del menú
  }
}
