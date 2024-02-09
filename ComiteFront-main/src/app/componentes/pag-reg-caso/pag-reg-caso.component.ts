import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { DatosCaso } from '../../models/datos-caso';
import { HttpHeaders } from '@angular/common/http';
import { Buffer } from 'buffer';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

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
    evidencia: null,
    motivoComi: '',
  };

  correosCoinciden: boolean = false;
  confirmarCorreoInput: any;
  casoForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.casoForm = this.fb.group({
      matricula: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      nombreCom: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      direccion: ['', Validators.required],
      carrera: ['', Validators.required],
      casoEsta: ['pendiente', Validators.required],
      casoTipo: ['', Validators.required],
      semestre: ['', Validators.required],
      correo: ['', Validators.required],
      confirmarcorreo: ['', Validators.required], // Agrega este campo al formularios
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
    const correo = this.casoForm.get('correo')?.value;
    const confirmarCorreo = this.casoForm.get('confirmarcorreo')?.value;
  
    if (correo && confirmarCorreo) {
      this.correosCoinciden = correo === confirmarCorreo;
    } else {
      this.correosCoinciden = false;
    }
  }

  //limitar longitud
  limitarLongitud(controlName: string, maxLength: number): void {
    const control = this.casoForm.get(controlName);
    if (control?.value.length > maxLength) {
      control?.setValue(control?.value.slice(0, maxLength));
    }
  }

  onFileChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];
  
    if (file) {
      if (!file.type.includes('pdf')) {
        console.error('El archivo seleccionado no es un PDF');
        // Aquí puedes mostrar un mensaje al usuario indicando que el archivo debe ser un PDF
      } else {
        console.log('Archivo seleccionado:', file);
  
        const reader = new FileReader();
        reader.onload = () => {
          // Convierte el ArrayBuffer a un Buffer
          const buffer = Buffer.from(reader.result as ArrayBuffer);
  
          // Actualiza el valor del campo 'evidencia' en casoForm
          this.casoForm.patchValue({ evidencia: file });
  
          // Asigna el buffer a tu objeto datosCaso
          this.datosCaso.evidencia = buffer;
        };
        reader.readAsArrayBuffer(file);
      }
    }
  }
  
  
  

  async registrarCaso(): Promise<void> {
    if (this.casoForm.valid && this.correosCoinciden) {
      const fileInput = this.casoForm.get('evidencia')?.value;
      console.log(fileInput);
      if (!fileInput || !(fileInput instanceof File)) {
        console.error('No se ha seleccionado un archivo válido.');
        return;
      }
  
      try {
        const file = fileInput as File;
        const reader = new FileReader();
        reader.onload = async () => {
          const buffer = Buffer.from(reader.result as ArrayBuffer);
  
          const formData = new FormData();
          formData.append('matricula', this.casoForm.get('matricula')?.value.toString() ?? '');
          formData.append('nombreCom', this.casoForm.get('nombreCom')?.value ?? '');
          formData.append('telefono', this.casoForm.get('telefono')?.value.toString() ?? '');
          formData.append('direccion', this.casoForm.get('direccion')?.value ?? '');
          formData.append('carrera', this.casoForm.get('carrera')?.value ?? '');
          formData.append('casoEsta', this.casoForm.get('casoEsta')?.value ?? '');
          formData.append('casoTipo', this.casoForm.get('casoTipo')?.value ?? '');
          formData.append('semestre', this.casoForm.get('semestre')?.value.toString() ?? '');
          formData.append('correo', this.casoForm.get('correo')?.value ?? '');
          formData.append('motivosAca', this.casoForm.get('motivosAca')?.value ?? '');
          formData.append('motivosPer', this.casoForm.get('motivosPer')?.value ?? '');
          formData.append('evidencia', new File([buffer], 'evidencia.pdf'));
  
          // Llama al servicio con los datos del formulario y el archivo adjunto como buffer
          const response = await this.authService.registrarCaso(formData, buffer).toPromise();
          console.log('Caso registrado correctamente:', response);
          await Swal.fire({
            icon: 'success',
            title: '¡Caso registrado exitosamente!',
            showConfirmButton: false,
            timer: 1500
          });
          this.casoForm.reset();
          // Aquí puedes redirigir a la página de visualización o mostrar un mensaje de éxito
          
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error('Error al registrar el caso:', error);
        // Aquí puedes manejar el error mostrando un mensaje al usuario o realizando alguna acción necesaria
      }
    } else {
      console.log('El formulario es inválido o los correos no coinciden');
    }
  }
}  

