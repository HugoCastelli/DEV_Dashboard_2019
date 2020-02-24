import {Injectable} from '@angular/core';
import {LocalStorageService} from 'ngx-store';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(public localStorageService: LocalStorageService) {
  }

  public saveData(string, value: any) {
    this.localStorageService.set(string, value);
  }

  public createWidgets(key: string, res): any {
    this.localStorageService.update(key, res);
  }

  public updateWidgetsPosition(key: string, id: string, x, y): any {
    const json = {
      [id]: {
        position: {
          x: x,
          y: y
        }
      }
    };
    this.localStorageService.update(key, json);
  }

  public updateWidgetsParams(key: string, res): any {
    this.localStorageService.update(key, res);
  }

  public getUrl() {
    return ('https://0.0.0.0:5000/');
  }

  public getPort() {
    return ('8080');
  }

  public getData(str) {
    return (this.localStorageService.get(str));
  }

  public clearLocal() {
    this.localStorageService.clear();
  }
}
