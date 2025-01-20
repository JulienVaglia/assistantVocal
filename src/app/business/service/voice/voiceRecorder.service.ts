import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VoiceRecorder {

  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioBlob: Blob | null = null;
  private audioUrl: string | null = null;
  private audio: HTMLAudioElement | null = null;
  private transcriptionSubject: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient) {
  }

  startRecording(): void {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];
        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };
        this.mediaRecorder.onstop = () => {
          this.audioBlob = new Blob(this.audioChunks, {type: 'audio/wav'});
          this.audioUrl = URL.createObjectURL(this.audioBlob);
          this.audio = new Audio(this.audioUrl);
        };
        this.mediaRecorder.start();
      }).catch((err) => {
        console.error('Erreur d\'enregistrement :', err);
      });
    } else {
      console.error('Le navigateur ne supporte pas MediaRecorder.');
    }
  }

  stopRecording(): Blob | null {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
    return this.audioBlob;
  }

  transcribeAudio(file: File): Observable<any> {
    // Assurez-vous d'appeler l'API Flask ou Google pour la transcription ici.
    // Exemple de demande vers l'API Flask :
    const formData = new FormData();
    formData.append('audio', file, file.name);
    console.log("je passe par la" +
      "")
    return this.http.post('http://localhost:5000/transcribe', formData);
  }

  playAudio(): void {
    if (this.audio) {
      this.audio.play();
    }
  }
}
