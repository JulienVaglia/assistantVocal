import { Component } from '@angular/core';
import { Spotify } from '../../../business/models/spotify/spotify';
import { FormsModule } from '@angular/forms';
import { SpotifyService } from '../../../business/service/spotify/spotify.service';
import {RouterOutlet} from '@angular/router';
import {MeteoComponent} from '../../meteo/meteo/meteo.component';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MeteoComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  logs: Spotify = {
    clientID: "",
    clientSecret: ""
  }

  profile: any;

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');

    if (code) {
      this.spotifyService.getAccessToken(code).then((token) => {
        this.spotifyService.fetchProfile(token).then((profile) => {
          this.profile = profile;
        });
      });
    }
  }

  login(): void {
    this.spotifyService.redirectToAuthCodeFlow();
  }

  onSubmit(): void {
    console.log('Client ID:', this.logs.clientID);
    console.log('Client Secret:', this.logs.clientSecret);
  }


}
