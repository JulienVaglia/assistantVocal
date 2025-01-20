import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment.development';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MeteoService {
  constructor(private httpClient: HttpClient) { }
  getWeather(city:string):Observable<any> {
    const url = `${environment.UrlOpenWeather}?q=${city}&appid=${environment.API_Key}&units=metric`;
    return this.httpClient.get(url)
  }
}
