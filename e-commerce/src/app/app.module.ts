import { NgModule, isDevMode } from "@angular/core";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { LoginComponent } from "./componentes/login/login.component";
import { BrowserModule } from "@angular/platform-browser";
import { NavbarComponent } from "./componentes/navbar/navbar.component";
import { ProductListComponent } from "./componentes/product-list/product-list.component";
import { HttpClientModule } from "@angular/common/http";
import { CartComponent } from "./componentes/cart/cart.component";
import { FormsModule } from "@angular/forms";
import { provideToastr, ToastrModule } from "ngx-toastr";
import { ServiceWorkerModule } from '@angular/service-worker';
import { Router, RouterModule, Scroll } from "@angular/router";
import { filter } from "rxjs";


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        NavbarComponent,
        ProductListComponent,
        CartComponent
    ],
    imports: [
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        BrowserModule,
        RouterModule.forRoot([], {
  scrollPositionRestoration: 'enabled'  // Restaura el scroll automáticamente al navegar
}),
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatMenuModule,
        MatListModule,
        BrowserAnimationsModule,
        
        ToastrModule.forRoot({
          timeOut: 1000,
          positionClass: 'toast-top-right', // O cualquier otra posición que prefieras
          preventDuplicates: true,
          progressBar: true, // Activa la barra de progreso si la otra aplicación la tiene
          progressAnimation: 'increasing', // Puedes cambiar a 'decreasing' según tu preferencia
          closeButton: true, // Si tu otra app tiene un botón de cierre
        }),
        
            
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: !isDevMode(),
          // Register the ServiceWorker as soon as the application is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:30000'
        }), 
    ],
    providers:[

    ],
    bootstrap: [ AppComponent ]
})

export class AppModule {
 }
