import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  
  private apiUrl = 'http://localhost:9000/asr'; // URL de l'API Whisper

  
  constructor(private http: HttpClient) {}

  transcribeAudio(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(this.apiUrl, formData);
  }
}

}
