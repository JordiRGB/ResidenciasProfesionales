import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pag-sign-up',
  templateUrl: './pag-sign-up.component.html',
  styleUrls: ['./pag-sign-up.component.css']
})
export class PagSignUpComponent {
  user ={
    name: '',
    email: '',
    password: ''
  }
  constructor(
    private authService: AuthService,
    private router: Router
    ){}
  signUp(){
    this.authService.signUp(this.user)
    .subscribe(
      res =>{
        console.log(res)
        localStorage.setItem('token', res.token)
        this.router.navigate(['/inicio']);
      },
      err =>{
        console.log(err)
      }
    )
  }
}
