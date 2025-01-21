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
  recognition: any;
  diagnosticMessage: string = '';
  showSpotify: boolean = false; // Pour afficher/masquer <app-spotify>
  showMeteo: boolean = false; // Pour afficher/masquer <app-meteo>

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.spotifyService.getAccessToken().subscribe({
      next: (response: any) => {
        console.log('Réponse de Spotify:', response);
        this.accessToken = response.access_token;
      },
      error: (error: any) => {
        console.error('Erreur lors de la récupération du token:', error);
      }
    });
  
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
    if (!SpeechRecognition) {
      console.error('La reconnaissance vocale n\'est pas supportée par ce navigateur.');
      return;
    }
  
    console.log('Initialisation de la reconnaissance vocale...');
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'fr-FR';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
  
    this.recognition.onresult = (event: any) => {
      console.log('Événement onresult déclenché.');
      const command = event.results[0][0].transcript.toLowerCase();
      console.log(`Commande reconnue : "${command}"`);
      this.diagnosticMessage = `Commande reconnue : ${command}`;
      this.handleCommand(command);
    };
  
    this.recognition.onspeechend = () => {
      console.log('Fin de l\'écoute.');
      this.recognition.stop();
    };
  
    this.recognition.onerror = (event: any) => {
      console.error('Erreur de reconnaissance vocale :', event.error);
      this.diagnosticMessage = `Erreur : ${event.error}`;
    };
  
    console.log('Reconnaissance vocale prête.');

  }

  // Méthode pour démarrer la reconnaissance vocale
  startRecognition(): void {
    if (this.recognition) {
      console.log('Début de la reconnaissance vocale...');
      this.diagnosticMessage = 'Prêt à écouter une commande vocale...';
      this.recognition.start();
    } else {
      console.error("La reconnaissance vocale n'est pas initialisée.");
    }
  }
  
  handleCommand(command: string): void {
    console.log(`Commande reçue pour analyse : "${command}"`);
  
    if (command.includes('spotify')) {
      console.log('Commande reconnue : afficher Spotify');
      this.showSpotify = true;
      this.showMeteo = false;
    } else if (command.includes('météo') || command.includes('meteo')) {
      console.log('Commande reconnue : afficher Météo');
      this.showMeteo = true;
      this.showSpotify = false;
    } else {
      console.warn(`Commande non reconnue : "${command}"`);
      this.diagnosticMessage = `Commande non reconnue : "${command}"`;
      this.showSpotify = false;
      this.showMeteo = false;
    }
  
    console.log('État des composants :', {
      showSpotify: this.showSpotify,
      showMeteo: this.showMeteo,
    });
  }
  


}
