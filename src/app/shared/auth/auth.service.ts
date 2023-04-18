import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from './User.model';
import { Router } from '@angular/router';

const SIGN_UP_URL = 'http://localhost:3000/api/v1/users/create';
const SIGN_IN_URL = 'http://localhost:3000/api/v1/users/login';

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
  currentUser = new BehaviorSubject<User | null >(null)
  userToken = null;

  constructor(private http: HttpClient, private router: Router) {}

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(SIGN_UP_URL, {
      email,
      password,
      returnSecureToken: true,
    }).pipe(tap(res => {
      const { email, localId, idToken, expiresIn } = res;

      this.handleAuth(email, localId, idToken, +expiresIn)
    }));
  }

  signIn(email: string, password: string) {
    return this.http.post<AuthResponseData>(SIGN_IN_URL, {
      email, password, returnSecureToken: true,
    }).pipe(tap(res => {
      const { email, localId, idToken, expiresIn } = res;

      this.handleAuth(email, localId, idToken, +expiresIn)
    }))
  }

  handleAuth(email: string, userId: string, token: string, expiresIn: number) {
    const expDate = new Date(new Date().getTime() + expiresIn * 1000);

    const formUser = new User(email, userId, token, expDate);
    this.currentUser.next(formUser);

    localStorage.setItem("userData", JSON.stringify(formUser));
  }

  signOut() {
    this.currentUser.next(null);
    this.router.navigate(['auth']);
  }
}

// Watch "Me and Authentication" video and see if I need to do anything else with Auth
// Set up Auth Guard and it's service
// Set up "Me" request
// Set up "Logout" request

// Start working on Audio Book Model