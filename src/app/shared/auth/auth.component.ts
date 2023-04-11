import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLoginMode = true;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onSwitchAuthMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onAuthFormSubmit(formObj: NgForm) {
    if (!formObj.valid) return;

    const { email, password } = formObj.value

    if (this.isLoginMode) {
      // Sign In Logic goes here
    } else {
      this.authService.signUp(email, password).subscribe(
        (res) => {
          console.log('Auth Response Success:', res);
        },
        (err) => {
          console.error('Auth Response Error:', err)
        }
      )
    }

    // Observable logic to handle errors

    formObj.reset();
  }
}
