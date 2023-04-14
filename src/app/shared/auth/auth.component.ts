import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  errMsg: any = null;
  authObservable!: Observable<AuthResponseData>;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSwitchAuthMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onAuthFormSubmit(formObj: NgForm) {
    if (!formObj.valid) return;

    const { email, password } = formObj.value

    if (this.isLoginMode) {
      this.authObservable = this.authService.signIn(email, password)
    } else {
      this.authObservable = this.authService.signUp(email, password)
    }

    // Observable logic to handle errors
    this.authObservable.subscribe(res => {
      console.log(res);
      this.errMsg = null;

      this.router.navigate(['library']);
    }), (err: any) => {
      console.log('Auth Response ERROR:', err)
      this.errMsg = err.message
    }

    formObj.reset();
  }
}
