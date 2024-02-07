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
    casoEsta: 'Pendiente',
    direccion: '',
    carrera: '',
    casoTipo: '',
    semestre: 0,
    correo: '',
    motivosAca: '',
    motivosPer: '',
    evidencia: null,
    motivoComi: '',
  };

  correosCoinciden: boolean = true;
  confirmarCorreoInput: any;
  casoForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.casoForm = this.fb.group({
      matricula: ['', Validators.required],
      nombreCom: ['', Validators.required],
      telefono: ['', Validators.required],
      casoEsta: ['pendiente', Validators.required],
      direccion: ['', Validators.required],
      carrera: ['', Validators.required],
      casoTipo: ['', Validators.required],
      semestre: ['', Validators.required],
      correo: ['', Validators.required],
      motivosAca: ['', Validators.required],
      motivosPer: ['', Validators.required],
      evidencia: [null],
      motivoComi: [''],
    });
  }

  ngOnInit(): void {
    this.authService.initDatosCasoForm();
    this.confirmarCorreoInput = document.getElementById('confirmarcorreo');
  }

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

  verificarCorreos(): void {
    if (this.confirmarCorreoInput) {
      this.correosCoinciden = this.datosCaso.correo === this.confirmarCorreoInput.value;
    } else {
      console.error('Elemento confirmarCorreoInput no encontrado.');
    }
  }

  registrarCaso(): void {
    const datosCaso = this.casoForm.value;
  
    if (this.correosCoinciden) {
      const evidenciaControl = this.casoForm.get('evidencia');
      const evidencia: File | null = evidenciaControl ? (evidenciaControl.value as File) : null;


  
      if (evidencia) {
        const formData = new FormData();
        formData.append('matricula', datosCaso.matricula);
        formData.append('nombreCom', datosCaso.nombreCom);
        formData.append('telefono', datosCaso.telefono);
        formData.append('casoEsta', datosCaso.casoEsta);
        formData.append('direccion', datosCaso.direccion);
        formData.append('carrera', datosCaso.carrera);
        formData.append('casoTipo', datosCaso.casoTipo);
        formData.append('semestre', datosCaso.semestre);
        formData.append('correo', datosCaso.correo);
        formData.append('motivosAca', datosCaso.motivosAca);
        formData.append('motivosPer', datosCaso.motivosPer);
        formData.append('evidencia', evidencia as Blob, evidencia?.name);// Asegúrate de agregar el nombre del archivo
        formData.append('motivoComi', datosCaso.motivoComi);
  
        this.authService.registrarCaso(formData).subscribe(
          (res) => {
            console.log(datosCaso);
            console.log(res);
            // Después de registrar el caso, redirige a la página de visualización
          },
          (err) => {
            console.log(datosCaso);
            console.log(err);
          }
        );
      } else {
        console.log('No se ha seleccionado ningún archivo.');
      }
    } else {
      console.log('Los correos no coinciden');
    }
  }
  
}
