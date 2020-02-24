import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map, shareReplay} from 'rxjs/operators';
import {StorageService} from '../localStorage.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ServicesComponent implements OnInit {
  // @ts-ignore
  @ViewChild('intra') intra;
  baseUrl;
  port;
  data;
  token;
  services;
  myDate: Date;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(map(result => result.matches), shareReplay());
  autologin = {
    autologin: ''
  };

  constructor(private breakpointObserver: BreakpointObserver, private store: StorageService, private route: Router, private modalService: NgbModal, public http: HttpClient, private activatedRoute: ActivatedRoute, private ref: ChangeDetectorRef) {
    this.myDate = new Date();
  }

  public connectServiceIntra(): void {
    const requestWeather = this.baseUrl + 'activate_intra';
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    this.http.post(requestWeather, this.autologin, httpOptions)
      .subscribe(success => {
          this.ref.markForCheck();
          this.store.saveData('services', <any>success.body);
          this.modalService.dismissAll();
          this.services = this.store.getData('services');
        },
        error => {
          console.log(error);
        }
      );
  }

  public openIntra() {
    this.modalService.open(this.intra, {size: 'lg'});
  }

  ngOnInit() {
    this.baseUrl = this.store.getUrl();
    this.port = this.store.getPort();
    this.data = this.store.getData('user');
    this.token = this.store.getData('token');
    this.services = this.store.getData('services');
    if (window.location.href !== 'https://localhost:4200/services') {
      if (window.location.href.includes('#')) {
        const newRoute = window.location.href.replace('#', '&');
        window.location.href = newRoute;
      }
      this.activatedRoute.queryParams.subscribe(params => {
        const from = params['from'];
        const code = params['code'];
        const tokenParamas = params['token'];
        const httpOptions = {
          headers: new HttpHeaders({'Authorization': this.token}),
          observe: 'response' as 'response'
        };
        if (from === 'yammer') {
          const requestActivateYammer = this.baseUrl + 'activate_yammer';
          const body = {
            code: code
          };
          this.http.post(requestActivateYammer, body, httpOptions)
            .subscribe(success => {
                this.ref.markForCheck();
                this.store.saveData('services', <any>success.body);
                this.services = this.store.getData('services');
              },
              error => {
                console.log(error);
              });
        } else if (from === 'github') {
          const requestActivateGithub = this.baseUrl + 'activate_github';
          const body = {
            code: code
          };
          this.http.post(requestActivateGithub, body, httpOptions)
            .subscribe(success => {
                this.ref.markForCheck();
                this.store.saveData('services', <any>success.body);
                this.services = this.store.getData('services');
              },
              error => {
                console.log(error);
              });
        } else if (from === 'trello') {
          const requestActivateGithub = this.baseUrl + 'activate_trello';
          const body = {
            code: tokenParamas
          };
          this.http.post(requestActivateGithub, body, httpOptions)
            .subscribe(success => {
                this.ref.markForCheck();
                this.store.saveData('services', <any>success.body);
                this.services = this.store.getData('services');
              },
              error => {
                console.log(error);
              });
        }
      });
    }
  }

  public logout(): void {
    this.store.clearLocal();
    this.route.navigate(['/login']);
  }
}
