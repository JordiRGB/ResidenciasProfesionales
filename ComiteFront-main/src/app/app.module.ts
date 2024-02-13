import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagInicioComponent } from './componentes/pag-inicio/pag-inicio.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { PagRegCasoComponent } from './componentes/pag-reg-caso/pag-reg-caso.component';
import { PagLogInComponent } from './componentes/pag-log-in/pag-log-in.component';
import { PagSignUpComponent } from './componentes/pag-sign-up/pag-sign-up.component';
import { JefeiscComponent } from './componentes/jefeisc/jefeisc.component';
import { AdministradorComponent } from './componentes/administrador/administrador.component';
import { PapeleraComponent } from './componentes/papelera/papelera.component';
import { AceptadosComponent } from './componentes/aceptados/aceptados.component';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { AuthService } from './services/auth.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { ReactiveFormsModule } from '@angular/forms';
import { MyNavbarComponent } from './componentes/my-navbar/my-navbar.component';
import { PagActaComponent } from './componentes/pag-acta/pag-acta.component';
import { PagActaTwoComponent } from './componentes/pag-acta-two/pag-acta-two.component';
import { DataService } from './services/data.service';
import { HistorialComponent } from './componentes/historial/historial.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RevAlumnoComponent } from './componentes/rev-alumno/rev-alumno.component';


@NgModule({
  declarations: [
    AppComponent,
    PagInicioComponent,
    PagRegCasoComponent,
    PagLogInComponent,
    PagSignUpComponent,
    JefeiscComponent,
    AdministradorComponent,
    PapeleraComponent,
    MyNavbarComponent,
    HistorialComponent,
    AceptadosComponent,
    PagActaComponent,
    PagActaTwoComponent,
    RevAlumnoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PdfViewerModule,
    SweetAlert2Module,
    BrowserAnimationsModule,
    MatButtonModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCheckboxModule
  ],
  providers: [AuthService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
