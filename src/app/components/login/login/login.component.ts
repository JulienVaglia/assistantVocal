import { Component } from '@angular/core';
import { SpotifyService } from '../../../business/service/spotify/spotify.service';
import { Spotify } from '../../../business/models/spotify/spotify';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  logs: Spotify = {
    clientID: "",
    clientSecret: ""
  }
 
  constructor(readonly spotifyService: SpotifyService) {

  }

  public getSpotyToken() {
    this.spotifyService.authenticate(this.logs)

  }
}
