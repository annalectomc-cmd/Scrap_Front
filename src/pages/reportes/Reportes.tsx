import { useState, useEffect } from "react";
import { downloadJSON, downloadCSV } from "../../utils/exportData";
import type { ReportItem } from "../../types/scraping";
import "../../styles/Reportes.css";

export default function Reportes() {
    const [reports, setReports] = useState<ReportItem[]>([]);

    useEffect(() => {
        // Cargar reportes guardados
        const saved = localStorage.getItem("reports");
        if (saved) {
            setReports(JSON.parse(saved));
        }
    }, []);

    return (
        <div className="container-fluid px-4 py-4 reportes-container">
            <div className="mb-4">
                <h1 className="fw-bold">Reportes</h1>
                <p className="text-muted">Historial de proyectos de scraping guardados.</p>
            </div>

            {reports.length === 0 ? (
                <div className="alert alert-info text-center py-4">
                    No hay proyectos guardados aún. Activa el checkbox <strong>"Guardar proyecto"</strong> al ejecutar un nuevo scraping.
                </div>
            ) : (
                reports.map((report) => (
                    <div key={report.id} className="report-card-main mb-5">
                        <h2 className="report-title mb-4">
                            Reporte de Proyecto: <span className="text-capitalize">{report.projectName}</span>
                        </h2>

                        <div className="row g-4">
                            {/* LADO IZQUIERDO: GRID 2x2 */}
                            <div className="col-12 col-lg-8">
                                <div className="row g-3">
                                    {/* Tarjeta 1: Proyecto */}
                                    <div className="col-12 col-md-6">
                                        <div className="stat-box">
                                            <div className="stat-label">
                                                Proyecto <span className="ms-1"></span>
                                            </div>
                                            <div className="stat-value text-capitalize">
                                                {report.projectName}
                                            </div>

                                            {/* AGREGADO: Badge de la Red Social */}
                                            <span className="badge bg-primary mt-2 px-3 py-2 text-uppercase fw-semibold" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                                                {report.platform || "TikTok"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Tarjeta 2: Fecha */}
                                    <div className="col-12 col-md-6">
                                        <div className="stat-box">
                                            <div className="stat-label">Fecha</div>
                                            <div className="stat-value">{report.date}</div>
                                        </div>
                                    </div>

                                    {/* Tarjeta 3: Comentarios & Botón Ejecutar */}
                                    <div className="col-12 col-md-6">
                                        <div className="stat-box">
                                            <div className="stat-label">
                                                Comentarios <span className="ms-1"></span>
                                            </div>
                                            <div className="stat-value mb-2">{report.commentsCount}</div>
                                            <button
                                                className="btn btn-sketch-action btn-sm w-100"
                                                onClick={() => alert(`Re-ejecutando scraping para: ${report.target}`)}
                                            >
                                                [Ejecutar]
                                            </button>
                                        </div>
                                    </div>

                                    {/* Tarjeta 4: Estado */}
                                    <div className="col-12 col-md-6">
                                        <div className="stat-box">
                                            <div className="stat-label">Estado</div>
                                            <div className="stat-value text-success">
                                                {report.status} <span className="fs-4">✓</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* LADO DERECHO: PANEL DE DESCARGAS VERTICAL */}
                            <div className="col-12 col-lg-4">
                                <div className="downloads-box h-100 justify-content-center">
                                    <div className="stat-label mb-3 fw-bold fs-5">Descargas</div>

                                    <button
                                        className="btn btn-sketch-download"
                                        onClick={() => downloadCSV(report.data, `${report.projectName}_comentarios.csv`)}
                                    >
                                        [Descargar CSV]
                                    </button>

                                    <div className="download-arrow">↓</div>

                                    <button
                                        className="btn btn-sketch-download"
                                        onClick={() => downloadCSV(report.data, `${report.projectName}_plano.csv`)}
                                    >
                                        [Descargar CSV Plano]
                                    </button>

                                    <div className="download-arrow">↓</div>

                                    <button
                                        className="btn btn-sketch-download"
                                        onClick={() => downloadJSON(report.data, `${report.projectName}_comentarios.json`)}
                                    >
                                        [Descargar JSON]
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}