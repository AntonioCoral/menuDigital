import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

//Componentes
import { LoginComponent } from './componentes/login/login.component';
import { HomeComponent } from './componentes/home/home.component';
import { ProductListComponent } from './componentes/product-list/product-list.component';
import { CartComponent } from './componentes/cart/cart.component';
import { CategoryService } from './services/category.service';
import { RegisterComponent } from './componentes/register/register.component';


const routes: Routes = [
    { path: '', component: LoginComponent},
    { path: 'home', component: HomeComponent},
    { path: 'product-list', component: ProductListComponent},
    { path: 'cart', component: CartComponent },
    { path: 'categorias', component: CategoryService},
    { path: 'categorias/:categoria', component: ProductListComponent },
    { path: 'register', component: RegisterComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }