import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pag-reg-caso',
  templateUrl: './pag-reg-caso.component.html',
  styleUrls: ['./pag-reg-caso.component.css']
})
export class PagRegCasoComponent {
  datosCaso = {
  matricula:'',
  nombre:'',
  numero:'',
  estado:'',
  direccion:'',
  carrera:'',
  Tcaso:'',
  semestre:'',
  email:'',
  motivosA:'',
  motivosP:'',
  };
  constructor(
    private authService: AuthService,
    private router: Router
    ){}

  ngAfterViewInit(): void {
    this.myFunction();
  }

  myFunction(): void {
    const x = document.getElementById('myTopnav');
    if (x) {
      if (x.className === 'topnav') {
        x.className += ' responsive';
      } else {
        x.className = 'topnav';
      }
    }
  }
  registrarCaso(): void {
    this.authService.registrarCaso(this.datosCaso)
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );
  }
}
