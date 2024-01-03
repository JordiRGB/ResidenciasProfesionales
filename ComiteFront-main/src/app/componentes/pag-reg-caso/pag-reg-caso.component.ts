import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { DatosCaso } from '../../models/datos-caso';
import { FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-pag-reg-caso',
  templateUrl: './pag-reg-caso.component.html',
  styleUrls: ['./pag-reg-caso.component.css']
})
  export class PagRegCasoComponent {
    datosCaso: DatosCaso= {
      matricula:0,
      nombreCom:'',
      numero:0,
      direccion:'',
      carrera:'',
      casoEsta:'Pendiente',
      casoTipo:'',
      semestre:0,
      email:'',
      motivosAca:'',
      motivosPer:'',
      evidencia:'',
    };
    router: any;

    correosCoinciden: boolean = true; // Inicia como true para que la validación inicial no muestre error
    confirmarCorreoInput: any; // Inicializamos la variable

    constructor(private authService: AuthService, router: Router){}

    ngOnInit(): void {
      this.authService.initDatosCasoForm();
      this.confirmarCorreoInput = document.getElementById('confirmarcorreo'); // Reemplaza 'idDeTuInput' con el ID correcto
    }
    
    ngAfterViewInit(): void {
      this.myFunction();
    }
    //menu responsivo
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

    verificarCorreos(): void {
      // Verificar si los correos coinciden al escribir en el campo de confirmación
      if (this.confirmarCorreoInput) {
        this.correosCoinciden = this.datosCaso.email === this.confirmarCorreoInput.value;
      } else {
        console.error('Elemento confirmarCorreoInput no encontrado.');
      }
    }
  // ... (código existente)

  registrarCaso(): void {
    // Validar si los correos coinciden antes de registrar el caso
    if (this.correosCoinciden) {
      console.log('Los correos coinciden');
      console.log(this.datosCaso.email);
      console.log(this.confirmarCorreoInput);
      this.authService.registrarCaso(this.datosCaso).subscribe(
        (res) => {
          console.log(this.datosCaso);
          console.log(res);
          // Después de registrar el caso, redirige a la página de visualización
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      // Los correos no coinciden, realizar alguna acción adicional si es necesario
      console.log('Los correos no coinciden');
    }
  }
}
/* console.log(this.datosCaso.email);
   console.log(this.confirmarCorreoInput); */
