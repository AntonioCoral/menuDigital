import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SubdomainService } from './subdomainService';

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
  private baseUrl = 'http://localhost:500/api/carousel/menu';

  constructor(
    private http: HttpClient,
    private subdomainService: SubdomainService
  ) {}

  getImagesBySection(section: string): Observable<CarouselImage[]> {
    const subdomain = this.subdomainService.getSubdomain();
    return this.http.get<CarouselImage[]>(`${this.baseUrl}/${section}?subdomain=${subdomain}`).pipe(
      map(images =>
        images.map(image => ({
          ...image,
          imageUrl: image.imageUrl, // Ya viene completa desde el backend
        }))
      )
    );
  }
}
