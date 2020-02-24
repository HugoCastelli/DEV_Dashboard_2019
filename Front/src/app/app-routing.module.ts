import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './Login/login.component';
import {DashboardComponent} from './Dashboard/dashboard.component';
import {AuthGuard} from './auth.guard';
import {ServicesComponent} from './Services/services.component';
import {MemberComponent} from './Member/member.component';
import {JsonComponent} from './Json/json.component';

const routes: Routes = [

  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent},
  {path: 'services', canActivate: [AuthGuard], component: ServicesComponent},
  {path: 'member', canActivate: [AuthGuard], component: MemberComponent},
  {path: 'about.json', component: JsonComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
