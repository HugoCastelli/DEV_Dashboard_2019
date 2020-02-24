import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AuthGuard} from './auth.guard';
import {UserService} from './user.service';
import {CommonModule} from '@angular/common';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './Login/login.component';
import {DashboardComponent} from './Dashboard/dashboard.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutModule} from '@angular/cdk/layout';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {GridsterModule} from 'angular-gridster2';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AuthServiceConfig, SocialLoginModule} from 'angular5-social-login';
import {getAuthServiceConfigs} from './socialLoginConfig';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {WebStorageModule} from 'ngx-store';
import {ServicesComponent} from './Services/services.component';
import {CurrentWeatherComponent} from './Dashboard/Widgets/CurrentWeather/CurrentWeather.component';
import {ForecastWeatherComponent} from './Dashboard/Widgets/ForecastWeather/ForecastWeather.component';
import {CryptoValueComponent} from './Dashboard/Widgets/CryptoValue/CryptoValue.component';
import {ParentDynamicComponent} from './Dashboard/Interfaces/parent-dynamic.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MomentModule} from 'ngx-moment';
import {CryptoWorthComponent} from './Dashboard/Widgets/CryptoWorth/CryptoWorth.component';
import {IntraModulesComponent} from './Dashboard/Widgets/IntraModules/IntraModules.component';
import {IntraInfoComponent} from './Dashboard/Widgets/IntraInfo/IntraInfo.component';
import {YammerGroupMessagesComponent} from './Dashboard/Widgets/YammerGroupMessages/YammerGroupMessages.component';
import {YammerThreadComponent} from './Dashboard/Widgets/YammerThread/YammerThread.component';
import {GithubCommitsComponent} from './Dashboard/Widgets/GithubCommits/GithubCommits.component';
import {GithubIssuesComponent} from './Dashboard/Widgets/GithubIssues/GithubIssues.component';
import {MemberComponent} from './Member/member.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {JsonComponent} from './Json/json.component';
import {TrelloListTableComponent} from './Dashboard/Widgets/TrelloListTable/TrelloListTable.component';
import {TrelloMemberTasksComponent} from './Dashboard/Widgets/TrelloMemberTasks/TrelloMemberTasks.component';
import {AirQualityComponent} from './Dashboard/Widgets/AirQuality/AirQuality.component';
import {AgmCoreModule} from '@agm/core';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ServicesComponent,
    CurrentWeatherComponent,
    ForecastWeatherComponent,
    CryptoValueComponent,
    ParentDynamicComponent,
    CryptoWorthComponent,
    IntraModulesComponent,
    IntraInfoComponent,
    YammerGroupMessagesComponent,
    YammerThreadComponent,
    GithubCommitsComponent,
    GithubIssuesComponent,
    MemberComponent,
    JsonComponent,
    TrelloListTableComponent,
    TrelloMemberTasksComponent,
    AirQualityComponent
  ],
  imports: [
    NgbModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    GridsterModule,
    HttpClientModule,
    SocialLoginModule,
    WebStorageModule,
    MatFormFieldModule,
    MomentModule,
    NgxSpinnerModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD1Gy1fpdHqZpQKWs-sVGCF_ngqLQhfCp0'
    }),
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    },
    AuthGuard,
    UserService,
    NgbActiveModal
  ],
  bootstrap: [AppComponent],
  exports: [DashboardComponent],
})
export class AppModule {
}
