import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../../business/service/spotify/spotify.service';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-spotify',
  imports: [FormsModule],
  templateUrl: './spotify.component.html',
  styleUrl: './spotify.component.scss'
})
export class SpotifyComponent implements OnInit{

  query: string = ''; // Texte de recherche
  accessToken: string = ""; // Token d'accès
  searchResults: any[] = []; // Résultats de recherche

  constructor( private spotifyService: SpotifyService, private sanitizer: DomSanitizer ) {}

  ngOnInit(): void {
    // Obtenir un token d'accès lors du chargement du composant
    this.spotifyService.getAccessToken().subscribe({
      next: (response) => {
        console.log('Token récupéré:', response.access_token);
        this.accessToken = response.access_token; // Sauvegarder le token
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du token:', error);
      }
    });
  }

  searchSpotify() {
    this.spotifyService.getTrack(this.query, this.accessToken).subscribe((data) => {
      // Vérifiez et extrayez les données depuis "tracks.items"
      if (data?.tracks?.items) {
        this.searchResults = data.tracks.items; // Récupérer les pistes
      } else {
        console.warn('Aucun résultat trouvé.');
        this.searchResults = []; // Vide si pas de résultats
      }
      console.log('Résultats de recherche :', this.searchResults); // Debugging
    });
  }

  playPreview(previewUrl: string | null) {
    if (previewUrl) {
      const audio = new Audio(previewUrl);
      audio.play();
    } else {
      console.warn('Aucun extrait disponible pour ce titre.');
    }
  }

  getIframeUrl(trackId: string) {
    const url = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);  // Sanitize l'URL
  }

}
