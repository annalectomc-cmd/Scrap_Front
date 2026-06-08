import { Component, input } from '@angular/core';
import { Comments } from 'src/app/comments';

@Component({
  selector: 'app-tabledown',
  imports: [],
  template: `
    <div class="btn-group" role="group">
      <button type="button" class="btn btn-light" (click)="downloadJson()" >
        <i class="bi bi-filetype-json"></i>
      </button>
      <button type="button" class="btn btn-light" (click)="downloadCSV()" >
        <i class="bi bi-filetype-csv"></i>
      </button>
      
    </div>
    <div class="container mt-4"> 
    <table class="table table-bordered">
      <thead>
        <tr>
          <!--<th>Perfil</th>-->
          <th>Id video</th>
          <th>Usuario</th>
          <th>Comentario</th>
        </tr>
      </thead>
      <tbody>
      @for(c of comments(); track $index){  
        <tr>          
          <!--<td>{{c.video_id}}</td>-->
          <td>{{c.video_id}}</td>
          <td>{{c.user}}</td>
          <td>{{c.comment}}</td>
        </tr>
        }
      </tbody>
    </table>
    </div>
    
  `,
  styles: ``,
})
export class Tabledown {
  comments = input.required<Comments[]>();

  downloadJson(name: string = "comentarios.json") {
    const content = JSON.stringify(this.comments(), null, 2);
    const blob = new Blob([content], { type: "applicattion/json" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();

    window.URL.revokeObjectURL(url);

  }

  downloadCSV(name: string = "comentarios.csv") {
    const headers = ["id", "usuario", "comentario"];
    const rows = this.comments().map(c =>[
      c.video_id,
      c.user,
    `"${String(c.comment ?? '').replace(/"/g, '""')}"`
    ].join(','));

    const csv = [headers.join(','), ...rows].join('\n');

    const blob = new Blob(['\ufeff' + csv], { type: "text/csv;charset=utf-8;" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();

    window.URL.revokeObjectURL(url);

  }
}
