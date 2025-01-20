import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Spotify } from '../../models/spotify/spotify';


@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private redirectUri = 'http://localhost:4200/callback';
  private accessToken: string | null = null;

  constructor(private http: HttpClient) { }

  // Obtenir un token d'accès
  authenticate(logs: Spotify): Observable<any> {
    const body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');

    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${logs.clientID}:${logs.clientSecret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    console.log("authenticate:", this.http.post(environment.UrlSprotify + '/token', body.toString(), { headers }))
    return this.http.post(environment.UrlSprotify + '/token', body.toString(), { headers });
  }

  // Rechercher un morceau
  searchTrack(query: string): Observable<any> {
    if (!this.accessToken) {
      throw new Error('Token non disponible. Authentifiez-vous d\'abord.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`
    });

    return this.http.get(`https://api.spotify.com/v1/search?q=${query}&type=track`, { headers });
  }

  // Définir le token d'accès après authentification
  setAccessToken(token: string): void {
    this.accessToken = token;
  }
}
