import { useState, useEffect } from "react";
import { downloadJSON, downloadCSV } from "../../utils/exportData";
import type { ReportItem } from "../../types/scraping";
import "../../styles/Reportes.css";

export default function Reportes() {
    const [reports, setReports] = useState<ReportItem[]>([]);
    const [openDownloadId, setOpenDownloadId] = useState<string | number | null>(null);

    useEffect(() => {
        // Cargar reportes guardados
        const saved = localStorage.getItem("reports");

        if (saved) {
            setReports(JSON.parse(saved));
        }
    }, []);

    return (
        <div className="container-fluid px-4 py-4 reportes-container">

            {/* ENCABEZADO PRINCIPAL */}
            <div className="mb-4">
                <h1 className="fw-bold">Reportes</h1>
                <p className="text-muted">
                    Historial de proyectos de scraping guardados.
                </p>
            </div>

            {/* SIN REPORTES */}
            {reports.length === 0 ? (
                <div className="alert alert-info text-center py-4">
                    No hay proyectos guardados aún. Activa el checkbox{" "}
                    <strong>"Guardar proyecto"</strong> al ejecutar un nuevo
                    scraping.
                </div>
            ) : (

                /* LISTA DE REPORTES */
                reports.map((report) => (
                    <div
                        key={report.id}
                        className="report-card-main mb-5"
                    >

                        {/* TÍTULO DEL REPORTE */}
                        <div className="report-heading">
                            <div>
                                <h2 className="report-title">
                                    Reporte de Proyecto
                                </h2>

                                <span className="report-project-name">
                                    {report.projectName}
                                </span>
                            </div>

                            <span className="report-platform-badge">
                                {report.platform || "TikTok"}
                            </span>
                        </div>


                        <div className="row g-4">

                            {/* =====================================
                                LADO IZQUIERDO
                                GRID 2 x 2
                            ====================================== */}

                            <div className="col-12 col-lg-8">

                                <div className="row g-3">

                                    {/* ==========================
                                        TARJETA: PROYECTO
                                    =========================== */}

                                    <div className="col-12 col-md-6">

                                        <div className="stat-box">

                                            <div className="stat-label">
                                                Proyecto
                                            </div>

                                            <div className="stat-value text-capitalize">
                                                {report.projectName}
                                            </div>

                                        </div>

                                    </div>


                                    {/* ==========================
                                        TARJETA: FECHA
                                    =========================== */}

                                    <div className="col-12 col-md-6">

                                        <div className="stat-box">

                                            <div className="stat-label">
                                                Fecha
                                            </div>

                                            <div className="stat-value">
                                                {report.date}
                                            </div>

                                        </div>

                                    </div>


                                    {/* ==========================
                                        TARJETA: COMENTARIOS
                                    =========================== */}

                                    <div className="col-12 col-md-6">

                                        <div className="stat-box">

                                            <div className="stat-label">
                                                Comentarios
                                            </div>

                                            <div className="stat-value mb-2">
                                                {report.commentsCount}
                                            </div>

                                            <button
                                                className="btn btn-sketch-action btn-sm w-100"
                                                onClick={() =>
                                                    alert(
                                                        `Re-ejecutando scraping para: ${report.target}`
                                                    )
                                                }
                                            >
                                                [Ejecutar]
                                            </button>

                                        </div>

                                    </div>


                                    {/* ==========================
                                        TARJETA: ESTADO
                                    =========================== */}

                                    <div className="col-12 col-md-6">

                                        <div className="stat-box">

                                            <div className="stat-label">
                                                Estado
                                            </div>

                                            <div className="stat-value text-success">
                                                {report.status}{" "}
                                                <span className="fs-4">
                                                    ✓
                                                </span>
                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* =====================================
                                LADO DERECHO
                                DESCARGAS DESPLEGABLE
                            ====================================== */}

                            <div className="col-12 col-lg-4">

                                <div className="downloads-box">

                                    {/* ==========================
                                        HEADER DEL DESPLEGABLE
                                    =========================== */}

                                    <button
                                        className="downloads-header"
                                        onClick={() =>
                                            setOpenDownloadId(
                                                openDownloadId === report.id
                                                    ? null
                                                    : report.id
                                            )
                                        }
                                    >

                                        <div className="downloads-header-left">

                                            <div className="downloads-icon">
                                                <i className="bi bi-download"></i>
                                            </div>

                                            <div>

                                                <div className="downloads-title">
                                                    Descargas
                                                </div>

                                                <div className="downloads-subtitle">
                                                    3 archivos disponibles
                                                </div>

                                            </div>

                                        </div>


                                        <i
                                            className={`bi ${
                                                openDownloadId === report.id
                                                    ? "bi-chevron-up"
                                                    : "bi-chevron-down"
                                            } downloads-chevron`}
                                        ></i>

                                    </button>


                                    {/* ==========================
                                        CONTENIDO DESPLEGABLE
                                    =========================== */}

                                    {openDownloadId === report.id && (

                                        <div className="downloads-content">

                                            {/* ======================
                                                CSV
                                            ======================= */}

                                            <button
                                                className="download-option"
                                                onClick={() =>
                                                    downloadCSV(
                                                        report.data,
                                                        `${report.projectName}_comentarios.csv`
                                                    )
                                                }
                                            >

                                                <div className="download-option-icon">
                                                    <i className="bi bi-file-earmark-spreadsheet"></i>
                                                </div>


                                                <div className="download-option-info">

                                                    <span className="download-option-title">
                                                        Descargar CSV
                                                    </span>

                                                    <span className="download-option-description">
                                                        Comentarios del scraping
                                                    </span>

                                                </div>


                                                <i className="bi bi-download download-option-arrow"></i>

                                            </button>


                                            {/* ======================
                                                CSV PLANO
                                            ======================= */}

                                            <button
                                                className="download-option"
                                                onClick={() =>
                                                    downloadCSV(
                                                        report.data,
                                                        `${report.projectName}_plano.csv`
                                                    )
                                                }
                                            >

                                                <div className="download-option-icon">
                                                    <i className="bi bi-table"></i>
                                                </div>


                                                <div className="download-option-info">

                                                    <span className="download-option-title">
                                                        Descargar CSV Plano
                                                    </span>

                                                    <span className="download-option-description">
                                                        Datos en formato plano
                                                    </span>

                                                </div>


                                                <i className="bi bi-download download-option-arrow"></i>

                                            </button>


                                            {/* ======================
                                                JSON
                                            ======================= */}

                                            <button
                                                className="download-option"
                                                onClick={() =>
                                                    downloadJSON(
                                                        report.data,
                                                        `${report.projectName}_comentarios.json`
                                                    )
                                                }
                                            >

                                                <div className="download-option-icon">
                                                    <i className="bi bi-braces"></i>
                                                </div>


                                                <div className="download-option-info">

                                                    <span className="download-option-title">
                                                        Descargar JSON
                                                    </span>

                                                    <span className="download-option-description">
                                                        Datos completos del proyecto
                                                    </span>

                                                </div>


                                                <i className="bi bi-download download-option-arrow"></i>

                                            </button>

                                        </div>

                                    )}

                                </div>

                            </div>

                        </div>

                    </div>
                ))

            )}

        </div>
    );
}