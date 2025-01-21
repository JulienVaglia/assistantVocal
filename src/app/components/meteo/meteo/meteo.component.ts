import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MeteoService } from '../../../business/service/meteo/meteo.service';
import { FormsModule } from '@angular/forms';

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
  weatherIconUrl: string | undefined;
  @Input() city: string | undefined

  constructor(private meteoService: MeteoService) {
  }

  ngOnInit() {
    this.getWeatherData();
  }

  ngOnChanges(changes: SimpleChanges): void { if (changes['city']) { this.getWeatherData(); } }

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
        if (data.weather && data.weather[0]) {
          this.weatherIconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        }
      }
      ,
      error => {
        this.errorMessage = "veuillez réessayer";
      }
    )
  }
}


