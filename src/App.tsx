import { useState } from "react";
import "./App.css";
import type { Comment } from "./types/comment";
import { getComments } from "./services/api";

function App() {
  const [comments, setComments] = useState<Comment[]>([]);

  return (
    <>
      <div className="container-fluid">
        <div className="row justify-content-center mt-4">
          <div className="col-6">
            <div className="card">
              <div className="card-body">
                <SearchForm setComments={setComments} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-4">
        <TableDown comments={comments} />
      </div>
    </>
  );
}

function SearchForm({ setComments }: any) {
  const [type, setType] = useState("1");
  const [profile, setProfile] = useState("");
  const [cant, setCant] = useState("");
  const [load, setLoad] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    sendProfile();
  };

  async function sendProfile() {
    
    try{
      setLoad(true);
      alert("No cierre el navegador");
      const data = await getComments(profile, cant, type);
      setComments(data);
      setLoad(false);
      alert("Busqueda finalizada");
    } catch (error) {
      console.log(error);
      alert(error);
      setLoad(false);
    }
  }

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit}>
        <div className="row mt-4">
          <div className="col">
            <label htmlFor="soption">Tipo de busqueda</label>
            <select
              id="soption"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="form-control"
            >
              <option selected value="1">
                Perfil
              </option>
              <option value="2">Hashtag</option>
            </select>
          </div>
          <div className="col">
            <label htmlFor="profile">Perfil o Hashtag de TikTok</label>
            <input
              className="form-control"
              id="profile"
              type="text"
              placeholder="user"
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row justify-content-center mt-4">
          <div className="col-6">
            <label htmlFor="cant">Cantidad de videos a explorar</label>
            <input
              className="form-control"
              id="cant"
              type="number"
              placeholder="1"
              value={cant}
              onChange={(e) => setCant(e.target.value)}
              required
              min="1"
            />
          </div>
        </div>
        <div className="row justify-content-center mt-4">
          <div className="col-auto">
            {!load ? (
              <button type="submit" className="btn btn-dark">
                Scrapp
              </button>
            ) : (
              <div className="spinner-border text-primary">
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

function TableDown({ comments }: { comments: Comment[] }) {
  function downloadJson() {
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

  function downloadCSV() {
    const name = "comentarios.csv";
    const headers = ["id", "usuario", "comentario", "fecha", "likes", "media"];
    const rows = comments.map((c) =>
      [
        c.video_id,
        c.user,
        `"${String(c.comment ?? "")
          .replace(/\r?\n/g, " ")
          .replace(/"/g, '""')}"`,
        c.date,
        c.likes,
        c.media,
      ].join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob(["\ufeff" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
  }

  return (
    <>
      <div className="btn-group btn-group-lg" role="group">
        <button type="button" className="btn btn-light" onClick={downloadJson}>
          <i className="bi bi-filetype-json"></i>
        </button>
        <button type="button" className="btn btn-light" onClick={downloadCSV}>
          <i className="bi bi-filetype-csv"></i>
        </button>
      </div>
      <div className="mt-4">
        {comments.length > 0 ? (
          <Table comments={comments} />
        ) : (
          <h6>Aun no hay comentarios</h6>
        )}
      </div>
    </>
  );
}

function Table({ comments }: { comments: Comment[] }) {
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 10;
  const totalPaginas = Math.ceil(comments.length / porPagina);
  const inicio = (paginaActual - 1) * porPagina;
  const filasVisibles = comments.slice(inicio, inicio + porPagina);

  return (
    <div className="container mt-4 bg-light">
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Id video</th>
              <th>Usuario</th>
              <th style={{ minWidth: "300px" }}>Comentario</th>
              <th>Fecha</th>
              <th>Likes</th>
              <th>Media</th>
            </tr>
          </thead>
          <tbody>
            {filasVisibles.map((c, i) => (
              <tr key={inicio + i}>
                <td>{i + 1}</td>
                <td>{c.video_id}</td>
                <td>{c.user}</td>
                <td>{c.comment}</td>
                <td>{c.date}</td>
                <td>{c.likes}</td>
                <td>{c.media}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setPaginaActual((p) => p - 1)}
            >
              Anterior
            </button>
          </li>
          <li className="page-item disabled">
            <span className="page-link">
              Página {paginaActual} de {totalPaginas}
            </span>
          </li>

          <li
            className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => setPaginaActual((p) => p + 1)}
            >
              Siguiente
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default App;
