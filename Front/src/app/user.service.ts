import {Injectable} from '@angular/core';
import {StorageService} from './localStorage.service';

@Injectable()
export class UserService {
  constructor(public store: StorageService) {
  }

  loggedIn() {
    return !!this.store.getData('token');
  }
}
