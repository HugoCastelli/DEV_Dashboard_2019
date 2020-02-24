import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation, ViewRef
} from '@angular/core';
import {Subscription} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StorageService} from '../../../localStorage.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-forecast-weather',
  templateUrl: './ForecastWeather.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ForecastWeatherComponent implements OnInit, OnDestroy {
  data;
  token;
  @Input() widget;
  @Input() resizeEvent: EventEmitter<any>;
  resizeSub: Subscription;
  newWidget;
  baseUrl;

  constructor(public http: HttpClient, public store: StorageService, private ref: ChangeDetectorRef, private spinner: NgxSpinnerService) {
    this.baseUrl = this.store.getUrl();
    this.data = this.store.getData('user');
    this.token = this.store.getData('token');
    setInterval(() => {
      if (this.ref && !(this.ref as ViewRef).destroyed) {
        this.ref.detectChanges();
      }
      if (this.widget.update === true) {
        this.widget.update = false;
        this.ngOnInit();
      }
    }, 1000);
  }

  async ngOnInit() {
    this.spinner.show(this.widget.id);
    this.resizeSub = this.resizeEvent.subscribe((widget) => {
      if (widget === this.widget) { // or check id , type or whatever you have there
        // resize your widget, chart, map , etc.
      }
    });

    const requestWeather = this.baseUrl + 'forecast_weather?city=' + this.widget.city + '&widget_id=' + this.widget.id;
    const httpOptions = {
      headers: new HttpHeaders({'Authorization': this.token}),
      observe: 'response' as 'response'
    };
    await this.http.get(requestWeather, httpOptions)
      .subscribe(success => {
          console.log(<any>success.body);
          this.ref.markForCheck();
          this.newWidget = <any>success.body;
          console.log(this.newWidget[0]);
          this.spinner.hide(this.widget.id);
        },
        error => {
          console.log(error);
        }
      );
    this.updateWidget();
  }

  updateWidget() {
    const interval = setInterval(callback => {
      const requestWeather = this.baseUrl + 'forecast_weather?city=' + this.widget.city + '&widget_id=' + this.widget.id;
      const httpOptions = {
        headers: new HttpHeaders({'Authorization': this.token}),
        observe: 'response' as 'response'
      };
      this.http.get(requestWeather, httpOptions)
          .subscribe(success => {
                // @ts-ignore
                if (success.body.code === 601) {
                  clearInterval(interval);
                }
                console.log(<any>success.body);
                this.ref.markForCheck();
                this.newWidget = <any>success.body;
                console.log(this.newWidget[0])
              },
              error => {
                console.log(error);
              }
          );
    }, this.widget.time * 60 * 1000);
  }

  ngOnDestroy() {
    this.resizeSub.unsubscribe();
  }
}
