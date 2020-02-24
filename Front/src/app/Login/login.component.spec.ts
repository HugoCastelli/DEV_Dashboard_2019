import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {LoginComponent} from './login.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AuthService} from 'angular5-social-login';
import {RouterModule} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {StorageService} from '../localStorage.service';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let service: StorageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule,
        HttpClientTestingModule,
        HttpClientModule,
        RouterTestingModule,
        RouterModule],
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
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
