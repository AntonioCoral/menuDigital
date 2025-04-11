// src/app/services/category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Category } from '../interfaces/category';
import { Product } from '../interfaces/producto';
import { SubdomainService } from './subdomainService';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  //private apiUrl = 'https://codeconnectivity.com/apilinea/api/categories/';
  private apiUrl = 'https://codeconnectivity.com/api/api/categories/';

  constructor(private http: HttpClient, private subdomainService: SubdomainService) {}

 // private getSubdomain(): string {
    //const hostname = window.location.hostname;
    //const subdomain = hostname.split('.')[0];
    //return subdomain === 'localhost' ? (new URLSearchParams(window.location.search).get('subdomain') || 'defaultCompany') : subdomain;
 // }

  
  getCategories(): Observable<Category[]> {
    const subdomain = this.subdomainService.getSubdomain();
    return this.http.get<Category[]>(`${this.apiUrl}categoryy/`, {
      params: { subdomain }
    });
  }
  

  getProductsByCategory(categoryName: string, page: number = 1, limit: number = 10): Observable<Product[]> {
    const subdomain = this.subdomainService.getSubdomain();
    return this.http.get<{ products: Product[] }>(`${this.apiUrl}byCategoryMenu/${categoryName}?page=${page}&limit=${limit}&subdomain=${subdomain}`)
      .pipe(map(response => response.products));
  }

  

  getProductsByCategoryP(categoryName: string, page: number = 1, limit: number = 10): Observable<{ products: Product[], totalPages: number, currentPage: number }> {
    const subdomain = this.subdomainService.getSubdomain();
    return this.http.get<{ products: Product[], totalPages: number, currentPage: number }>(
      `${this.apiUrl}categoryyy/${categoryName}?page=${page}&limit=${limit}&subdomain=${subdomain}`
    );
  }
}

