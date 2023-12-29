import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagInicioComponent } from './componentes/pag-inicio/pag-inicio.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { PagRegCasoComponent } from './componentes/pag-reg-caso/pag-reg-caso.component';
import { PagLogInComponent } from './componentes/pag-log-in/pag-log-in.component';
import { PagRestablecerPassComponent } from './componentes/pag-restablecer-pass/pag-restablecer-pass.component';
import { PagSignUpComponent } from './componentes/pag-sign-up/pag-sign-up.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { JefeiscComponent } from './componentes/jefeisc/jefeisc.component';
import { AdministradorComponent } from './componentes/administrador/administrador.component';
import { PapeleraComponent } from './componentes/papelera/papelera.component';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { AuthService } from './services/auth.service';
import { ToastrModule } from 'ngx-toastr';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';


@NgModule({
  declarations: [
    AppComponent,
    PagInicioComponent,
    PagRegCasoComponent,
    PagLogInComponent,
    PagRestablecerPassComponent,
    PagSignUpComponent,
    JefeiscComponent,
    AdministradorComponent,
    PapeleraComponent,
  ],
  imports: [
    BrowserModule,
    PdfViewerModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    ToastrModule.forRoot(),
    MatInputModule,
    SweetAlert2Module.forRoot(),
    

  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
