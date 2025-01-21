import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SpotifyService } from '../../../business/service/spotify/spotify.service';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-spotify',
  imports: [FormsModule],
  templateUrl: './spotify.component.html',
  styleUrls: ['./spotify.component.scss']
})
export class SpotifyComponent implements OnInit, OnChanges {

  @Input() query: string = '';  // Commande reçue depuis le Login, pour la recherche
  accessToken: string = ""; // Token d'accès
  searchResults: any[] = []; // Résultats de la recherche

  constructor(
    private spotifyService: SpotifyService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Obtenir un token d'accès lors du chargement du composant
    this.spotifyService.getAccessToken().subscribe({
      next: (response) => {
        console.log('Token récupéré:', response.access_token);
        this.accessToken = response.access_token; // Sauvegarder le token
        // Si query est déjà renseignée, on déclenche la recherche
        if (this.query) {
          this.searchSpotify();
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du token:', error);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['query'] && this.query) {
      console.log('Recherche Spotify pour :', this.query);
      this.searchSpotify(); // Lancer la recherche dès que `query` change
    }
  }

  // Recherche sur Spotify avec le texte reçu
  searchSpotify(): void {
    if (!this.query) {
      console.warn('Aucune recherche demandée');
      return;
    }

    // Recherche du morceau ou artiste via le service Spotify
    this.spotifyService.getTrack(this.query, this.accessToken).subscribe({
      next: (data) => {
        if (data?.tracks?.items) {
          this.searchResults = data.tracks.items; // Récupérer les pistes
        } else {
          console.warn('Aucun résultat trouvé.');
          this.searchResults = []; // Vide si pas de résultats
        }
      },
      error: (error) => {
        console.error('Erreur lors de la recherche Spotify :', error);
        this.searchResults = []; // Réinitialiser si erreur
      }
    });
  }

  // Obtenir l'URL sécurisée de l'iframe Spotify pour afficher le lecteur
  getIframeUrl(trackId: string): any {
    const url = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0&autoplay=1`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url); // Sanitize l'URL pour éviter les risques de sécurité
  }
}
