import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private baseUrl = 'http://localhost:4500/api/contact'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) {}

  getPhoneNumber(): Observable< {
    phoneNumber: string;
  }>{
    return this.http.get<{
    phoneNumber: string;
    }>(`${this.baseUrl}`);
  }

  // Obtener la información de contacto
  getContactInfo(): Observable<{
    openedTime: string;
    bankAccount: string;
    clabe: string;
    bankName: string;
    accountHolder: string;
  }> {
    return this.http.get<{
      openedTime: string;
      bankAccount: string;
      clabe: string;
      bankName: string;
      accountHolder: string;
    }>(`${this.baseUrl}`);
  }
}
