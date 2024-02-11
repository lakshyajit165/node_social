import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  constructor(private _router: Router) {}

  ngOnInit(): void {}

  googleSignUpUrl: string =
    'https://accounts.google.com/o/oauth2/v2/auth' +
    '?client_id=1012600445060-m0as8l881e3tgs4ps00a3q25gj79cs5s.apps.googleusercontent.com' +
    '&redirect_uri=http://localhost:4200/auth/google/callback' +
    '&response_type=code' +
    '&scope=email profile openid' +
    `${`&state=` + this.base64EncodeState('signup')}`;

  base64EncodeState(state: string): string {
    return btoa(state);
  }

  onClickLogin(): void {
    this._router.navigate(['/login']);
  }
}
