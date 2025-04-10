import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from '../interfaces/producto';
import { Injectable } from '@angular/core';
import { SubdomainService } from './subdomainService';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  //private apiUrl = 'https://codeconnectivity.com/apilinea/api/products/';
  private apiUrl = 'https://codeconnectivity.com/apilinea/api/products/';

  constructor(private http: HttpClient, private subdomainService: SubdomainService) {}
  

  
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl)
      .pipe(catchError(this.handleError)); // Asegúrate de que este método maneje la respuesta adecuadamente
  }

  searchProducts(query: string): Observable<Product[]> {
    const subdomain = this.subdomainService.getSubdomain();
    return this.http.get<Product[]>(`${this.apiUrl}searchMenu`, {
      params: { query, subdomain }
    }).pipe(catchError(this.handleError));
  }
  

  

  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    throw error;
  }

  
}
