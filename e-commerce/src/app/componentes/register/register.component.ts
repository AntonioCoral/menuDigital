// register.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  companyForm: FormGroup;
  userForm: FormGroup;
  step = 1;
  companyId!: number;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      contactEmail: ['', [Validators.required, Validators.email]],
      subdomain: ['', Validators.required]
    });

    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  goToStep2(): void {
    if (this.companyForm.invalid) return;
    this.step = 2;
  }

  submitForm(): void {
    if (this.userForm.invalid) return;

    // Crear la empresa primero
    const companyData = this.companyForm.value;
    this.http.post<any>('https://codeconnectivity.com/api/api/companies', companyData).subscribe({
      next: (res) => {
        const companyId = res.company?.id;
        if (!companyId) {
          console.error('No se pudo obtener el ID de la empresa.');
          return;
        }

        const userData = {
          companyId,
          username: this.userForm.value.username,
          password: this.userForm.value.password,
          role: 'admin',
          isDelivery: false,
          isActive: true
        };

        this.http.post<any>('https://codeconnectivity.com/api/api/auth/register', userData).subscribe({
          next: () => {
            this.step = 3; // Mostrar pantalla de confirmación
          },
          error: (err) => {
            console.error('Error al registrar usuario:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error al crear empresa:', err);
      }
    });
  }
}
