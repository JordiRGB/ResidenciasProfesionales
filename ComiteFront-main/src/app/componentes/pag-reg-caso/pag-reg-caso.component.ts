import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { DatosCaso } from '../../models/datos-caso';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-pag-reg-caso',
  templateUrl: './pag-reg-caso.component.html',
  styleUrls: ['./pag-reg-caso.component.css']
})
export class PagRegCasoComponent {
  datosCaso: DatosCaso = {
    matricula: 0,
    nombreCom: '',
    telefono: 0,
    direccion: '',
    carrera: '',
    casoEsta: 'Pendiente',
    casoTipo: '',
    semestre: 0,
    correo: '',
    motivosAca: '',
    motivosPer: '',
    evidencia: '',
  };

  correosCoinciden: boolean = true;
  confirmarCorreoInput: any;
  casoForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.casoForm = this.fb.group({
      matricula: ['', Validators.required],
      nombreCom: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      carrera: ['', Validators.required],
      casoEsta: ['pendiente', Validators.required],
      casoTipo: ['', Validators.required],
      semestre: ['', Validators.required],
      correo: ['', Validators.required],
      motivosAca: ['', Validators.required],
      motivosPer: ['', Validators.required],
      evidencia: [null, Validators.required],
    })
  }

  ngOnInit(): void {
    this.authService.initDatosCasoForm();
    this.confirmarCorreoInput = document.getElementById('confirmarcorreo');
  }

  ngAfterViewInit(): void {
    this.myFunction();
  }
  //funcion para que el menu sea responsivo
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
    if (this.confirmarCorreoInput) {
      this.correosCoinciden = this.datosCaso.correo === this.confirmarCorreoInput.value;
    } else {
      console.error('Elemento confirmarCorreoInput no encontrado.');
    }
  }

  registrarCaso(): void {
    const CASO: DatosCaso = {
      matricula: this.casoForm.get('matricula')?.value,
      nombreCom: this.casoForm.get('nombreCom')?.value,
      telefono: this.casoForm.get('numero')?.value,
      direccion: this.casoForm.get('direccion')?.value,
      carrera: this.casoForm.get('carrera')?.value,
      casoEsta: this.casoForm.get('casoEsta')?.value,
      casoTipo: this.casoForm.get('casoTipo')?.value,
      semestre: this.casoForm.get('semestre')?.value,
      correo: this.casoForm.get('correo')?.value,
      motivosAca: this.casoForm.get('motivosAca')?.value,
      motivosPer: this.casoForm.get('motivosPer')?.value,
      evidencia: this.casoForm.get('evidencia')?.value,
    }

    if (this.correosCoinciden) {
      console.log('Los correos coinciden');
      console.log(this.datosCaso.correo);
      console.log(this.confirmarCorreoInput);

      this.authService.registrarCaso(CASO).subscribe(
        (res) => {
          console.log(CASO);
          console.log(res);
          // Después de registrar el caso, redirige a la página de visualización
        },
        (err) => {
          console.log(CASO);
          console.log(err);
        }
      );
    } else {
      console.log('Los correos no coinciden');
    }
  }
}
