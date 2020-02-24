import {Component, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {StorageService} from '../localStorage.service';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  data;
  token;
  myDate: Date;
  baseUrl;
  users;

  constructor(private breakpointObserver: BreakpointObserver, private store: StorageService, private route: Router, public http: HttpClient) {
    this.myDate = new Date();
  }

  public deleteUsers(item): void {
    console.log(item);
    const requestWeather = this.baseUrl + 'delete_user';
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    const body = {
      user_access_token: item.access_token
    };
    this.http.post(requestWeather, body, httpOptions)
      .subscribe(success => {
          console.log(<any>success.body);
          this.users = <any>success.body;
        },
        error => {
          console.log(error);
        }
      );
  }

  public makeAdmin(item): void {
    console.log(item);
    const requestWeather = this.baseUrl + 'change_role';
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    const body = {
      user_access_token: item.access_token,
      role: 'King Admin'
    };
    this.http.post(requestWeather, body, httpOptions)
      .subscribe(success => {
          console.log(<any>success.body);
          item.role = 'King Admin';
        },
        error => {
          console.log(error);
        }
      );
  }

  countS(item) {
    let i = 2;
    if (item.facebook.activated === 'true') {
      i++;
    }
    if (item.github.activated === 'true') {
      i++;
    }
    if (item.google.activated === 'true') {
      i++;
    }
    if (item.intra.activated === 'true') {
      i++;
    }
    if (item.yammer.activated === 'true') {
      i++;
    }
    if (item.yammer.activated === 'true') {
      i++;
    }
    return i;
  }

  countW(item) {
    let i = 0;
    for (const each in item.user_widgets) {
      i++;
    }
    return i;
  }

  ngOnInit(): void {
    this.data = this.store.getData('user');
    this.token = this.store.getData('token');
    this.baseUrl = this.store.getUrl();
    const requestWeather = this.baseUrl + 'get_all_users';
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    this.http.get(requestWeather, httpOptions)
      .subscribe(success => {
          console.log(<any>success.body);
          this.users = <any>success.body;
        },
        error => {
          console.log(error);
        }
      );
  }

  public logout(): void {
    this.store.clearLocal();
    this.route.navigate(['/login']);
  }
}
