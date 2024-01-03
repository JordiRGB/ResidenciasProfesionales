import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

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
    this.authServices.signIn(this.user)
      .subscribe(
        res => {
          console.log(res);
          localStorage.setItem('token', res.token);
          this.router.navigate(['/inicio']);
        },
        err => {
          console.log(err);
          // Agregar alerta si la contraseña es incorrecta
          if (err.status === 401) {
            alert('Contraseña incorrecta. Por favor, inténtalo de nuevo.');
          }
        }
      );
  }
}