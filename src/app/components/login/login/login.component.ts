import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../../business/service/spotify/spotify.service';
import { MeteoComponent } from "../../meteo/meteo/meteo.component";
import { SpotifyComponent } from '../../spotify/spotify/spotify.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [MeteoComponent, SpotifyComponent],
})
export class LoginComponent implements OnInit {
  city: string = 'marseille';
  query: string = ''; // Texte de recherche pour Spotify
  showSpotify: boolean = false; // Afficher ou masquer <app-spotify>
  showMeteo: boolean = false; // Afficher ou masquer <app-meteo>
  diagnosticMessage: string = ''; // Message de diagnostic
  recognition: any; // Instance de reconnaissance vocale

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit(): void {
    // Initialisation de la reconnaissance vocale
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("La reconnaissance vocale n'est pas supportée par ce navigateur.");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'fr-FR'; // Définir la langue en français
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    // Résultat de la reconnaissance vocale
    this.recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      console.log(`Commande reconnue : "${command}"`);
      this.diagnosticMessage = `Commande reconnue : ${command}`;
      this.handleCommand(command);
    };

    this.recognition.onspeechend = () => {
      // Si query est remplie, la recherche Spotify se déclenche automatiquement
      if (this.query) {
        this.showSpotify = true;
        this.showMeteo = false;
        console.log(`Recherche Spotify déclenchée automatiquement : "${this.query}"`);
      }
      this.recognition.stop();
    };

    this.recognition.onerror = (event: any) => {
      this.diagnosticMessage = `Erreur : ${event.error}`;
    };
  }

  // Démarrer la reconnaissance vocale
  startRecognition(): void {
    if (this.recognition) {
      console.log('Démarrage de la reconnaissance vocale...');
      this.diagnosticMessage = 'Prêt à écouter une commande vocale...';
      this.recognition.start();
    } else {
      console.error("La reconnaissance vocale n'est pas initialisée.");
    }
  }

// Traiter les commandes vocales
handleCommand(command: string): void {
  console.log(`Commande reçue : "${command}"`);

  // Réinitialiser les deux flags avant de traiter une nouvelle commande
  this.showSpotify = false;
  this.showMeteo = false;

  // Commande pour afficher Spotify avec une recherche
  if (command.includes('spotify')) {
    const searchQuery = command.replace('spotify', '').trim(); // Extrait la recherche après "Spotify"
    this.query = searchQuery; // Met à jour le champ de recherche
    console.log(`Recherche Spotify déclenchée : "${this.query}"`);
    this.showSpotify = true;
  }

  // Commande pour afficher Météo
  else if (command.includes('météo') || command.includes('meteo')) {
    console.log('Commande reconnue : afficher Météo');
    const cityMatch = command.match(/ville\s+de\s+([A-Z][a-z]*)/i);
    if (cityMatch && cityMatch[1]) {
      this.city = cityMatch[1].toLowerCase();
      console.log('Ville détectée :', this.city);
    } else {
      console.log('Aucune ville spécifiée.');
    }
    this.showMeteo = true;
  }

  // Commande non reconnue
  else {
    console.warn(`Commande non reconnue : "${command}"`);
    this.diagnosticMessage = `Commande non reconnue : "${command}"`;
  }
}
}
