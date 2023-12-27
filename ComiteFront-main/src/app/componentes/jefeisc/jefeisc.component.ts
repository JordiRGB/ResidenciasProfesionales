import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-jefeisc',
  templateUrl: './jefeisc.component.html',
  styleUrls: ['./jefeisc.component.css']
})
export class JefeiscComponent {
  datosCaso: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Suscríbete al BehaviorSubject para recibir los dato  s del caso
    this.authService.datosCaso$.subscribe((datosCaso: any) => {
      this.datosCaso = datosCaso;
    });
  }
}
