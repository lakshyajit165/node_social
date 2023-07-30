import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { IAuthTokenData } from 'src/app/model/IAuthTokenData';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-oauth-callback',
  templateUrl: './oauth-callback.component.html',
  styleUrls: ['./oauth-callback.component.css'],
})
export class OauthCallbackComponent implements OnInit {
  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _snackBarService: SnackbarService,
    private _cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.authorizationCode = this.getUrlParameter('code');
    this.error = this.getUrlParameter('error');
    this.state = this.base64DecodeState(this.getUrlParameter('state'));
    this.exchangeCodeForAuthTokens(this.authorizationCode);
  }

  authorizationCode: string = '';
  error: string = '';
  state: string = '';

  exchangeCodeForAuthTokens(code: string): void {
    // if no error in google signin
    if (!this.error || this.error != '') {
      this._authService.getAuthTokens(code).subscribe({
        next: (data: IAuthTokenData) => {
          // call the login / signup api based on state
          if (this.state === 'login') {
            this.login(data.id_tk);
          } else if (this.state === 'signup') {
            this.signup(data.id_tk);
          } else {
            this._snackBarService.showSnackBar(
              'Invalid auth state',
              5000,
              'error_outline'
            );
          }
        },
        error: (err) => {
          let errorMessage =
            err & err.message
              ? err.message
              : 'Error fetching auth code from Oauth provider';
          this._snackBarService.showSnackBar(
            errorMessage,
            5000,
            'error_outline'
          );
          this._router.navigate(['/login']);
        },
      });
    } else {
      let errorMessage = this.error
        ? this.error
        : 'An error occurred. Please try again';
      this._snackBarService.showSnackBar(errorMessage, 5000, 'error_outline');
    }
  }

  login(authToken: string): void {
    console.log(authToken);
    this._authService.login(authToken).subscribe({
      next: (data: object) => {
        console.log(data);
        // set the tokens in cookies here
        this._cookieService.set('id_tk', authToken, 3600, '/');
        this._router.navigate(['/profile']);
      },
      error: (err) => {
        let errorMessage =
          err && err.error && err.error.message
            ? err.error.message
            : 'Error logging in user';
        this._snackBarService.showSnackBar(errorMessage, 5000, 'error_outline');
        this._router.navigate(['/login']);
      },
    });
  }

  signup(authToken: string): void {
    this._authService.signup(authToken).subscribe({
      next: (data: object) => {
        console.log(data);
        // set the tokens in cookies here
        this._cookieService.set('id_tk', authToken, 3600, '/');
        this._router.navigate(['/profile']);
      },
      error: (err) => {
        let errorMessage =
          err && err.error && err.error.message
            ? err.error.message
            : 'Error signing up user';
        this._snackBarService.showSnackBar(errorMessage, 5000, 'error_outline');
        this._router.navigate(['/signup']);
      },
    });
  }

  getUrlParameter(name: string): string {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(this._router.url);
    return results === null
      ? ''
      : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  base64DecodeState(state: string): string {
    return atob(state);
  }
}
