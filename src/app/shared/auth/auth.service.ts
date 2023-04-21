import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from './User.model';
import { Router } from '@angular/router';

const SIGN_UP_URL = 'http://localhost:3000/api/v1/users/create';
const SIGN_IN_URL = 'http://localhost:3000/api/v1/users/login';

export interface AuthResponseData {
  success: boolean;
  payload: {
    user: {
      id: number;
      email: string;
      first_name: string;
      last_name: string;
      name: string;
      token: {
        id: number;
        created_at: string;
        expiry: string;
        ip: string;
        revocation_date: string;
        updated_at: string;
        user_id: number;
        value: string;
      }
    }
  }
}

export interface UserData {
  id: number;
  email: string;
  name: string;
  _token: string;
  _tokenExpirationDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = new BehaviorSubject<User | null >(null)
  userToken = null;
  private tokenExpTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(SIGN_UP_URL, {
      email,
      password,
      returnSecureToken: true,
    }).pipe(tap(res => {
      const { payload } = res;

      this.handleAuth(payload.user.email, payload.user.id, payload.user.token.value, +payload.user.token.expiry)
    }));
  }

  signIn(email: string, password: string) {
    return this.http.post<AuthResponseData>(SIGN_IN_URL, {
      email, password, returnSecureToken: true,
    }).pipe(tap(res => {
      const { payload } = res;
      let expiresAt = new Date(payload.user.token.expiry).getTime();
        let now = new Date(payload.user.token.created_at).getTime();
        let expiresIn = +expiresAt - +now;
      this.handleAuth(payload.user.email, payload.user.id, payload.user.token.value, expiresIn)
    }))
  }

  handleAuth(email: string, id: number, token: string, expiresIn: number) {
    const expDate = new Date(new Date().getTime() + expiresIn * 1000);

    const formUser = new User(email, id, token, expDate);
    this.currentUser.next(formUser);

    localStorage.setItem("userData", JSON.stringify(formUser));

    this.automaticSignOut(expiresIn * 1000)
  }

  signOut() {
    this.currentUser.next(null);

    localStorage.removeItem('userData');

    if (this.tokenExpTimer) clearTimeout(this.tokenExpTimer);

    this.router.navigate(["auth"]);
  }

  automaticSignIn() {
    const userData: UserData = JSON.parse(localStorage.getItem('userData')!);

    if (!userData) return;
    const { email, id, _token, _tokenExpirationDate } = userData;

    const loadedUser = new User(email, id, _token, new Date(_tokenExpirationDate));

    if (loadedUser.token) {
      this.currentUser.next(loadedUser);
    }
  }

  automaticSignOut(expDuration: number) {
    expDuration = 1800000
    console.log("Expiration Duration:", expDuration)

    this.tokenExpTimer = setTimeout(() => {
      this.signOut();
    }, expDuration);
  }

}

// Watch "Me and Authentication" video and see if I need to do anything else with Auth
// Set up Auth Guard and it's service
// Set up "Me" request
// Set up "Logout" request

// Start working on Audio Book Model
