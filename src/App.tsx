import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [comments, setComments] = useState<Comment[]>([]);

  return (
    <>
    <div>
    <SearchForm setComments={setComments}/>
    </div>
    <div>
      <TableDown comments={comments} />
    </div>
    </>
  )
}

function SearchForm({setComments}: any){

  const [profile, setProfile] = useState("");
  const [load, setLoad] = useState(false);

  function sendProfile() {
    fetch(`http://localhost:5000/comments?profile=${encodeURIComponent(profile)}`)
    .then((response) => response.json())
    .then((data) => {
      setComments(data);
    })
    .catch((err) => {
      console.log(err.message);
    });
  }

  return(
    <div>
        <form>
          <div>
            <input type="text" placeholder="perfil de TikTok" value={profile} 
            onChange={(e) => setProfile(e.target.value)}/>
          </div>
          <div>            
            <button type="button" onClick={sendProfile} >
              Scrapp
            </button>    
          </div>
        </form>
    </div>
      
  )
}

function TableDown({comments}: { comments: Comment[] }){
  

  function downloadJson(){
    const name = "comentarios.json";
    const content = JSON.stringify(comments, null, 2);
    const blob = new Blob([content], { type: "applicattion/json" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();

    window.URL.revokeObjectURL(url);
  }

  function downloadCSV(){
    const name = "comentarios.csv";
    const headers = ["id", "usuario", "comentario"];
    const rows = comments.map(c =>[
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
  }


  return(
    <>
    <div>
      <button type="button" onClick={downloadJson}>
        Descargar Json
      </button>
      <button type="button" onClick={downloadCSV}>
        Descargar CSV
      </button>
    </div>
    <div>
        <Table comments={comments} />
    </div>
    </>
  )
}

function Table({comments}: { comments: Comment[] }){

  const rows: any = []
  comments.forEach((element) => {
    rows.push(
      <CommentsRows comment={element}/>
    );
  });

  return(
    <table>
          <thead>
            <tr>
              <th>Id video</th>
              <th>Usuario</th>
              <th>Comentario</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
  );
}

function CommentsRows({comment}:  { comment: Comment }){
  return (
    <tr>          
      <td>{comment.video_id}</td>
      <td>{comment.user}</td>
      <td>{comment.comment}</td>
    </tr>
  );
}

interface Comment {
  video_id: string;
  user: string;
  comment: string;
}

export default App
