import {Component} from '@angular/core';
import {MeteoService} from '../../../business/service/meteo/meteo.service';
import {FormsModule} from '@angular/forms';
import {fromInteropObservable} from 'rxjs/internal/observable/innerFrom';

@Component({
  selector: 'app-meteo',
  imports: [
    FormsModule
  ],
  templateUrl: './meteo.component.html',
  styleUrl: './meteo.component.scss'
})
export class MeteoComponent {
  weatherData: any;
  errorMessage: any;
  city: string = "marseille"

  constructor(private meteoService: MeteoService) {
  }

  ngOnInit() {
    this.getWeatherData();
  }

  getWeatherData(): void {
    if (!this.city?.trim()) {
      this.errorMessage = "Renseignez une ville."
      this.weatherData = null;
      return;
    }
    this.errorMessage = ""
    this.meteoService.getWeather(this.city).subscribe(
      data => {
        this.weatherData = data;
        console.log(data.weather)
      }
      ,
      error => {
        console.error('Erreur lors de la récupération des données météo:', error);
      }
    )
  }
}


