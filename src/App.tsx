import { useState } from "react";
import "./App.css";
import type { Comment } from "./types/comment";

function App() {
  const [comments, setComments] = useState<Comment[]>([]);

  return (
    <>
      <div>
        <SearchForm setComments={setComments} />
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

  function sendProfile() {
    //despliegue
    //fetch(`/comments?profile=${encodeURIComponent(profile)}`)
    // desarrollo
    setLoad(true);
    alert("No cierre el navegador");
    fetch(
      `http://localhost:5000/comments?profile=${encodeURIComponent(profile)}&cant=${encodeURIComponent(Number(cant))}&type=${encodeURIComponent(Number(type))}`,
    )
      .then((response) => response.json())
      .then((data) => {
        setComments(data);
        setLoad(false);
        alert("fin");
      })
      .catch((err) => {
        console.log(err.message);
        alert(err.message);
        setLoad(false);
      });
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
            <label htmlFor="profile">Perfil de TikTok</label>
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
        <div className="row mt-4">
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
          <div className="col-6">
            {!load ? (
              <button type="submit" className="btn btn-primary btn-lg">
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
  );
}

function Table({ comments }: { comments: Comment[] }) {
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 10;
  const totalPaginas = Math.ceil(comments.length / porPagina);
  const inicio = (paginaActual - 1) * porPagina;
  const filasVisibles = comments.slice(inicio, inicio + porPagina);

  return (
    <div className="container mt-4">
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Id video</th>
              <th>Usuario</th>
              <th>Comentario</th>
              <th>Fecha</th>
              <th>Likes</th>
              <th>Media</th>
            </tr>
          </thead>
          <tbody>
            {filasVisibles.map((c, i) => (
              <tr key={inicio + i}>
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
      <nav>
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
