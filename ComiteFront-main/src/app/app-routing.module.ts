import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagInicioComponent } from './componentes/pag-inicio/pag-inicio.component';
import { PagRegCasoComponent } from './componentes/pag-reg-caso/pag-reg-caso.component';
import { PagLogInComponent } from './componentes/pag-log-in/pag-log-in.component';
import { PagRestablecerPassComponent } from './componentes/pag-restablecer-pass/pag-restablecer-pass.component';
import {PagSignUpComponent}from './componentes/pag-sign-up/pag-sign-up.component'

const routes: Routes = [
  { path: 'inicio', component: PagInicioComponent },
  { path: 'regcaso', component: PagRegCasoComponent },
  { path: 'login', component: PagLogInComponent },
  { path: 'signup', component: PagSignUpComponent},
  { path: 'restablecer', component: PagRestablecerPassComponent },
  { path: '**', component: PagInicioComponent }, // Manejo de rutas no encontradas
  
];

@NgModule({  
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
