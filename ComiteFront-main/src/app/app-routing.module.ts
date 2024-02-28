import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagInicioComponent } from './componentes/pag-inicio/pag-inicio.component';
import { PagRegCasoComponent } from './componentes/pag-reg-caso/pag-reg-caso.component';
import { PagLogInComponent } from './componentes/pag-log-in/pag-log-in.component';
import { JefeiscComponent } from './componentes/jefeisc/jefeisc.component';
import { PapeleraComponent } from './componentes/papelera/papelera.component';
import { AdministradorComponent } from './componentes/administrador/administrador.component';
import { AceptadosComponent } from './componentes/aceptados/aceptados.component';
import { loginbloqueo } from './block/login.bloqueo';
import { PagActaComponent } from './componentes/pag-acta/pag-acta.component';
import { PagActaTwoComponent } from './componentes/pag-acta-two/pag-acta-two.component';
import { HistorialComponent } from './componentes/historial/historial.component';
import { RevAlumnoComponent } from './componentes/rev-alumno/rev-alumno.component';
const routes: Routes = [
  { path: 'inicio', component: PagInicioComponent },
  { path: 'regcaso', component: PagRegCasoComponent },
  {
     path: 'jefes', 
     component: JefeiscComponent,
     canActivate: [loginbloqueo]
  },
  { path: 'papelera', component: PapeleraComponent,canActivate: [loginbloqueo]},
  { path: 'administrador', component: AdministradorComponent},
  { path: 'pagActa', component: PagActaComponent,canActivate: [loginbloqueo]},
  { path: 'pagActaTwo', component: PagActaTwoComponent,canActivate: [loginbloqueo]},
  { path: 'historial', component: HistorialComponent,canActivate: [loginbloqueo]},
  {path: 'Aceptado', component: AceptadosComponent,canActivate: [loginbloqueo] },
  { path: 'RevAlumno', component: RevAlumnoComponent,canActivate: [loginbloqueo]},
  { path: 'login', component: PagLogInComponent },
  { path: '', component: PagInicioComponent }, // Manejo de rutas no encontradas
];

@NgModule({  
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
