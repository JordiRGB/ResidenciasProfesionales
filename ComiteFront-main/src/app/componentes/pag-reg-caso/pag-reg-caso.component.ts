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
  //verificacion de correos
  verificarCorreos(): void {
    if (this.confirmarCorreoInput) {
      this.correosCoinciden = this.datosCaso.correo === this.confirmarCorreoInput.value;
    } else {
      console.error('Elemento confirmarCorreoInput no encontrado.');
    }
  }

  registrarCaso(): void {
    const formData = new FormData();
    formData.append('matricula', this.casoForm.get('matricula')?.value);
    formData.append('nombreCom', this.casoForm.get('nombreCom')?.value);
    formData.append('telefono', this.casoForm.get('telefono')?.value);
    formData.append('direccion', this.casoForm.get('direccion')?.value);
    formData.append('carrera', this.casoForm.get('carrera')?.value);
    formData.append('casoEsta', this.casoForm.get('casoEsta')?.value);
    formData.append('casoTipo', this.casoForm.get('casoTipo')?.value);
    formData.append('semestre', this.casoForm.get('semestre')?.value);
    formData.append('correo', this.casoForm.get('correo')?.value);
    formData.append('motivosAca', this.casoForm.get('motivosAca')?.value);
    formData.append('motivosPer', this.casoForm.get('motivosPer')?.value);

    // Obtener el archivo adjunto
    const evidenciaFile = this.casoForm.get('evidencia')?.value;
    if (evidenciaFile instanceof File) {
      formData.append('evidenciaFile', evidenciaFile, evidenciaFile.name);
    }

    if (this.correosCoinciden) {
      console.log('Los correos coinciden');
      console.log(this.datosCaso.correo);
      console.log(this.confirmarCorreoInput);

      this.authService.registrarCaso(formData).subscribe(
        (res) => {
          console.log('Caso registrado correctamente:', res);
          // Después de registrar el caso, redirige a la página de visualización
        },
        (err) => {
          console.error('Error al registrar el caso:', err);
          // Manejar el error, mostrar mensaje al usuario, etc.
        }
      );
    } else {
      console.log('Los correos no coinciden');
    }
  }
}
