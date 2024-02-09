import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pag-log-in',
  templateUrl: './pag-log-in.component.html',
  styleUrls: ['./pag-log-in.component.css']
})
export class PagLogInComponent {
  user = {
    email: '',
    password: ''
  };

  constructor(
    private authServices: AuthService,
    private router: Router
  ) {}

  Signin() {
    // Verificar campos vacíos antes de enviar la solicitud
    if (!this.user.email || !this.user.password) {
      Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
      return;
    }

    this.authServices.signIn(this.user)
      .subscribe(
        res => {
          console.log(res);
          localStorage.setItem('token', res.token);
          this.router.navigate(['/inicio']);
        },
        err => {
          console.log(err);
          // Agregar alerta si la contraseña o usuario son incorrectos
          if (err.status === 401) {
            Swal.fire('Error', 'Contraseña o Usuario incorrecto. Por favor, inténtalo de nuevo.', 'error');
          } else {
            Swal.fire('Error', 'Hubo un problema durante el inicio de sesión. Por favor, inténtalo de nuevo.', 'error');
          }
        }
      );
  }
}
