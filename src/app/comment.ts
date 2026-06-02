import { inject, Injectable } from '@angular/core';
import { Comments } from './comments';
import { HttpClient } from '@angular/common/http';
import { Videos } from './videos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Comment {

  http: HttpClient = inject(HttpClient)
  private apiUrl = 'http://localhost:5000';

  
  getVideosByProfile(profile: string): Observable<Videos[]>{
    return this.http.get<Videos[]>(`${this.apiUrl}/videos?profile=${ profile }`);
  }

  
  getCommentsByProfile(profile: string): Observable<Comments[]>{
    return this.http.get<Comments[]>(`${this.apiUrl}/comments?profile=${ profile }`);
  }

}
