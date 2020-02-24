import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StorageService} from '../localStorage.service';
declare var $: any;

@Component({
  selector: 'app-json',
  templateUrl: './json.component.html',
  styleUrls: ['./json.component.css']
})
export class JsonComponent implements OnInit {
  baseUrl;
  json;

  constructor(private store: StorageService, public http: HttpClient) {
  }

  ngOnInit() {
    this.baseUrl = this.store.getUrl();
    const requestWeather = this.baseUrl + 'about.json';
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response' as 'response'
    };
    this.http.get(requestWeather, httpOptions)
      .subscribe(success => {
          console.log(<any>success.body);
          $('#myDiv').append(
            $('<pre>').append(
              $('<code>').text(
                JSON.stringify(<any> success.body, null, '  ')
              )
            )
          );
        },
        error => {
          console.log(error);
        }
      );
  }
}
