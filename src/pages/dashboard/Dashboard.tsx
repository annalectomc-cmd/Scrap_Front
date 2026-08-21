import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../../components/layout/DashboardCard";
import "../../styles/Dashboard.css";

interface ScrapeReport {
    proyecto: string;
    plataforma: "TIKTOK" | "YOUTUBE";
    fecha: string;
    comentarios: number;
    estado: string;
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [showHistorial, setShowHistorial] = useState(false);

    const ultimoReporte: ScrapeReport = {
        proyecto: "Motorola_col",
        plataforma: "TIKTOK",
        fecha: "19/8/2026",
        comentarios: 14,
        estado: "Completado ✓",
    };

    return (
        <div className="dashboard">
            <div className="dashboard-background"></div>

            <div className="dashboard-content-wrapper">
                <div className="welcome-card">
                    <h1>Bienvenido (Nombre de usuario)</h1>
                    <p>¿Qué deseas hacer hoy?</p>

                    <div className="dashboard-buttons">
                        <DashboardCard
                            title="Nuevo Scraping"
                            icon="bi-plus-circle"
                            onClick={() => navigate("/scraping")}
                        />

                        <DashboardCard
                            title="Historial"
                            icon="bi-clock-history"
                            onClick={() => setShowHistorial(!showHistorial)}
                        />

                        <DashboardCard
                            title="Reportes"
                            icon="bi-bar-chart"
                            onClick={() => navigate("/reportes")}
                        />
                    </div>

                    {showHistorial && (
                        <div className="historial-card-container">
                            <div className="historial-header">
                                <h3>Último Scraping Realizado</h3>
                                <button
                                    className="btn-ver-mas"
                                    onClick={() => navigate("/reportes")}
                                >
                                    Ver todos <i className="bi bi-arrow-right"></i>
                                </button>
                            </div>

                            <div className="historial-detail-card">
                                <div className="detail-item">
                                    <span className="label">Proyecto</span>
                                    <span className="value-bold">{ultimoReporte.proyecto}</span>
                                    <span className={`platform-tag ${ultimoReporte.plataforma.toLowerCase()}`}>
                                        {ultimoReporte.plataforma}
                                    </span>
                                </div>

                                <div className="detail-item">
                                    <span className="label">Fecha</span>
                                    <span className="value">{ultimoReporte.fecha}</span>
                                </div>

                                <div className="detail-item">
                                    <span className="label">Comentarios</span>
                                    <span className="value-highlight">{ultimoReporte.comentarios}</span>
                                </div>

                                <div className="detail-item">
                                    <span className="label">Estado</span>
                                    <span className="status-success">{ultimoReporte.estado}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="robot-mascot-container">
                    {showHistorial && (
                        <div className="speech-bubble">
                            <p>
                                ¡Vaya! Veo que tu último proyecto, <strong>{ultimoReporte.proyecto}</strong>, ya tiene <strong>{ultimoReporte.comentarios}</strong> comentarios. ¡Excelente!
                            </p>
                        </div>
                    )}

                    <div className="css-robot">
                        <div className="robot-antenna">
                            <div className="antenna-glow"></div>
                        </div>
                        <div className="robot-head">
                            <div className="robot-face">
                                <div className="robot-eye left"></div>
                                <div className="robot-eye right"></div>
                            </div>
                        </div>
                        <div className="robot-body">
                            <i className="bi bi-bar-chart-fill robot-icon"></i>
                        </div>
                        <div className="robot-ring"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}