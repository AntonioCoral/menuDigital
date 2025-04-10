// src/app/components/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselImage, CarouselService } from '../../services/carousel.service';
import { ConfigService } from './../../services/config.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../interfaces/category';
import { SubdomainService } from '../../services/subdomainService';
@Component({
  selector: 'app-home',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showAgeConfirmation: boolean = true;
  services: any[] = [
    { title: 'Promo 20 Cuartitas', image: 'promocuartitas.jpg' },
    { title: 'Promo misil tecate', image: 'promomisiltec.jpg' },
    { title: 'Promo misil tecate original ', image: 'promomisiltecoriginal.jpg' },
    { title: 'Promo misil XX', image: 'promomisilxx.jpg' }
  ];

  categories: Category[] = []; // Almacena las categorías dinámicamente
  carouselImages: CarouselImage[] = []; // Cambiar el tipo a CarouselImage[]
  featuredProducts: any;
  category: Category[] = [];
  openedTime: string = '';


  constructor(
    private router: Router,
    private carouselService: CarouselService,
    private categoryService: CategoryService,
    private ConfigService: ConfigService,
    private subdomainService: SubdomainService
  ) { }

  ngOnInit(): void {
    this.loadCategories(),
    this.loadContactInfo(),
    // Observa los cambios en los parámetros de ruta y en los parámetros de consulta al mismo tiempo
    this.carouselService.getImagesBySection('home').subscribe(
      (images) => {
        this.carouselImages = images; // Asignar las imágenes correctamente
      },
      (error) => {
        console.error('Error al cargar imágenes del carrusel:', error);
      },
    );
  }
  // Carga las categorías desde la base de datos
  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories || []; // Asegura que siempre sea un arreglo
      },
      (error) => {
        console.error('Error al cargar las categorías', error);
        this.categories = []; // Proporciona un arreglo vacío en caso de error
      }
    );
  }
  goToProductList(): void {
      const subdomain = this.subdomainService.getSubdomain();
      this.router.navigate(['/product-list'], 
      { queryParams: { subdomain } });
  }
  
  
  
  // Cargar la información de contacto
  loadContactInfo(): void {
    this.ConfigService.getContactInfo().subscribe(
      (response) => {
        this.openedTime = response?.openedTime || '';
      },
      (error) => {
        console.error('Error al cargar la información de contacto:', error);
      }
    );
  }

  // Navega a la categoría seleccionada
  navigateToCategory(categoria: any): void {
    if (!categoria) {
      console.error('El categoryId no está definido');
      return;
    }
    const subdomain = this.subdomainService.getSubdomain();
      this.router.navigate(['/categorias', categoria.name], 
      { queryParams: { subdomain } });
  }
  
}

