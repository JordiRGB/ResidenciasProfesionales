import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { AlumnoAceptService } from 'src/app/services/alumno-acept.service';
import { Router } from '@angular/router';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-pag-acta-two',
  templateUrl: './pag-acta-two.component.html',
  styleUrls: ['./pag-acta-two.component.css']
})
export class PagActaTwoComponent implements OnInit{
  @ViewChild('Text1', { static: true }) Text1: ElementRef;
  @ViewChild('Text2', { static: true }) Text2: ElementRef;
  @ViewChild('Text3', { static: true }) Text3: ElementRef;
  @ViewChild('Text4', { static: true }) Text4: ElementRef;
  @ViewChild('Text5', { static: true }) Text5: ElementRef;
  @ViewChild('Text6', { static: true }) Text6: ElementRef;
  @ViewChild('Text7', { static: true }) Text7: ElementRef;
  @ViewChild('Text8', { static: true }) Text8: ElementRef;
  @ViewChild('Text9', { static: true }) Text9: ElementRef;
  public inputValue: string = '';

  currentDateAndTime: { date: string; time: string };
  public palabras: string='';
  public romano: string ='';
  public tipoSesion: string = '';
  asistentesSeleccionados: any[] = [];
  alumnosAceptados: any[]=[];

  constructor(private router: Router, private dataService: DataService, private alumnoAcept: AlumnoAceptService) {
    this.currentDateAndTime = this.getCurrentDateTimeFormatted();
  }

  ngOnInit(): void {
    this.obtenerInformacionActa();
    this.obtenerAlumnosAceptados();
    this.tipoSesion = this.dataService.getTipoSesion();
    this.asistentesSeleccionados = this.dataService.getAsistentesSeleccionados(); 
  }


  getFormattedAsistentes(): string {
    return this.asistentesSeleccionados
      .map((asistente) => `${asistente.nombre}, ${asistente.cargo} ${asistente.cargoSec ? 'y ' + asistente.cargoSec : ''}`)
      .join(', ');
  }  
  
  getPresidente(): string | undefined {
    const presidente= this.asistentesSeleccionados.find(asistente =>
      asistente.cargoSec === 'Presidente del Comité Académico'
    );
  
    if (presidente) {
      return `${presidente.nombre}`;
    } else {
      return 'No se encontró al Presidente del Comité Académico entre los asistentes seleccionados.';
    }
  }
  getSecret(): string | undefined {
    const Secret= this.asistentesSeleccionados.find(asistente =>
      asistente.cargoSec === 'Secretaria de Comité Académico'
    );
  
    if (Secret) {
      return `${Secret.nombre}`;
    } else {
      return 'No se encontró al secretari@ del Comité Académico entre los asistentes seleccionados.';
    }
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
  getCurrentDateTimeFormatted(): { date: string; time: string } {
    const optionsDate: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
  
    const optionsTime: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric'
    };
    const date = new Date();
    const formattedDate = date.toLocaleDateString('es-MX', optionsDate);
    const formattedTime = date.toLocaleTimeString('es-MX', optionsTime);
  
    return { date: formattedDate, time: formattedTime };
  }

  getCurrentDate(): Date {
    return new Date();
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

  ReAlumn(): void {
        this.router.navigate(['/RevAlumno']);
  }

  generatePDF() {
    const text1 = this.Text1.nativeElement.textContent;
    const text2 = this.Text2.nativeElement.textContent;
    const text3 = this.Text3.nativeElement.textContent;
    const text4 = this.Text4.nativeElement.textContent;
    const text5 = this.Text5.nativeElement.textContent;
    const text6 = this.Text6.nativeElement.textContent;
    const text7 = this.Text7.nativeElement.textContent;
    const text8 = this.Text8.nativeElement.textContent;
    const text9 = this.Text9.nativeElement.textContent;
    const tableContent = {
      margin: [100, 0, 0, 0],
      table: {
          headerRows: 1,
          widths: ['auto', 'auto', 'auto'],
          body: [
              [
                  { text: 'CASO', bold: true, fillColor: 'black',color: 'white'},
                  { text: 'NOMBRE DEL ESTUDIANTE', bold: true, fillColor: 'black',color: 'white'},
                  { text: 'CARRERA', bold: true, fillColor: 'black',color: 'white'}
              ],
              ...this.alumnosAceptados.map((alumno, index) => [
                  { text: '3.3.' + (index + 1) },
                  alumno.nombreCom,
                  alumno.carrera
              ])
          ]
      },
  };
    const docDefinition = {
        content: [
            {
              table: {
                body: [
                  [
                    {
                      text: text1, fillColor: 'blak',color: 'white', alignment:'center'
                    }
                  ]
                ]
              }
            },
            { text: '\n' },
            {
                text: text2,
                alignment: 'justify'
            },
            { text: '\n\n' }, 
            { text: 'ORDEN DEL DÍA:', alignment: 'center' },
            { text: '\n' },
            {
              type: 'none',
              ol: [
                { text: '1. Lista de asistencia y declaración de quórum.' },
                { text: '2. Lectura y aprobación del Orden del día.' },
                { text: '3. Discusión y resolución de los asuntos para los que fue citado el Comité Académico.' },
                { text: '',
                type: 'none',
                    ol: [
                        { text: '3.1 Presentación y análisis de los casos de estudiantes para los que fue citado el Comité Académico.' }
                    ]
                },
            ]
            },
            { text: '\n\n' }, // Doble salto de línea
            tableContent,
            { text: '\n' },
            {
              type:'none',
              ol:[
              { text: '4. Asuntos generales' },
              { text: this.inputValue, bold: true },
              ]
            },
            { text: '\n' },
            {
              type: 'none',
              ol: [
                { text: '1.LISTA DE ASISTENCIA Y DECLARATORIA DE QUÓRUM.' },
                { text: '\n' },
                { text: '',
                type: 'none',
                    ol: [
                        { text: text3}
                    ]
                },
                { text: '\n\n' },
                { text: '2. LECTURA Y APROBACIÓN DEL ORDE DEL DÍA.' },
                { text: '\n' },
                { text: '',
                type: 'none',
                    ol: [
                        { text: text4 },
                        { text: '\n' },
                        { text: text5 }
                    ]
                },
                { text: '\n' },
                { text: text6},
                { text: text7, margin: [146, 0, 0, 0],},
                { text: '\n' },
                { text: '3. Discusión y resolución de los asuntos para los que fue citado el Comité Académico.' },
                { text: '\n' },
                { text: '',
                type: 'none',
                    ol: [
                        { text: '3.1 Presentación y análisis de los casos de estudiantes para los que fue citado el Comité Académico.' }
                    ]
                },
                { text: '\n' },
                { text: text8},
                { text: '\n' },
                { text: text9},
            ]
            },
            
        ]
    };
    

    const pdf = pdfMake.createPdf(docDefinition);
    pdf.open();
}



}
