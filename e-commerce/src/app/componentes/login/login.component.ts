// src/app/components/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showAgeConfirmation: boolean = true;
  services: any[] = [
    { title: 'Promo 20 Cuartitas', image: 'promocuartitas.jpg' },
    { title: 'Promo misil tecate', image: 'promomisiltec.jpg' },
    { title: 'Promo misil tecate original ', image: 'promomisiltecoriginal.jpg' },
    { title: 'Promo misil XX', image: 'promomisilxx.jpg' }
  ];

  categories: any[] = [
    { title: 'Vinos', image: 'abarrotes.jpg' },
    { title: 'Licores fuertes', image: 'papeleria.jpg' },
    { title: 'Cervezas', image: 'ferreteria.png' },
    { title: 'Accesorios para cocteles', image: 'carnes.jpg' },
    
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Verificar si el usuario ya ha confirmado su edad
    const ageConfirmed = localStorage.getItem('ageConfirmed');
    if (ageConfirmed === 'true') {
      this.showAgeConfirmation = false;
    }
  }

  confirmAge(): void {
    // Guardar la confirmación en el almacenamiento local
    localStorage.setItem('ageConfirmed', 'true');
    this.showAgeConfirmation = false;
  }

  decline(): void {
    // Redirigir al usuario o cerrar el sitio si no confirma su edad
    alert('Debes ser mayor de 18 años para ingresar al sitio.');
    window.location.href = 'https://www.google.com'; // Cambia la URL si prefieres otro sitio de salida
  }
}
