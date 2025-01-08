import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface CarouselImage {
  id?: number;
  title: string;
  description: string;
  imageUrl: string;
  isActive?: boolean;
  section: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarouselService { 
  private baseUrl = 'http://localhost:4500/'; // Cambia la URL según tu configuración
  private apiUrl = 'api/carousel/'

  constructor(private http: HttpClient) {}
  
  // Obtener todas las imágenes

  getImagesBySection(section: string): Observable<CarouselImage[]> {
    return this.http.get<CarouselImage[]>(`${this.baseUrl}${this.apiUrl}/${section}`).pipe(
      map(images =>
        images.map(image => ({
          ...image,
          imageUrl: `${this.baseUrl}uploads/${image.imageUrl}`,
        }))
      )
    );
  }
  
}
