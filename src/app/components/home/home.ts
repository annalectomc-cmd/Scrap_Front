import { Component, inject, input, signal } from '@angular/core';
import { Comments } from '../../comments';
import { Comment } from '../../services/comment';
import { Tabledown } from "../tabledown/tabledown";

@Component({
  selector: 'app-home',
  imports: [Tabledown],
  template: `
    <section>
      <div class="container mt-4">
        <form class="row g-3">
          <div class="col-md-6">
            <input type="text" class="form-control" placeholder="perfil de TikTok" #profile />
          </div>
          <div class="col-12">            
            <button class="primary" type="button" class="btn btn-primary" [hidden]="load()" (click)="sendProfile(profile.value)" >Scrapp</button>    
            @if(load()){
              <div class="spinner-border text-primary">
                <span class="visually-hidden">Loading...</span>
              </div>
            }
          </div>
        </form>
      </div>
      <div class="container mt-4">
        <app-tabledown [comments]="comments"  />
      </div>
    </section>
  `,
  styles: ``,
})
export class Home {

  load = signal(false);
  comment: Comment = inject(Comment);
  comments: Comments[] = [];

  sendProfile(url: string) {
    this.load.set(true);
    this.comment.getCommentsByProfile(url).subscribe({
      next: (data) => {
        this.comments = data;
        console.log(data);
        
        this.load.set(false);
      },
      error: (err) => {
        this.load.set(false);
        console.error(err);
        alert(err.error["error"]);
        
      }
    });
    // this.comments = [{
    //   "video_id": "1",
    //   "comment": "test",
    //   "user": "testuser" 
    // }]
    // this.load.set(false)
  }

  

}
