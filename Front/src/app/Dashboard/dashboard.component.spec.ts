import {LayoutModule} from '@angular/cdk/layout';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MomentModule} from 'ngx-moment';
import {DashboardComponent} from './dashboard.component';
import {FormsModule} from '@angular/forms';
import {GridsterModule} from 'angular-gridster2';
import {RouterTestingModule} from '@angular/router/testing';
import {RouterModule} from '@angular/router';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import {AuthService} from 'angular5-social-login';
import {StorageService} from '../localStorage.service';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let service: DashboardComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        NoopAnimationsModule,
        LayoutModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        FormsModule,
        MomentModule,
        RouterTestingModule,
        RouterModule,
        HttpClientTestingModule,
        HttpClientModule,
        GridsterModule
      ],
      providers: [
        {provide: AuthService},
        {provide: StorageService}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents().then(() => {
      service = TestBed.get(StorageService);
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it(`should change widget current_weather`, () => {
    expect(component.openSettings('current_weather')).toBeTruthy();
  });

  it(`should change widget forcast weather`, () => {
    expect(component.openSettings('forcast_weather')).toBeTruthy();
  });

  it(`should change widget crypto_actual_value`, () => {
    expect(component.openSettings('crypto_actual_value')).toBeTruthy();
  });

  it(`should change widget crypto_actual_worth`, () => {
    expect(component.openSettings('crypto_actual_worth')).toBeTruthy();
  });

  it(`should change widget intra_modules`, () => {
    expect(component.openSettings('intra_modules')).toBeTruthy();
  });
});
