import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { AlumnoAceptService } from 'src/app/services/alumno-acept.service';

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

  constructor( private dataService: DataService, private alumnoAcept: AlumnoAceptService) {
  }

  ngOnInit(): void {
    this.obtenerInformacionActa();
    this.obtenerAlumnosAceptados();
    this.tipoSesion = this.dataService.getTipoSesion(); 
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
}
