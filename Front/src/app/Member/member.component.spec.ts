import {LayoutModule} from '@angular/cdk/layout';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {RouterModule} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {MemberComponent} from './member.component';
import {FormsModule} from '@angular/forms';
import {MomentModule} from 'ngx-moment';
import {StorageService} from '../localStorage.service';
import {AuthService} from 'angular5-social-login';
import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('MemberComponent', () => {
  let component: MemberComponent;
  let fixture: ComponentFixture<MemberComponent>;
  let service: MemberComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MemberComponent],
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
        HttpClientModule
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
    fixture = TestBed.createComponent(MemberComponent);
    component = fixture.componentInstance;
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
