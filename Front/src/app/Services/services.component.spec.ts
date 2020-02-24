import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {LayoutModule} from '@angular/cdk/layout';
import {ServicesComponent} from './services.component';
import {FormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MomentModule} from 'ngx-moment';
import {StorageService} from '../localStorage.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {RouterModule} from '@angular/router';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('ServicesComponent', () => {
  let component: ServicesComponent;
  let fixture: ComponentFixture<ServicesComponent>;
  let service: ServicesComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ServicesComponent],
      imports: [NoopAnimationsModule,
        LayoutModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        FormsModule,
        MomentModule,
        HttpClientTestingModule,
        HttpClientModule,
        RouterTestingModule,
        RouterModule],
      providers:  [
        {provide: StorageService}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents().then(() => {
      service = TestBed.get(StorageService);
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
