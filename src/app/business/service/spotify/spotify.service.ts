import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService{

  private clientId = '1795d6068e09425c880ad3ba73bc53a2';
  private clientSecret: string = 'e800074070be4488b063004d1a6aab55';
  private readonly tokenUrl= 'https://accounts.spotify.com/api/token';

  constructor(private http: HttpClient) {}


//  Obtenir un token d'accès depuis Spotify
  getAccessToken(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`
    });

    const body = new URLSearchParams({
      grant_type: 'client_credentials'
    }).toString();

    return this.http.post(this.tokenUrl, body, { headers });
  }

// Recherche d'une musique Spotify
  getTrack(query: string, accessToken: string): Observable<any>{
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}` // Token d'accès
    });

    // Construction des paramètres de la requête
    const params = {
      q: query, // Terme de recherche
      type: 'track' // Type de recherche (ici, on recherche uniquement des morceaux)
    };

    // Appel GET à l'API Spotify
    return this.http.get( environment.apiUrlSpotify + `/search`, { headers, params });
  }

}
