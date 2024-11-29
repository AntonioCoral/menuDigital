import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from '../interfaces/producto';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'https://codeconnectivity.com/apilinea/api/products/';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl)
      .pipe(catchError(this.handleError)); // Asegúrate de que este método maneje la respuesta adecuadamente
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}search`, { params: { query } })
      .pipe(catchError(this.handleError)); // Incluye opciones aquí si es necesario
  }

  

  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    throw error;
  }

  
}
