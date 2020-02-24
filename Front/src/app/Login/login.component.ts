import {ActivatedRoute} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService, FacebookLoginProvider, GoogleLoginProvider} from 'angular5-social-login';
import {StorageService} from '../localStorage.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(public http: HttpClient, private socialAuthService: AuthService, private activatedRoute: ActivatedRoute,
              public store: StorageService, private route: Router) {
  }

  baseUrl;
  port;
  credentials = {
    name: '',
    email: '',
    password: ''
  };
  credentialsLogin = {
    email: '',
    password: ''
  };

  public register(): void {
    const requestRegister = this.baseUrl + 'register';
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response' as 'response'
    };
    console.log(this.credentials);
    this.http.post(requestRegister, this.credentials, httpOptions)
      .subscribe((res) => {
        const container = document.getElementById('container');
        container.classList.remove('right-panel-active');
      });
  }

  public login(): void {
    const requestLogin = this.baseUrl + 'login';
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response' as 'response'
    };
    console.log(this.credentialsLogin);
    this.http.post(requestLogin, this.credentialsLogin, httpOptions)
      .subscribe(success => {
          this.saveData(<any>success.body);
        },
        error => {
          console.log(error);
        }
      );
  }

  public socialRegister(socialPlatform: string) {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response' as 'response'
    };
    let socialPlatformProvider;
    if (socialPlatform == "facebook") {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform == "google") {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        if (socialPlatform == 'facebook') {
          const credentialsFacebook = {
            name: userData.name,
            user_id: userData.id,
            access_token: userData.token,
            image: userData.image,
            email: userData.email
          };
          const requestRegisterFacebook = this.baseUrl + 'facebookregister';
          this.http.post(requestRegisterFacebook, credentialsFacebook, httpOptions)
            .subscribe((res) => {
              console.log('res : ' + res);
              const container = document.getElementById('container');
              container.classList.remove('right-panel-active');
            });
        }
        if (socialPlatform == 'google') {
          let credentialsGoogle = {
            name: userData.name,
            user_id: userData.id,
            access_token: userData.token,
            image: userData.image,
            email: userData.email,
            id_token: userData.idToken
          };
          const requestRegisterGoogle = this.baseUrl + 'googleregister';
          this.http.post(requestRegisterGoogle, credentialsGoogle, httpOptions)
            .subscribe((res) => {
              console.log('res : ' + res);
              const container = document.getElementById('container');
              container.classList.remove('right-panel-active');
            });
        }
      }
    );
  }

  public socialLogin(socialPlatform: string) {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response' as 'response'
    };
    let socialPlatformProvider;
    if (socialPlatform == "facebook") {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform == "google") {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        if (socialPlatform == 'facebook') {
          let credentialsFacebook = {
            user_id: userData.id,
            access_token: userData.token
          };
          const requestRegisterFacebook = this.baseUrl + 'facebooklogin';
          this.http.post(requestRegisterFacebook, credentialsFacebook, httpOptions)
            .subscribe(success => {
                this.saveData(<any>success.body)
              },
              error => {
                console.log(error);
              }
            );
        }
        if (socialPlatform == 'google') {
          let credentialsGoogle = {
            user_id: userData.id,
            access_token: userData.token,
            id_token: userData.idToken
          };
          const requestRegisterGoogle = this.baseUrl + 'googlelogin';
          this.http.post(requestRegisterGoogle, credentialsGoogle, httpOptions)
            .subscribe(success => {
                this.saveData(<any>success.body);
              },
              error => {
                console.log(error);
              }
            );
        }
      }
    );
  }

  public saveData(authenticate): void {
    const user = {
      name: authenticate.name,
      email: authenticate.email,
      role: authenticate.role,
      type: authenticate.type
    };
    const services = {
      google: authenticate.google,
      facebook: authenticate.facebook,
      github: authenticate.github,
      intra: authenticate.intra,
      yammer: authenticate.yammer,
      trello: authenticate.trello
    };
    this.store.saveData('token', authenticate.access_token);
    this.store.saveData('user', user);
    this.store.saveData('widgets', authenticate.user_widgets);
    this.store.saveData('services', services);
    this.route.navigate(['dashboard']);
  }

  ngOnInit() {
    this.baseUrl = this.store.getUrl();
    this.port = this.store.getPort();
    if (this.store.getData('token') != null) {
      this.route.navigate(['/dashboard']);
    }
    if (window.location.href != 'https://localhost:4200/login') {
      this.activatedRoute.queryParams.subscribe(params => {
        const from = params['from'];
        const code = params['code'];
        const httpOptions = {
          headers: new HttpHeaders({'Content-Type': 'application/json'}),
          observe: 'response' as 'response'
        };
        if (from == 'github') {
          const requestRegisterGithub = this.baseUrl + 'githublogin';
          const body = {
            code: code
          };
          this.http.post(requestRegisterGithub, body, httpOptions)
            .subscribe(success => {
                this.saveData(<any>success.body);
              },
              error => {
                console.log(error);
              });
        }
      });
    }
    // Front activity
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    signUpButton.addEventListener('click', () => {
      container.classList.add('right-panel-active');
    });

    signInButton.addEventListener('click', () => {
      container.classList.remove('right-panel-active');
    });
  }
}
