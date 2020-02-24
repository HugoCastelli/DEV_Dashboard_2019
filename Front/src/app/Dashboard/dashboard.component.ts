import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {DisplayGrid, GridsterConfig, GridsterItem, GridType} from 'angular-gridster2';
import {StorageService} from '../localStorage.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  // @ts-ignore
  @ViewChild('modalSettingsWeather1') modalSettingsWeather1;
  // @ts-ignore
  @ViewChild('modalSettingsWeather2') modalSettingsWeather2;
  // @ts-ignore
  @ViewChild('modalSettingsCrypto1') modalSettingsCrypto1;
  // @ts-ignore
  @ViewChild('modalSettingsCrypto2') modalSettingsCrypto2;
  // @ts-ignore
  @ViewChild('modalSettingsIntra1') modalSettingsIntra1;
  // @ts-ignore
  @ViewChild('modalSettingsIntra2') modalSettingsIntra2;
  // @ts-ignore
  @ViewChild('modalSettingsYammer1') modalSettingsYammer1;
  // @ts-ignore
  @ViewChild('modalSettingsYammer2') modalSettingsYammer2;
  // @ts-ignore
  @ViewChild('modalSettingsGithub1') modalSettingsGithub1;
  // @ts-ignore
  @ViewChild('modalSettingsGithub2') modalSettingsGithub2;
  // @ts-ignore
  @ViewChild('modalSettingsTrello1') modalSettingsTrello1;
  // @ts-ignore
  @ViewChild('modalSettingsTrello2') modalSettingsTrello2;
  // @ts-ignore
  @ViewChild('modalSettingsAir') modalSettingsAir;
  // @ts-ignore
  @ViewChild('modalAdd') modalAdd;
  baseUrl;
  data;
  canEdit = false;
  myDate: Date;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(map(result => result.matches), shareReplay());
  widgets;
  weather = {
    city: '',
    time: ''
  };
  crypto = {
    crypto: '',
    currency: '',
    time: ''
  };
  intra = {
    subscribed: '',
    time: ''
  };
  intra1 = {
    info_type: '',
    time: ''
  };
  yammer = {
    group_url: '',
    time: ''
  };
  yammer1 = {
    thread_url: '',
    time: ''
  };
  github = {
    repo_url: '',
    time: ''
  };
  trello = {
    board_id: '',
    time: ''
  };
  trello1 = {
    board_id: '',
    member_id: '',
    time: ''
  };
  air = {
    city: '',
    time: ''
  };
  userInBoard;
  servicesActive;
  token;
  weatherS;
  cryptoS;
  intra1S;
  intra2S;
  yammer1S;
  yammer2S;
  githubS;
  github2S;
  getBoard;
  trelloS;
  trello1S;
  airS;

  constructor(public http: HttpClient, private breakpointObserver: BreakpointObserver, private store: StorageService,
              private modalService: NgbModal, private ref: ChangeDetectorRef, private route: Router) {
    this.options = {
      gridType: GridType.VerticalFixed,
      displayGrid: DisplayGrid.None,
      scrollToNewItems: true,
      disableWarnings: false,
      ignoreMarginInRow: false,
      disableWindowResize: true,
      itemChangeCallback: this.itemChange.bind(this),
      pushItems: true,
      draggable: {
        enabled: true,
      },
      resizable: {
        enabled: false
      },
      minCols: 8,
      maxCols: 8,
      fixedRowHeight: 150,
      fixedColWidth: 150,
      itemResizeCallback: (item) => {
        this.resizeEvent.emit(item);
      }
    };
    this.myDate = new Date();
  }
  resizeEvent: EventEmitter<any> = new EventEmitter<any>();

  dashboard: Array<GridsterItem> = [];
  options: GridsterConfig;
  public itemChange(item: GridsterItem): void {
    const requestPositions = this.baseUrl + 'change_widget_positions';
    const httpOptions = {
      headers: new HttpHeaders({'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    const body = {
      x: item.x,
      y: item.y,
      widget_id: item.id
    };
    this.http.post(requestPositions, body, httpOptions)
      .subscribe(success => {
          console.log(<any>success.body);
          console.log(item.id);
          this.store.updateWidgetsPosition('widgets', item.id, item.x, item.y);
        },
        error => {
          console.log(error);
        }
      );
  }

  public editWidgets(): void {
    if (this.canEdit === false) {
      this.canEdit = true;
    } else {
      this.canEdit = false;
    }
  }

  async openSettings(item) {
    console.log(item);
    if (item.type === 'current_weather') {
      this.weatherS = {
        city: item.city,
        time: item.time,
        widget_id: item.id
      };
      this.modalService.open(this.modalSettingsWeather1);
    } else if (item.type === 'forecast_weather') {
      this.weatherS = {
        city: item.city,
        time: item.time,
        widget_id: item.id
      };
      this.modalService.open(this.modalSettingsWeather2);
    } else if (item.type === 'crypto_actual_value') {
      this.cryptoS = {
        crypto_currency: item.crypto_currency,
        currency: item.currency,
        time: item.time,
        widget_id: item.id
      };
      this.modalService.open(this.modalSettingsCrypto1);
    } else if (item.type === 'crypto_actual_worth') {
      this.cryptoS = {
        crypto_currency: item.crypto_currency,
        currency: item.currency,
        time: item.time,
        widget_id: item.id
      };
      this.modalService.open(this.modalSettingsCrypto2);
    } else if (item.type === 'intra_modules') {
      this.intra1S = {
        subscribed: item.subscribed,
        time: item.time,
        widget_id: item.id
      };
      this.modalService.open(this.modalSettingsIntra1);
    } else if (item.type === 'intra_infos') {
      this.intra2S = {
        info_type: item.info_type,
        time: item.time,
        widget_id: item.id
      };
      this.modalService.open(this.modalSettingsIntra2);
    } else if (item.type === 'group_messages') {
      this.yammer1S = {
        group_url: item.group_url,
        time: item.time,
        widget_id: item.id
      };
      this.modalService.open(this.modalSettingsYammer1);
    } else if (item.type === 'thread_messages') {
      this.yammer2S = {
        thread_url: item.thread_url,
        time: item.time,
        widget_id: item.id
      };
      this.modalService.open(this.modalSettingsYammer2);
    } else if (item.type === 'repo_commits') {
      this.githubS = {
        repo_url: item.repo_url,
        time: item.time,
        widget_id: item.id
      };
      this.modalService.open(this.modalSettingsGithub1);
    } else if (item.type === 'repo_issues') {
      this.github2S = {
        repo_url: item.repo_url,
        time: item.time,
        widget_id: item.id
      };
      this.modalService.open(this.modalSettingsGithub2);
    } else if (item.type === 'trello_board') {
      this.trelloS = {
        board_id: item.board_id,
        time: item.time,
        widget_id: item.id
      };
      const requestTrelloKaban = this.baseUrl + 'get_boards';
      const httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.token}),
        observe: 'response' as 'response'
      };
      const datas = await this.http.get<any>(requestTrelloKaban, httpOptions).toPromise();
      this.getBoard = datas.body;
      this.modalService.open(this.modalSettingsTrello1);
    } else if (item.type === 'trello_member_tasks') {
      this.trello1S = {
        board_id: item.board_id,
        member_id: item.member_id,
        time: item.time,
        widget_id: item.id
      };
      const requestTrelloKaban = this.baseUrl + 'get_boards';
      const httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.token}),
        observe: 'response' as 'response'
      };
      const datas = await this.http.get<any>(requestTrelloKaban, httpOptions).toPromise();
      this.getBoard = datas.body;
      this.modalService.open(this.modalSettingsTrello2);
    } else if (item.type === 'air_quality') {
      this.airS = {
        city: item.city,
        time: item.time,
        widget_id: item.id
      };
      this.modalService.open(this.modalSettingsAir);
    }
  }

  public updateWeather1(): void {
    const requestDeleteWidget = this.baseUrl + 'current_weather';
    const httpOptions = {
      headers: new HttpHeaders({'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    this.http.put(requestDeleteWidget, this.weatherS, httpOptions)
      .subscribe(success => {
          console.log(<any>success.body);
          this.modalService.dismissAll();
          this.store.updateWidgetsParams('widgets', success.body);
          console.log(this.weatherS.widget_id);
          for (const each of this.dashboard) {
            if (this.weatherS.widget_id === each.id) {
              each.city = this.weatherS.city;
              each.time = this.weatherS.time;
              each.update = true;
            }
          }
          this.ref.markForCheck();
        },
        error => {
          console.log(error);
        }
      );
  }

  public updateWeather2(): void {
    const requestDeleteWidget = this.baseUrl + 'forecast_weather';
    const httpOptions = {
      headers: new HttpHeaders({'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    this.http.put(requestDeleteWidget, this.weatherS, httpOptions)
      .subscribe(success => {
          console.log(<any>success.body);
          this.modalService.dismissAll();
          this.store.updateWidgetsParams('widgets', success.body);
          console.log(this.weatherS.widget_id);
          for (const each of this.dashboard) {
            if (this.weatherS.widget_id === each.id) {
              each.city = this.weatherS.city;
              each.time = this.weatherS.time;
              each.update = true;
            }
          }
          this.ref.markForCheck();
        },
        error => {
          console.log(error);
        }
      );
  }

  public updateCrypto1(): void {
    const requestDeleteWidget = this.baseUrl + 'crypto_actual_value';
    const httpOptions = {
      headers: new HttpHeaders({'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    this.http.put(requestDeleteWidget, this.cryptoS, httpOptions)
      .subscribe(success => {
          console.log(<any>success.body);
          this.modalService.dismissAll();
          this.store.updateWidgetsParams('widgets', success.body);
          for (const each of this.dashboard) {
            if (this.cryptoS.widget_id === each.id) {
              each.crypto_currency = this.cryptoS.crypto_currency;
              each.currency = this.cryptoS.currency;
              each.time = this.cryptoS.time;
              each.update = true;
            }
          }
          this.ref.markForCheck();
        },
        error => {
          console.log(error);
        }
      );
  }

  public updateCrypto2(): void {
    const requestDeleteWidget = this.baseUrl + 'crypto_actual_worth';
    const httpOptions = {
      headers: new HttpHeaders({'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    this.http.put(requestDeleteWidget, this.cryptoS, httpOptions)
      .subscribe(success => {
          console.log(<any>success.body);
          this.modalService.dismissAll();
          this.store.updateWidgetsParams('widgets', success.body);
          for (const each of this.dashboard) {
            if (this.cryptoS.widget_id === each.id) {
              each.crypto_currency = this.cryptoS.crypto_currency;
              each.currency = this.cryptoS.currency;
              each.time = this.cryptoS.time;
              each.update = true;
            }
          }
          this.ref.markForCheck();
        },
        error => {
          console.log(error);
        }
      );
  }

  public updateIntra1(): void {
    const requestDeleteWidget = this.baseUrl + 'intra_modules';
    const httpOptions = {
      headers: new HttpHeaders({'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    this.http.put(requestDeleteWidget, this.intra1S, httpOptions)
      .subscribe(success => {
          console.log(<any>success.body);
          this.modalService.dismissAll();
          this.store.updateWidgetsParams('widgets', success.body);
          for (const each of this.dashboard) {
            if (this.intra1S.widget_id === each.id) {
              each.subscribed = this.intra1S.subscribed;
              each.time = this.intra1S.time;
              each.update = true;
            }
          }
          this.ref.markForCheck();
        },
        error => {
          console.log(error);
        }
      );
  }

  public updateIntra2(): void {
    const requestDeleteWidget = this.baseUrl + 'intra_infos';
    const httpOptions = {
      headers: new HttpHeaders({'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    this.http.put(requestDeleteWidget, this.intra2S, httpOptions)
      .subscribe(success => {
          console.log(<any>success.body);
          this.modalService.dismissAll();
          this.store.updateWidgetsParams('widgets', success.body);
          for (const each of this.dashboard) {
            if (this.intra2S.widget_id === each.id) {
              each.info_type = this.intra2S.info_type;
              each.time = this.intra2S.time;
              each.update = true;
              console.log(each);
            }
          }
          this.ref.markForCheck();
        },
        error => {
          console.log(error);
        }
      );
  }

  public updateYammer1(): void {
    const requestDeleteWidget = this.baseUrl + 'group_messages';
    const httpOptions = {
      headers: new HttpHeaders({'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    this.http.put(requestDeleteWidget, this.yammer1S, httpOptions)
      .subscribe(success => {
          console.log(<any>success.body);
          this.modalService.dismissAll();
          this.store.updateWidgetsParams('widgets', success.body);
          for (const each of this.dashboard) {
            if (this.yammer1S.widget_id === each.id) {
              each.group_url = this.yammer1S.group_url;
              each.time = this.yammer1S.time;
              each.update = true;
              console.log(each);
            }
          }
          this.ref.markForCheck();
        },
        error => {
          console.log(error);
        }
      );
  }

  public updateYammer2(): void {
    const requestDeleteWidget = this.baseUrl + 'thread_messages';
    const httpOptions = {
      headers: new HttpHeaders({'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    this.http.put(requestDeleteWidget, this.yammer2S, httpOptions)
      .subscribe(success => {
          console.log(<any>success.body);
          this.modalService.dismissAll();
          this.store.updateWidgetsParams('widgets', success.body);
          for (const each of this.dashboard) {
            if (this.yammer2S.widget_id === each.id) {
              each.thread_url = this.yammer2S.thread_url;
              each.time = this.yammer2S.time;
              each.update = true;
              console.log(each);
            }
          }
          this.ref.markForCheck();
        },
        error => {
          console.log(error);
        }
      );
  }

  public updateGithub1(): void {
    const requestRepoCommits = this.baseUrl + 'repo_commits';
    const httpOptions = {
      headers: new HttpHeaders({'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    this.http.put(requestRepoCommits, this.githubS, httpOptions)
      .subscribe(success => {
          console.log(<any>success.body);
          this.modalService.dismissAll();
          this.store.updateWidgetsParams('widgets', success.body);
          for (const each of this.dashboard) {
            if (this.githubS.widget_id === each.id) {
              each.repo_url = this.githubS.repo_url;
              each.time = this.githubS.time;
              each.update = true;
              console.log(each);
            }
          }
          this.ref.markForCheck();
        },
        error => {
          console.log(error);
        }
      );
  }

  public updateGithub2(): void {
    const requestRepoCommits = this.baseUrl + 'repo_issues';
    const httpOptions = {
      headers: new HttpHeaders({'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    this.http.put(requestRepoCommits, this.github2S, httpOptions)
      .subscribe(success => {
          console.log(<any>success.body);
          this.modalService.dismissAll();
          this.store.updateWidgetsParams('widgets', success.body);
          for (const each of this.dashboard) {
            if (this.github2S.widget_id === each.id) {
              each.repo_url = this.github2S.repo_url;
              each.time = this.github2S.time;
              each.update = true;
              console.log(each);
            }
          }
          this.ref.markForCheck();
        },
        error => {
          console.log(error);
        }
      );
  }

  public updateTrello(): void {
    const requestRepoCommits = this.baseUrl + 'trello_board';
    const httpOptions = {
      headers: new HttpHeaders({'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    this.http.put(requestRepoCommits, this.trelloS, httpOptions)
      .subscribe(success => {
          console.log(<any>success.body);
          this.modalService.dismissAll();
          this.store.updateWidgetsParams('widgets', success.body);
          for (const each of this.dashboard) {
            if (this.trelloS.widget_id === each.id) {
              each.board_id = this.trelloS.board_id;
              each.time = this.trelloS.time;
              each.update = true;
              console.log(each);
            }
          }
          this.ref.markForCheck();
        },
        error => {
          console.log(error);
        }
      );
  }

  public updateTrello1(): void {
    const requestTrelloUpdate = this.baseUrl + 'trello_member_tasks';
    const httpOptions = {
      headers: new HttpHeaders({'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    this.http.put(requestTrelloUpdate, this.trello1S, httpOptions)
      .subscribe(success => {
          console.log(<any>success.body);
          this.modalService.dismissAll();
          this.store.updateWidgetsParams('widgets', success.body);
          for (const each of this.dashboard) {
            if (this.trello1S.widget_id === each.id) {
              each.board_id = this.trello1S.board_id;
              each.member_id = this.trello1S.member_id;
              each.time = this.trello1S.time;
              each.update = true;
              console.log(each);
            }
          }
          this.ref.markForCheck();
        },
        error => {
          console.log(error);
        }
      );
  }

  public updateAirQuality(): void {
    const requestTrelloUpdate = this.baseUrl + 'air_quality';
    const httpOptions = {
      headers: new HttpHeaders({'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    this.http.put(requestTrelloUpdate, this.airS, httpOptions)
      .subscribe(success => {
          console.log(<any>success.body);
          this.modalService.dismissAll();
          this.store.updateWidgetsParams('widgets', success.body);
          for (const each of this.dashboard) {
            if (this.airS.widget_id === each.id) {
              each.city = this.airS.city;
              each.time = this.airS.time;
              each.update = true;
              console.log(each);
            }
          }
          this.ref.markForCheck();
        },
        error => {
          console.log(error);
        }
      );
  }

  public clickWeather(): void {
    const div1 = document.getElementById('github').classList.add('displayNone');
    const div3 = document.getElementById('yammer').classList.add('displayNone');
    const div4 = document.getElementById('epitech').classList.add('displayNone');
    const div5 = document.getElementById('crypto').classList.add('displayNone');
    const div9 = document.getElementById('trello').classList.add('displayNone');
    const div10 = document.getElementById('air').classList.add('displayNone');

    const div6 = document.getElementById('disp').classList.remove('displayNone');
    const div7 = document.getElementById('weather1').classList.remove('displayNone');
    const div8 = document.getElementById('weather2').classList.remove('displayNone');
  }

  public clickWeather1(): void {
    const div9 = document.getElementById('weather2').classList.add('displayNone');
    const div10 = document.getElementById('disp2').classList.remove('displayNone');
    const div11 = document.getElementById('settingWeatherCity1').classList.remove('displayNone');
    const div12 = document.getElementById('settingWeatherMs1').classList.remove('displayNone');
    const div13 = document.getElementById('btn1').classList.remove('displayNone');
  }

  public clickWeather2(): void {
    const div9 = document.getElementById('weather1').classList.add('displayNone');
    const div10 = document.getElementById('disp2').classList.remove('displayNone');
    const div11 = document.getElementById('settingWeatherCity1').classList.remove('displayNone');
    const div12 = document.getElementById('settingWeatherMs1').classList.remove('displayNone');
    const div13 = document.getElementById('btn2').classList.remove('displayNone');
  }

  public clickCrypto(): void {
    const div0 = document.getElementById('weather').classList.add('displayNone');
    const div1 = document.getElementById('github').classList.add('displayNone');
    const div3 = document.getElementById('yammer').classList.add('displayNone');
    const div4 = document.getElementById('epitech').classList.add('displayNone');
    const div9 = document.getElementById('trello').classList.add('displayNone');
    const div10 = document.getElementById('air').classList.add('displayNone');

    const div6 = document.getElementById('disp').classList.remove('displayNone');
    const div7 = document.getElementById('crypto1').classList.remove('displayNone');
    const div8 = document.getElementById('crypto2').classList.remove('displayNone');
  }

  public clickCrypto1(): void {
    const div9 = document.getElementById('crypto2').classList.add('displayNone');
    const div10 = document.getElementById('disp4').classList.remove('displayNone');
    const div11 = document.getElementById('settingCrypto1').classList.remove('displayNone');
    const div12 = document.getElementById('settingCrypto2').classList.remove('displayNone');
    const div13 = document.getElementById('settingCrypto3').classList.remove('displayNone');
    const div14 = document.getElementById('btn3').classList.remove('displayNone');
  }

  public clickCrypto2(): void {
    const div9 = document.getElementById('crypto1').classList.add('displayNone');
    const div10 = document.getElementById('disp4').classList.remove('displayNone');
    const div11 = document.getElementById('settingCrypto1').classList.remove('displayNone');
    const div12 = document.getElementById('settingCrypto2').classList.remove('displayNone');
    const div13 = document.getElementById('settingCrypto3').classList.remove('displayNone');
    const div14 = document.getElementById('btn4').classList.remove('displayNone');
  }


  public clickIntra(): void {
    const div0 = document.getElementById('weather').classList.add('displayNone');
    const div1 = document.getElementById('github').classList.add('displayNone');
    const div3 = document.getElementById('yammer').classList.add('displayNone');
    const div4 = document.getElementById('crypto').classList.add('displayNone');
    const div9 = document.getElementById('trello').classList.add('displayNone');
    const div10 = document.getElementById('air').classList.add('displayNone');

    if (this.servicesActive.intra.activated === 'true') {
      const div6 = document.getElementById('disp').classList.remove('displayNone');
      const div7 = document.getElementById('intra1').classList.remove('displayNone');
      const div8 = document.getElementById('intra2').classList.remove('displayNone');
    } else {
      const div6 = document.getElementById('disp').classList.remove('displayNone');
      const div9 = document.getElementById('notActivated').classList.remove('displayNone');
    }
  }

  public clickIntra1(): void {
    const div9 = document.getElementById('intra2').classList.add('displayNone');
    const div10 = document.getElementById('disp5').classList.remove('displayNone');
    const div11 = document.getElementById('settingIntra1').classList.remove('displayNone');
    const div12 = document.getElementById('settingIntraTime1').classList.remove('displayNone');
    const div14 = document.getElementById('btn5').classList.remove('displayNone');
  }

  public clickIntra2(): void {
    const div9 = document.getElementById('intra1').classList.add('displayNone');
    const div10 = document.getElementById('disp5').classList.remove('displayNone');
    const div11 = document.getElementById('settingIntra2').classList.remove('displayNone');
    const div12 = document.getElementById('settingIntraTime2').classList.remove('displayNone');
    const div14 = document.getElementById('btn6').classList.remove('displayNone');
  }

  public clickYammer(): void {
    const div0 = document.getElementById('weather').classList.add('displayNone');
    const div1 = document.getElementById('github').classList.add('displayNone');
    const div3 = document.getElementById('epitech').classList.add('displayNone');
    const div4 = document.getElementById('crypto').classList.add('displayNone');
    const div9 = document.getElementById('trello').classList.add('displayNone');
    const div10 = document.getElementById('air').classList.add('displayNone');

    if (this.servicesActive.yammer.activated === 'true') {
      const div6 = document.getElementById('disp').classList.remove('displayNone');
      const div7 = document.getElementById('yammer1').classList.remove('displayNone');
      const div8 = document.getElementById('yammer2').classList.remove('displayNone');
    } else {
      const div6 = document.getElementById('disp').classList.remove('displayNone');
      const div9 = document.getElementById('notActivated').classList.remove('displayNone');
    }
  }

  public clickYammer1(): void {
    const div9 = document.getElementById('yammer2').classList.add('displayNone');
    const div10 = document.getElementById('disp6').classList.remove('displayNone');
    const div11 = document.getElementById('settingYammer1').classList.remove('displayNone');
    const div12 = document.getElementById('settingYammerTime1').classList.remove('displayNone');
    const div14 = document.getElementById('btn7').classList.remove('displayNone');
  }

  public clickYammer2(): void {
    const div9 = document.getElementById('yammer1').classList.add('displayNone');
    const div10 = document.getElementById('disp6').classList.remove('displayNone');
    const div11 = document.getElementById('settingYammer2').classList.remove('displayNone');
    const div12 = document.getElementById('settingYammerTime2').classList.remove('displayNone');
    const div14 = document.getElementById('btn8').classList.remove('displayNone');
  }

  public clickGithub(): void {
    const div0 = document.getElementById('weather').classList.add('displayNone');
    const div1 = document.getElementById('epitech').classList.add('displayNone');
    const div3 = document.getElementById('yammer').classList.add('displayNone');
    const div4 = document.getElementById('crypto').classList.add('displayNone');
    const div10 = document.getElementById('trello').classList.add('displayNone');
    const div11 = document.getElementById('air').classList.add('displayNone');

    if (this.servicesActive.github.activated === 'true') {
      const div6 = document.getElementById('disp').classList.remove('displayNone');
      const div7 = document.getElementById('github1').classList.remove('displayNone');
      const div8 = document.getElementById('github2').classList.remove('displayNone');
    } else {
      const div6 = document.getElementById('disp').classList.remove('displayNone');
      const div9 = document.getElementById('notActivated').classList.remove('displayNone');
    }
  }

  public clickGithub1(): void {
    const div9 = document.getElementById('github2').classList.add('displayNone');
    const div10 = document.getElementById('disp7').classList.remove('displayNone');
    const div11 = document.getElementById('settingGithub1').classList.remove('displayNone');
    const div12 = document.getElementById('settingGithubTime1').classList.remove('displayNone');
    const div14 = document.getElementById('btn9').classList.remove('displayNone');
  }

  public clickGithub2(): void {
    const div9 = document.getElementById('github1').classList.add('displayNone');
    const div10 = document.getElementById('disp7').classList.remove('displayNone');
    const div11 = document.getElementById('settingGithub2').classList.remove('displayNone');
    const div12 = document.getElementById('settingGithubTime2').classList.remove('displayNone');
    const div14 = document.getElementById('btn10').classList.remove('displayNone');
  }

  async clickTrello() {
    const div0 = document.getElementById('weather').classList.add('displayNone');
    const div1 = document.getElementById('epitech').classList.add('displayNone');
    const div3 = document.getElementById('yammer').classList.add('displayNone');
    const div4 = document.getElementById('crypto').classList.add('displayNone');
    const div10 = document.getElementById('github').classList.add('displayNone');
    const div11 = document.getElementById('air').classList.add('displayNone');

    if (this.servicesActive.trello.activated === 'true') {
      const div6 = document.getElementById('disp').classList.remove('displayNone');
      const div7 = document.getElementById('trello1').classList.remove('displayNone');
      const div8 = document.getElementById('trello2').classList.remove('displayNone');
      const requestTrelloKaban = this.baseUrl + 'get_boards';
      const httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.token}),
        observe: 'response' as 'response'
      };
      const datas = await this.http.get<any>(requestTrelloKaban, httpOptions).toPromise();
      this.getBoard = datas.body;
    } else {
      const div6 = document.getElementById('disp').classList.remove('displayNone');
      const div9 = document.getElementById('notActivated').classList.remove('displayNone');
    }
  }

  public clickTrello1(): void {
    const div9 = document.getElementById('trello2').classList.add('displayNone');
    const div10 = document.getElementById('disp8').classList.remove('displayNone');
    const div11 = document.getElementById('settingTrello1').classList.remove('displayNone');
    const div12 = document.getElementById('settingTrelloTime1').classList.remove('displayNone');
    const div14 = document.getElementById('btn11').classList.remove('displayNone');
  }

  public clickTrello2(): void {
    const div9 = document.getElementById('trello1').classList.add('displayNone');
    const div10 = document.getElementById('disp8').classList.remove('displayNone');
    const div11 = document.getElementById('settingTrello2').classList.remove('displayNone');
    const div12 = document.getElementById('settingTrelloUser2').classList.remove('displayNone');
    const div13 = document.getElementById('settingTrelloTime2').classList.remove('displayNone');
    const div14 = document.getElementById('btn12').classList.remove('displayNone');
  }

  public clickAir(): void {
    const div0 = document.getElementById('weather').classList.add('displayNone');
    const div1 = document.getElementById('github').classList.add('displayNone');
    const div3 = document.getElementById('yammer').classList.add('displayNone');
    const div4 = document.getElementById('epitech').classList.add('displayNone');
    const div9 = document.getElementById('trello').classList.add('displayNone');
    const div10 = document.getElementById('crypto').classList.add('displayNone');

    const div6 = document.getElementById('disp').classList.remove('displayNone');
    const div7 = document.getElementById('air1').classList.remove('displayNone');
  }

  public clickAir1(): void {
    const div10 = document.getElementById('disp9').classList.remove('displayNone');
    const div11 = document.getElementById('settingAirCity').classList.remove('displayNone');
    const div12 = document.getElementById('settingAirMs').classList.remove('displayNone');
    const div14 = document.getElementById('btn13').classList.remove('displayNone');
  }

  async createAir() {
    const requestWeatherCurrent = this.baseUrl + 'air_quality';
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    const body = {
      city: this.air.city,
      time: this.air.time
    };
    console.log(body);
    let resWidgets;
    const datas = await this.http.post<any>(requestWeatherCurrent, body, httpOptions).toPromise();
    resWidgets = datas.body;
    const id = this.getId(resWidgets);
    this.store.createWidgets('widgets', resWidgets);
    this.air = {
      city: '',
      time: ''
    };
    this.modalService.dismissAll();
    this.ref.markForCheck();
    this.dashboard.push({
      cols: resWidgets[id].position.cols,
      rows: resWidgets[id].position.rows,
      x: resWidgets[id].position.x,
      y: resWidgets[id].position.y,
      type: resWidgets[id].name,
      id: resWidgets[id].id,
      city: resWidgets[id].params.city,
      time: resWidgets[id].params.time
    });
  }

  async createTrelloMemberTasks() {
    const requestGithubIssues = this.baseUrl + 'trello_member_tasks';
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    let resWidgets;
    const datas = await this.http.post<any>(requestGithubIssues, this.trello1, httpOptions).toPromise();
    resWidgets = datas.body;
    console.log(resWidgets);
    const id = this.getId(resWidgets);
    this.store.createWidgets('widgets', resWidgets);
    this.trello1 = {
      board_id: '',
      member_id: '',
      time: ''
    };
    this.modalService.dismissAll();
    this.ref.markForCheck();
    this.dashboard.push({
      cols: resWidgets[id].position.cols,
      rows: resWidgets[id].position.rows,
      x: resWidgets[id].position.x,
      y: resWidgets[id].position.y,
      type: resWidgets[id].name,
      id: resWidgets[id].id,
      board_id: resWidgets[id].params.board_id,
      member_id: resWidgets[id].params.member_id,
      time: resWidgets[id].params.time
    });
  }

  async createTrelloListTable() {
    const requestGithubIssues = this.baseUrl + 'trello_board';
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    let resWidgets;
    const datas = await this.http.post<any>(requestGithubIssues, this.trello, httpOptions).toPromise();
    resWidgets = datas.body;
    console.log(resWidgets);
    const id = this.getId(resWidgets);
    this.store.createWidgets('widgets', resWidgets);
    this.trello = {
      board_id: '',
      time: ''
    };
    this.modalService.dismissAll();
    this.ref.markForCheck();
    this.dashboard.push({
      cols: resWidgets[id].position.cols,
      rows: resWidgets[id].position.rows,
      x: resWidgets[id].position.x,
      y: resWidgets[id].position.y,
      type: resWidgets[id].name,
      id: resWidgets[id].id,
      board_id: resWidgets[id].params.board_id,
      time: resWidgets[id].params.time
    });
  }

  async createGithubIssues() {
    const requestGithubIssues = this.baseUrl + 'repo_issues';
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    let resWidgets;
    const datas = await this.http.post<any>(requestGithubIssues, this.github, httpOptions).toPromise();
    resWidgets = datas.body;
    console.log(resWidgets);
    const id = this.getId(resWidgets);
    this.store.createWidgets('widgets', resWidgets);
    this.github = {
      repo_url: '',
      time: ''
    };
    this.modalService.dismissAll();
    this.ref.markForCheck();
    this.dashboard.push({
      cols: resWidgets[id].position.cols,
      rows: resWidgets[id].position.rows,
      x: resWidgets[id].position.x,
      y: resWidgets[id].position.y,
      type: resWidgets[id].name,
      id: resWidgets[id].id,
      repo_url: resWidgets[id].params.repo_url,
      time: resWidgets[id].params.time
    });
  }

  async createGithubCommits() {
    const requestGithubCommits = this.baseUrl + 'repo_commits';
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    let resWidgets;
    const datas = await this.http.post<any>(requestGithubCommits, this.github, httpOptions).toPromise();
    resWidgets = datas.body;
    console.log(resWidgets);
    const id = this.getId(resWidgets);
    this.store.createWidgets('widgets', resWidgets);
    this.github = {
      repo_url: '',
      time: ''
    };
    this.modalService.dismissAll();
    this.ref.markForCheck();
    this.dashboard.push({
      cols: resWidgets[id].position.cols,
      rows: resWidgets[id].position.rows,
      x: resWidgets[id].position.x,
      y: resWidgets[id].position.y,
      type: resWidgets[id].name,
      id: resWidgets[id].id,
      repo_url: resWidgets[id].params.repo_url,
      time: resWidgets[id].params.time
    });
  }

  async createYammerThread() {
    const requestWeatherCurrent = this.baseUrl + 'thread_messages';
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    let resWidgets;
    const datas = await this.http.post<any>(requestWeatherCurrent, this.yammer1, httpOptions).toPromise();
    resWidgets = datas.body;
    console.log(resWidgets);
    const id = this.getId(resWidgets);
    this.store.createWidgets('widgets', resWidgets);
    this.yammer1 = {
      thread_url: '',
      time: ''
    };
    this.modalService.dismissAll();
    this.ref.markForCheck();
    this.dashboard.push({
      cols: resWidgets[id].position.cols,
      rows: resWidgets[id].position.rows,
      x: resWidgets[id].position.x,
      y: resWidgets[id].position.y,
      type: resWidgets[id].name,
      id: resWidgets[id].id,
      thread_url: resWidgets[id].params.thread_url,
      time: resWidgets[id].params.time
    });
  }

  async createYammerMessage() {
    const requestWeatherCurrent = this.baseUrl + 'group_messages';
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    let resWidgets;
    const datas = await this.http.post<any>(requestWeatherCurrent, this.yammer, httpOptions).toPromise();
    resWidgets = datas.body;
    console.log(resWidgets);
    const id = this.getId(resWidgets);
    this.store.createWidgets('widgets', resWidgets);
    this.yammer = {
      group_url: '',
      time: ''
    };
    this.modalService.dismissAll();
    this.ref.markForCheck();
    this.dashboard.push({
      cols: resWidgets[id].position.cols,
      rows: resWidgets[id].position.rows,
      x: resWidgets[id].position.x,
      y: resWidgets[id].position.y,
      type: resWidgets[id].name,
      id: resWidgets[id].id,
      group_url: resWidgets[id].params.group_url,
      time: resWidgets[id].params.time
    });
  }

  async createIntraInfo() {
    const requestWeatherCurrent = this.baseUrl + 'intra_infos';
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    let resWidgets;
    const datas = await this.http.post<any>(requestWeatherCurrent, this.intra1, httpOptions).toPromise();
    resWidgets = datas.body;
    const id = this.getId(resWidgets);
    this.store.createWidgets('widgets', resWidgets);
    this.intra1 = {
      info_type: '',
      time: ''
    };
    this.modalService.dismissAll();
    this.ref.markForCheck();
    this.dashboard.push({
      cols: resWidgets[id].position.cols,
      rows: resWidgets[id].position.rows,
      x: resWidgets[id].position.x,
      y: resWidgets[id].position.y,
      type: resWidgets[id].name,
      id: resWidgets[id].id,
      info_type: resWidgets[id].params.type,
      time: resWidgets[id].params.time
    });
  }

  async createIntraModules() {
    const requestWeatherCurrent = this.baseUrl + 'intra_modules';
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    let resWidgets;
    console.log(this.intra);
    const datas = await this.http.post<any>(requestWeatherCurrent, this.intra, httpOptions).toPromise();
    resWidgets = datas.body;
    const id = this.getId(resWidgets);
    this.store.createWidgets('widgets', resWidgets);
    this.intra = {
      subscribed: '',
      time: ''
    };
    this.modalService.dismissAll();
    this.ref.markForCheck();
    this.dashboard.push({
      cols: resWidgets[id].position.cols,
      rows: resWidgets[id].position.rows,
      x: resWidgets[id].position.x,
      y: resWidgets[id].position.y,
      type: resWidgets[id].name,
      id: resWidgets[id].id,
      subscribed: resWidgets[id].params.subscribed,
      time: resWidgets[id].params.time
    });
  }

  async createCryptoWorth() {
    const requestWeatherCurrent = this.baseUrl + 'crypto_actual_worth';
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    let resWidgets;
    const datas = await this.http.post<any>(requestWeatherCurrent, this.crypto, httpOptions).toPromise();
    resWidgets = datas.body;
    const id = this.getId(resWidgets);
    this.store.createWidgets('widgets', resWidgets);
    this.crypto = {
      crypto: '',
      currency: '',
      time: ''
    };
    this.modalService.dismissAll();
    this.ref.markForCheck();
    this.dashboard.push({
      cols: resWidgets[id].position.cols,
      rows: resWidgets[id].position.rows,
      x: resWidgets[id].position.x,
      y: resWidgets[id].position.y,
      type: resWidgets[id].name,
      id: resWidgets[id].id,
      crypto_currency: resWidgets[id].params.crypto_currency,
      currency: resWidgets[id].params.currency,
      time: resWidgets[id].params.time
    });
  }

  async createCryptoValue() {
    const requestWeatherCurrent = this.baseUrl + 'crypto_actual_value';
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    let resWidgets;
    const datas = await this.http.post<any>(requestWeatherCurrent, this.crypto, httpOptions).toPromise();
    resWidgets = datas.body;
    const id = this.getId(resWidgets);
    this.store.createWidgets('widgets', resWidgets);
    this.crypto = {
      crypto: '',
      currency: '',
      time: ''
    };
    this.modalService.dismissAll();
    this.ref.markForCheck();
    this.dashboard.push({
      cols: resWidgets[id].position.cols,
      rows: resWidgets[id].position.rows,
      x: resWidgets[id].position.x,
      y: resWidgets[id].position.y,
      type: resWidgets[id].name,
      id: resWidgets[id].id,
      crypto_currency: resWidgets[id].params.crypto_currency,
      currency: resWidgets[id].params.currency,
      time: resWidgets[id].params.time
    });
  }

  async createWeatherForcast() {
    const requestWeatherCurrent = this.baseUrl + 'forecast_weather';
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    const body = {
      city: this.weather.city,
      time: this.weather.time
    };
    console.log(body);
    let resWidgets;
    const datas = await this.http.post<any>(requestWeatherCurrent, body, httpOptions).toPromise();
    resWidgets = datas.body;
    const id = this.getId(resWidgets);
    this.store.createWidgets('widgets', resWidgets);
    this.weather = {
      city: '',
      time: ''
    };
    this.modalService.dismissAll();
    this.ref.markForCheck();
    this.dashboard.push({
      cols: resWidgets[id].position.cols,
      rows: resWidgets[id].position.rows,
      x: resWidgets[id].position.x,
      y: resWidgets[id].position.y,
      type: resWidgets[id].name,
      id: resWidgets[id].id,
      city: resWidgets[id].params.city,
      time: resWidgets[id].params.time
    });
  }

  async createWeatherCurrent() {
    const requestWeatherCurrent = this.baseUrl + 'current_weather';
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    const body = {
      city: this.weather.city,
      time: this.weather.time
    };
    console.log(body);
    let resWidgets;
    const datas = await this.http.post<any>(requestWeatherCurrent, body, httpOptions).toPromise();
    resWidgets = datas.body;
    const id = this.getId(resWidgets);
    this.store.createWidgets('widgets', resWidgets);
    this.weather = {
      city: '',
      time: ''
    };
    this.modalService.dismissAll();
    this.ref.markForCheck();
    this.dashboard.push({
      cols: resWidgets[id].position.cols,
      rows: resWidgets[id].position.rows,
      x: resWidgets[id].position.x,
      y: resWidgets[id].position.y,
      type: resWidgets[id].name,
      id: resWidgets[id].id,
      city: resWidgets[id].params.city,
      time: resWidgets[id].params.time
    });
  }

  public getId(widget) {
    for (const each in widget) {
      return each;
    }
    return null;
  }

  ngOnInit() {
    this.baseUrl = this.store.getUrl();
    this.data = this.store.getData('user');
    this.token = this.store.getData('token');
    this.servicesActive = this.store.getData('services');
    this.widgets = this.store.getData('widgets');
    this.dashboard = [];
    for (const each in this.widgets) {
      console.log(this.widgets[each]);
      this.dashboard.push({
        cols: this.widgets[each].position.cols,
        rows: this.widgets[each].position.rows,
        x: this.widgets[each].position.x,
        y: this.widgets[each].position.y,
        type: this.widgets[each].name,
        id: this.widgets[each].id,
        city: this.widgets[each].params.city,
        crypto_currency: this.widgets[each].params.crypto_currency,
        currency: this.widgets[each].params.currency,
        subscribed: this.widgets[each].params.subscribed,
        info_type: this.widgets[each].params.type,
        group_url: this.widgets[each].params.group_url,
        thread_url: this.widgets[each].params.thread_url,
        repo_url: this.widgets[each].params.repo_url,
        board_id: this.widgets[each].params.board_id,
        member_id: this.widgets[each].params.member_id,
        time: this.widgets[each].params.time
      });
    }
    this.widgets = [];
  }

  public removeItem($event, item) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
    console.log(item);
    const requestDeleteWidget = this.baseUrl + 'delete_widget?id=' + item.id;
    const httpOptions = {
      headers: new HttpHeaders({'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    this.http.delete(requestDeleteWidget, httpOptions)
      .subscribe(success => {
          this.store.saveData('widgets', <any>success.body);
        },
        error => {
          console.log(error);
        }
      );
  }

  public getUserBoard(): void {
    $('#select1').attr('disabled', true);
    const requestDeleteWidget = this.baseUrl + 'get_boards_member';
    const httpOptions = {
      headers: new HttpHeaders({'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    const body = {
      board_id: this.trello1.board_id
    };
    this.http.post(requestDeleteWidget, body, httpOptions)
      .subscribe(success => {
          this.userInBoard = <any> success.body;
          $('#select1').attr('disabled', false);
          console.log(this.userInBoard);
        },
        error => {
          console.log(error);
        }
      );
  }

  public getUserBoardSettings(): void {
    $('#select1').attr('disabled', true);
    const requestDeleteWidget = this.baseUrl + 'get_boards_member';
    const httpOptions = {
      headers: new HttpHeaders({'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    const body = {
      board_id: this.trello1S.board_id
    };
    this.http.post(requestDeleteWidget, body, httpOptions)
      .subscribe(success => {
          this.userInBoard = <any> success.body;
          $('#select1').attr('disabled', false);
          console.log(this.userInBoard);
        },
        error => {
          console.log(error);
        }
      );
  }

  public addWidget(): void {
    this.modalService.open(this.modalAdd);
  }

  public logout(): void {
    this.store.clearLocal();
    this.route.navigate(['/login']);
  }
}
