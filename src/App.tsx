import { useState } from 'react'
import './App.css'

function App() {

  const [comments, setComments] = useState<Comment[]>([]);

  return (
    <>
    <div>
      <SearchForm setComments={setComments}/>
    </div>
    <div className="container mt-4">
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
    <div className="container mt-4">
        <form className="row g-3">
          <div className="col-md-6">
            <input type="text" placeholder="perfil de TikTok" value={profile} onChange={(e) => setProfile(e.target.value)}/>
          </div>
          <div className="col-12">            
            <button type="button" className="btn btn-primary" onClick={sendProfile} >
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
    <div className="btn-group" role="group">
      <button type="button" className="btn btn-light" onClick={downloadJson}>
        <i className="bi bi-filetype-json"></i>
      </button>
      <button type="button" className="btn btn-light" onClick={downloadCSV}>
        <i className="bi bi-filetype-csv"></i>
      </button>
    </div>
    <div>
        <Table comments={comments} />
    </div>
    </>
  )
}

function Table({comments}: { comments: Comment[] }){

  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 10;
  const totalPaginas = Math.ceil(comments.length / porPagina);
  const inicio = (paginaActual - 1) * porPagina;
  const filasVisibles = comments.slice(inicio, inicio + porPagina);

  return(
    <div className="container mt-4"> 
      <table className="table table-bordered">
          <thead>
            <tr>
              <th>Id video</th>
              <th>Usuario</th>
              <th>Comentario</th>
            </tr>
          </thead>
          <tbody>
            {filasVisibles.map((c, i) => (
            <tr key={inicio + i}>
              <td>{c.video_id}</td>
              <td>{c.user}</td>
              <td>{c.comment}</td>
            </tr>
          ))}
          </tbody>
      </table>
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPaginaActual(p => p - 1)}>
              Anterior
            </button>
          </li>

          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
            <li key={num} className={`page-item ${paginaActual === num ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPaginaActual(num)}>
                {num}
              </button>
            </li>
          ))}

          <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPaginaActual(p => p + 1)}>
              Siguiente
            </button>
          </li>
        </ul>
      </nav>
    
    </div>
  );
}



interface Comment {
  video_id: string;
  user: string;
  comment: string;
}

export default App
