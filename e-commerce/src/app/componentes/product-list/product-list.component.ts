import { CategoryService } from './../../services/category.service';

// src/app/components/product-list/product-list.component.ts
import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { ProductsService } from '../../services/producto..service';
import { Product, ProductOption } from '../../interfaces/producto';
import { CartService } from '../../services/cart.service';
import { combineLatest, debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CarouselImage, CarouselService } from '../../services/carousel.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  @ViewChildren('carousel') carousels!: QueryList<ElementRef>;
  products: Product[] = [];
  sections: any[] = [];
  viewingCategory: boolean = false;
  searchActive: boolean = false;  // Indica si la búsqueda está activa
  searchQuery: string = '';       // Almacena los términos de búsqueda actuales
  selectedOptions: { [productId: number]: ProductOption | undefined } = {};
  selectedProduct: Product | null = null; // Producto seleccionado para mostrar en el modal
  currentPage: number = 2;  // Página actual
  totalPages: number = 1;
  limit: number = 7;        // Límite de productos por página
   // Crear un objeto para mantener el estado de la paginación por categoría
  paginationState: { [category: string]: { currentPage: number; totalPages: number } } = {};
  carouselImages: CarouselImage[] = []; // Cambiar el tipo a CarouselImage[]
  private scrollPosition = { x: 0, y: 0 };


  constructor(
    private productsService: ProductsService, 
    private cartService: CartService,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private router: Router,
    private carouselService: CarouselService,
    
    
  ) {}

  ngOnInit(): void {
  this.loadCachedData();
  // Restaurar la posición del scroll
    const cachedScroll = sessionStorage.getItem('scrollPosition');
    if (cachedScroll) {
      const { x, y } = JSON.parse(cachedScroll);
      setTimeout(() => window.scrollTo(x, y), 0);
    }
    // Observa los cambios en los parámetros de ruta y en los parámetros de consulta al mismo tiempo
    this.carouselService.getImagesBySection('carousel').subscribe(
      (images) => {
        this.carouselImages = images; // Asignar las imágenes correctamente
      },
      (error) => {
        console.error('Error al cargar imágenes del carrusel:', error);
      }
    );
    combineLatest([
      this.route.params,
      this.route.queryParams
    ]).subscribe(([params, queryParams]) => {
      const categoria = params['categoria'];
      const query = queryParams['query'];
      const subdomain = queryParams['subdomain'];
  
      if (query) {
        this.viewingCategory = false;
        this.searchActive = true;
        this.searchQuery = query;
        this.searchProducts(query);
      } else if (categoria) {
        this.viewingCategory = true;
        this.loadProductsByCategory(categoria);
      } else {
        this.viewingCategory = false;
        this.searchActive = false;
        this.loadSections();
      }
    });
  }
  
  private searchProducts(term: string): void {
    this.productsService.searchProducts(term).subscribe(
      products => {
        this.products = products;
        this.sections = []; // Asegúrate de limpiar las secciones para no mostrarlas cuando estés buscando
      },
      error => console.error('Search error:', error)
    );
  }

  loadCachedData() {
    const cachedProducts = sessionStorage.getItem('productos');
    if (cachedProducts) {
      this.products = JSON.parse(cachedProducts);
    } else {
      this.loadProducts();
    }
  }
  
  loadProducts(): void {
    this.productsService.getAllProducts().subscribe(
      (products: Product[]) => {
        this.products = products;
        sessionStorage.setItem('productos', JSON.stringify(products));
      },
      (error) => {
        console.error('Error loading products:', error);
      }
    );
  }

  
  loadProductsByCategory(categoria: string): void {
    this.categoryService.getProductsByCategory(categoria).subscribe(
      (products: Product[]) => {
        this.products = products;
        sessionStorage.setItem('productos', JSON.stringify(products));
      },
      (error) => {
        console.error('Error loading products by category:', error);
      }
    );
  }
    @HostListener('window:scroll', [])
      saveScrollPosition(): void {
        this.scrollPosition = { x: window.scrollX, y: window.scrollY };
        sessionStorage.setItem('scrollPosition', JSON.stringify(this.scrollPosition));
      }

  

  
// Maneja el estado de la paginación por cada categoría
loadProductsByCategoryy(categoria: string): void {
  const pagination = this.paginationState[categoria] || { currentPage: 1, totalPages: 1 };
  this.categoryService.getProductsByCategoryP(categoria, pagination.currentPage, this.limit).subscribe(
    (data) => {
      const section = this.sections.find(sec => sec.title === categoria);
      if (section) {
        section.products = data.products;
      }
      // Actualizamos el estado de la paginación de la categoría
      this.paginationState[categoria] = { currentPage: data.currentPage, totalPages: data.totalPages };
      
    },
    (error) => {
      this.toastr.error('Error al cargar productos');
      console.error('Error loading products:', error);
    }
  );
}

// Paginación individual por categoría
nextPage(category: string): void {
  if (this.paginationState[category].currentPage < this.paginationState[category].totalPages) {
    this.paginationState[category].currentPage++;
    this.loadProductsByCategoryy(category); 
  }
}

previousPage(category: string): void {
  if (this.paginationState[category].currentPage > 1) {
    this.paginationState[category].currentPage--;
    this.loadProductsByCategoryy(category); 
  }
}

loadSections(): void {
  this.categoryService.getCategories().subscribe(
    (categories) => {
      this.sections = categories.map((category) => ({
        title: category.name,
        products: [],
      }));

      this.sections.forEach((section) => {
        this.paginationState[section.title] = { currentPage: 1, totalPages: 1 }; // Inicializamos la paginación
        this.loadProductsByCategoryy(section.title); // Carga los productos con paginación
      });
    },
    (error) => {
      console.error('Error al cargar las categorías:', error);
    }
  );
}

openProductOptions(product: Product): void {
    this.selectedProduct = product;
}

closeModal(): void {
  this.selectedProduct = null;
}

selectOption(product: Product, option: ProductOption): void {
  this.selectedOptions[Number(product.id)] = option;
}

addToCart(product: Product, option?: ProductOption): void {
  if (option) {
    this.cartService.addToCart(product, option);
    this.toastr.success(`Añadido: ${product.name} - ${option.description}`, 'Éxito');
  } else {
    this.cartService.addToCart(product);
    this.toastr.success(`Añadido: ${product.name}`, 'Éxito');
  }
  this.closeModal();
}

addToCartWithOption(product: Product): void {
  const selectedOption = this.selectedOptions[Number(product.id)];

  if (product.options?.length) {
    // Si tiene opciones, se requiere una opción seleccionada
    if (selectedOption) {
      this.addToCart(product, selectedOption);
    } else {
      this.toastr.error('Por favor, selecciona una opción', 'Error');
    }
  } else {
    // Si no tiene opciones, agregar directamente
    this.addToCart(product);
  }
}


  

  scrollLeft(index: number): void {
    const carouselElement = this.carousels.toArray()[index].nativeElement;
    carouselElement.scrollBy({ left: -900, behavior: 'smooth' });
  }

  scrollRight(index: number): void {
    const carouselElement = this.carousels.toArray()[index].nativeElement;
    carouselElement.scrollBy({ left: 900, behavior: 'smooth' });
  }

  imagenAmpliada: boolean = false;

ampliarImagen(): void {
  this.imagenAmpliada = true;
}

cerrarImagenAmpliada(): void {
  this.imagenAmpliada = false;
}


}

