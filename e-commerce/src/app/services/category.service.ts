// src/app/services/category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/category'
import { Product } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'https://codeconnectivity.com/apilinea/api/categories/'; // Ajusta la URL a tu API

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }
  getProductsByCategory(categoryName: string, page: number = 1, limit: number = 10): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/byCategory/${categoryName}?page=${page}$limit=${limit}`);
  }

  getProductsByCategoryP(categoryName: string, page: number = 1, limit: number = 10): Observable<{ products: Product[], totalPages: number, currentPage: number }> {
    return this.http.get<{ products: Product[], totalPages: number, currentPage: number }>(`${this.apiUrl}Category/${categoryName}?page=${page}&limit=${limit}`);
  }
  
  
}
