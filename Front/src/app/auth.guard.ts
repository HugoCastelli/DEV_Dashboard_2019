import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private user: UserService, private router: Router) {
  }

  canActivate(): boolean {
    if (this.user.loggedIn()) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
