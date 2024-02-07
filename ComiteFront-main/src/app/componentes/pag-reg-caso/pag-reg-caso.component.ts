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
    motivoComi: '',
  };

  correosCoinciden: boolean = false;
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
      confirmarcorreo: ['', Validators.required], // Agrega este campo al formularios
      motivosAca: ['', Validators.required],
      motivosPer: ['', Validators.required],
      evidencia: ['', Validators.required],
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
    const correo = this.casoForm.get('correo')?.value;
    const confirmarCorreo = this.casoForm.get('confirmarcorreo')?.value;
  
    if (correo && confirmarCorreo) {
      this.correosCoinciden = correo === confirmarCorreo;
    } else {
      this.correosCoinciden = false;
    }
  }

  onFileChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];

    if (file) {
      if (!file.type.includes('pdf')) {
        // Restablecer el campo de archivo
        this.casoForm.get('evidencia')?.reset();
        console.error('El archivo seleccionado no es un PDF');
        // También podrías mostrar un mensaje al usuario indicando que solo se aceptan archivos PDF
      } else {
        console.log('Archivo seleccionado:', file);
      }
    }
  }
  
  

  registrarCaso(): void {
    if (this.correosCoinciden) {
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
      const evidenciaInput = this.casoForm.get('evidencia')?.value as File;
      console.log('evidenciaInput:', evidenciaInput); // Verifica que esto sea un archivo válido

      if (evidenciaInput) {
        console.log('Tipo de archivo seleccionado:', evidenciaInput.type);
        /*if (evidenciaInput.type === 'application/pdf') {
          formData.append('evidencia', evidenciaInput);
          console.log('Archivo seleccionado');
        } else {
          console.error('El archivo seleccionado no es un PDF 2');
          return; // Salir del método si no es un PDF
        }*/
        formData.append('evidencia', evidenciaInput);
        
      } else {
        console.error('No se ha seleccionado ningún archivo');
        return; // Salir del método si no hay archivo seleccionado
      }    

      this.authService.registrarCaso(formData).subscribe(
        (res) => {
          console.log(formData)
          console.log('Caso registrado correctamente:', res);
          // Después de registrar el caso, redirige a la página de visualización
        },
        (err) => {
          console.log(formData)
          console.error('Error al registrar el caso:', err);
          // Manejar el error, mostrar mensaje al usuario, etc.
        }
      );
    } else {
      console.log('Los correos no coinciden');
    }
  }
}
