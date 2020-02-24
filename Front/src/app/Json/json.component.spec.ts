import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {JsonComponent} from './json.component';
import {FormsModule} from '@angular/forms';
import {StorageService} from '../localStorage.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {RouterModule} from '@angular/router';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('JsonComponent', () => {
  let component: JsonComponent;
  let fixture: ComponentFixture<JsonComponent>;
  let service: JsonComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JsonComponent],
      imports: [FormsModule,
        HttpClientTestingModule,
        HttpClientModule,
        RouterTestingModule,
        RouterModule],
      providers: [
        {provide: StorageService}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents().then(() => {
      service = TestBed.get(StorageService);
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
