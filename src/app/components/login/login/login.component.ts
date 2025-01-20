import {Component} from '@angular/core';
import {Spotify} from '../../../business/models/spotify/spotify';
import {FormsModule} from '@angular/forms';
import {SpotifyService} from '../../../business/service/spotify/spotify.service';
import {MeteoComponent} from '../../meteo/meteo/meteo.component';
import {VoiceRecorder} from '../../../business/service/voice/voiceRecorder.service';

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

  constructor(private spotifyService: SpotifyService, private voiceRecorder: VoiceRecorder) {
  }

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

// voice
  transcription: string = '';
  isRecording: boolean = false;


  // Démarrer ou arrêter l'enregistrement
  toggleRecording(): void {
    console.log("toggle")
    if (this.isRecording) {
      const audioBlob = this.voiceRecorder.stopRecording();
      if (audioBlob) {
        // Une fois l'enregistrement terminé, envoyer l'audio au backend pour transcription
        const file = new File([audioBlob], 'audio.wav', {type: 'audio/wav'});

        this.voiceRecorder.transcribeAudio(file).subscribe(
          (response) => {
            this.transcription = response.transcription;
            console.log(this.transcription);
          },
          (error) => {
            console.error('Erreur de transcription:', error);
          }
        );
      }
    } else {
      this.voiceRecorder.startRecording();
    }
    this.isRecording = !this.isRecording;
  }

  // Fonction pour lire l'audio enregistré
  playAudio(): void {
    this.voiceRecorder.playAudio();
  }

}
