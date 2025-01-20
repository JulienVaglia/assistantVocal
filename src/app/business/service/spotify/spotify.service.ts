import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private clientId = '1795d6068e09425c880ad3ba73bc53a2';
  private clientSecret: string = 'e800074070be4488b063004d1a6aab55';
  private redirectUri = 'http://localhost:4200'; 

  private tokenEndpoint = 'https://accounts.spotify.com/api/token';
  private authorizeEndpoint = 'https://accounts.spotify.com/authorize';
  private scopes = 'user-read-private user-read-email'; // Scopes nécessaires
  private verifierKey = 'code_verifier'; // Stocker le code verifier dans localStorage

  constructor(private http: HttpClient) {}

  /**
   * Redirige l'utilisateur vers la page d'autorisation de Spotify
   */
  async redirectToAuthCodeFlow() {
    const verifier = this.generateCodeVerifier(128);
    const challenge = await this.generateCodeChallenge(verifier);

    // Stocke le code verifier pour l'utiliser lors de la demande de token
    localStorage.setItem(this.verifierKey, verifier);

    // Paramètres de la requête d'autorisation
    const params = new HttpParams()
      .set('client_id', this.clientId)
      .set('response_type', 'code')
      .set('redirect_uri', this.redirectUri)
      .set('scope', this.scopes)
      .set('code_challenge_method', 'S256')
      .set('code_challenge', challenge);

    // Redirection vers la page d'autorisation Spotify
    document.location.href = `${this.authorizeEndpoint}?${params.toString()}`;
  }

  /**
   * Obtient un token d'accès avec un code d'autorisation
   */
  async getAccessToken(code: string): Promise<string> {
    const verifier = localStorage.getItem(this.verifierKey);
    if (!verifier) {
      throw new Error('Code introuvable dans localStorage.');
    }

    const body = new HttpParams()
      .set('client_id', this.clientId)
      .set('grant_type', 'authorization_code')
      .set('code', code)
      .set('redirect_uri', this.redirectUri)
      .set('code_verifier', verifier);

    // Appel API pour obtenir le token
    const response: any = await firstValueFrom(
      this.http.post(this.tokenEndpoint, body.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
    );

    const accessToken = response.access_token;
    localStorage.setItem('spotify_access_token', accessToken); // Optionnel : stockage local
    return accessToken;
  }

  /**
   * Récupère le profil de l'utilisateur à l'aide du token d'accès
   */
  async fetchProfile(token: string): Promise<any> {
    const response: any = await firstValueFrom(
      this.http.get('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
    return response;
  }

  /**
   * Génère un code verifier pour le flux PKCE
   */
  private generateCodeVerifier(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  /**
   * Génère un code challenge (SHA256 -> Base64) pour le flux PKCE
   */
  private async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}
