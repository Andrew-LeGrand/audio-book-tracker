import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const SIGN_UP_URL = 'http://localhost:3000/api/v1/users/create';

// CREATE THE RESPONSE INTERFACE (STEP 6, CLASS 22)

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signUp(email: string, password: string) {
    this.http.post(SIGN_UP_URL, {
      email,
      password,
      returnSecureToken: true,
    });
  }
}
