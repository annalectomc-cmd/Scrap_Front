import { Component, inject, input } from '@angular/core';
import { Comments } from '../comments';
import { Comment } from '../comment';

@Component({
  selector: 'app-home',
  imports: [],
  template: `
    <section>
      <form>
        <input type="text" placeholder="Url de perfil de TikTok" #profile />
        <button class="primary" type="button" (click)="sendProfile(profile.value)" >Scrapp</button>
      </form>
    </section>
  `,
  styles: ``,
})
export class Home {

  comment: Comment = inject(Comment)
  comments: Comments[] = []

  sendProfile(url: string){
    this.comment.getCommentsByProfile(url).subscribe({
      next: (data) => {
      this.comments = data;
      console.log(data);
      //this.downloadJson(data);
    },
    error: (err) => {
      console.error(err);
    }
    });
  }

  downloadJson(data: Comments[], name: string = "comentarios.json"){
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], {type: "applicattion/json"});

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();

    window.URL.revokeObjectURL(url);

  }

}
