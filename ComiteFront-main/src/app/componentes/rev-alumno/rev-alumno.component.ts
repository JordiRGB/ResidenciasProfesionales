import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { AlumnoAceptService } from 'src/app/services/alumno-acept.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rev-alumno',
  templateUrl: './rev-alumno.component.html',
  styleUrls: ['./rev-alumno.component.css']
})
export class RevAlumnoComponent {
  
  public palabras: string='';
  public romano: string ='';
  public tipoSesion: string = '';
  alumnosAceptados: any[]=[];
  DGeneral: string[]=[];
  Solucion: string[] = [];  

  constructor(private router: Router, private dataService: DataService, private alumnoAcept: AlumnoAceptService) {
  }

  ngOnInit(): void {
    this.obtenerInformacionActa();
    this.obtenerAlumnosAceptados();
    this.tipoSesion = this.dataService.getTipoSesion(); 
    this.DGeneral = new Array(this.alumnosAceptados.length).fill('');
    this.Solucion = new Array(this.alumnosAceptados.length).fill('');
  }

  obtenerInformacionActa(){
    this.dataService.obtenerInformacionActa().subscribe(
      data => {
        this.palabras = data.words;
        this.romano = data.roman;
      },
      error => {
        console.error('Error al obtener la información del acta:', error);
      }
    );
  }

  obtenerAlumnosAceptados() {
    this.alumnoAcept.getAlumnosAceptados()
      .subscribe(
        (data: any[]) => {
          this.alumnosAceptados = data;
        },
        error => {
          console.error('Error al obtener los datos:', error);
        }
      );
      }
    Guardar(){
      this.dataService.setDGeneral(this.DGeneral);
      this.dataService.setSolucion(this.Solucion);
      console.log(this.DGeneral)
      console.log(this.Solucion)
      this.router.navigate(['/pagActaTwo']);
    }  
}