export class DatosCaso {
    matricula: number;
    nombreCom: string;
    numero: number;
    direccion: string;
    carrera: string;
    casoEsta: string;
    casoTipo: string;
    semestre: number;
    correo: string;
    motivosAca: string;
    motivosPer: string;
    evidencia: string;

    constructor(matricula: number, nombreCom: string, numero: number, direccion: string, carrera: string, casoEsta: string, casoTipo: string, semestre: number, correo: string, motivosAca: string, motivosPer: string, evidencia: string){
        this.matricula = matricula;
        this.nombreCom = nombreCom;
        this.numero = numero;
        this.direccion = direccion;
        this.carrera = carrera;
        this.casoEsta = casoEsta;
        this.casoTipo = casoTipo;
        this.semestre = semestre;
        this.correo = correo;
        this.motivosAca = motivosAca;
        this.motivosPer = motivosPer;
        this.evidencia = evidencia;
    }
}

