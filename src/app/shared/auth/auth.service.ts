import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const SIGN_UP_URL = 'http://localhost:3000/api/v1/users/create';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(SIGN_UP_URL, {
      email,
      password,
      returnSecureToken: true,
    });
  }
}
