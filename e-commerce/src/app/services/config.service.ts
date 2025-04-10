import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SubdomainService } from './subdomainService';


@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private baseUrl = 'http://localhost:500/api/contact'; // Asegúrate que sea la URL correcta

  constructor(
    private http: HttpClient,
    private subdomainService: SubdomainService
  ) {}

  getContactInfo(): Observable<{
    openedTime: string;
    bankAccount: string;
    clabe: string;
    bankName: string;
    accountHolder: string;
  }> {
    const subdomain = this.subdomainService.getSubdomain();
    return this.http.get<{
      openedTime: string;
      bankAccount: string;
      clabe: string;
      bankName: string;
      accountHolder: string;
    }>(`${this.baseUrl}/menu?subdomain=${subdomain}`);
  }

  getPhoneNumber(): Observable<{ phoneNumber: string }> {
    const subdomain = this.subdomainService.getSubdomain();
    return this.http.get<any>(`${this.baseUrl}/menu?subdomain=${subdomain}`)
      .pipe(
        map(data => ({ phoneNumber: data.phoneNumber }))
      );
  }
}
