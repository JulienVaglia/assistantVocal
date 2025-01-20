import { Component, OnInit } from '@angular/core';
import { Spotify } from '../../../business/models/spotify/spotify';
import { FormsModule } from '@angular/forms';
import { SpotifyService } from '../../../business/service/spotify/spotify.service';
import {RouterOutlet} from '@angular/router';
import {MeteoComponent} from '../../meteo/meteo/meteo.component';
import { SpotifyComponent } from '../../spotify/spotify/spotify.component';

@Component({
  selector: 'app-login',
  imports: [FormsModule, SpotifyComponent,MeteoComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

  logs: Spotify = {
    clientID: "",
    clientSecret: ""
  }
  accessToken: string | null = null;

  profile: any;

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.spotifyService.getAccessToken().subscribe({
      next: (response) => {
        console.log('Réponse de Spotify:', response);
        this.accessToken = response.access_token;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du token:', error);
      }
    });

  }


}
