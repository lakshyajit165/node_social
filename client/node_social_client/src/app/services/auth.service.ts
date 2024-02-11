import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IAuthTokenData } from '../model/IAuthTokenData';
import { IAuthResponse } from '../model/IAuthResponse';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private _http: HttpClient,
    private _cookieService: CookieService
  ) {}

  API_BASE_URL: string = 'http://localhost:3000';

  addTokenToHeader(token: string) {
    return 'Bearer ' + token;
  }

  login(token: string): Observable<IAuthResponse> {
    let headers = new HttpHeaders().set(
      'Authorization',
      this.addTokenToHeader(token)
    );
    console.log(token);
    return this._http
      .post(
        this.API_BASE_URL + '/auth/google/login',
        {},
        {
          headers: headers,
        }
      )
      .pipe(map((response) => response as IAuthResponse));
  }

  signup(token: string): Observable<IAuthResponse> {
    let headers = new HttpHeaders().set(
      'Authorization',
      this.addTokenToHeader(token)
    );
    return this._http
      .post(
        this.API_BASE_URL + '/auth/google/signup',
        {},
        {
          headers: headers,
        }
      )
      .pipe(map((response) => response as IAuthResponse));
  }

  getAuthTokens(code: string): Observable<IAuthTokenData> {
    return this._http
      .get(
        this.API_BASE_URL +
          '/auth/google/tokenExchange/?authorizationCode=' +
          code
      )
      .pipe(map((response) => response as IAuthTokenData));
  }

  logout(): void {
    this._cookieService.delete('id_tk', '/');
  }
}
