// src/app/services/subdomain.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubdomainService {
  getSubdomain(): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('subdomain') || 'defaultCompany';
  }
}
