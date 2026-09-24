import { useState, useEffect } from "react";

import PlatformTabs from "../components/PlatformTabs";
import ConfigCard from "../components/ConfigCard";
import ProgressCard from "../components/ProgressCard";
import ResultsCard from "../components/ResultsCard";

import { executeScraping } from "../services/service";
import { useNotifications } from "../../notifications/context/NotificationsContext";
import { mapScrapingError } from "../../../utils/scrapingErrors";
import "./Scraping.css";
import type {
  Platform,
  ProgressState,
  ScrapingConfig,
  ScrapingResults,
  ReportItem,
} from "../types/scraping";

export default function Scraping() {
  const [platform, setPlatform] = useState<Platform>("tiktok");
  const { notifySuccess, notifyError } = useNotifications();

  // Cargar estado inicial guardado en sesión si existe
  const [progress, setProgress] = useState<ProgressState>(() => {
    const saved = sessionStorage.getItem("active_progress");
    return saved ? JSON.parse(saved) : {
      percentage: 0,
      status: "idle",
      message: "Esperando configuración...",
      logs: [],
    };
  });

  const [results, setResults] = useState<ScrapingResults | null>(() => {
    const saved = sessionStorage.getItem("active_results");
    return saved ? JSON.parse(saved) : null;
  });

  // Guardar estado en sessionStorage cuando cambie para que no se pierda al recargar/navegar
  useEffect(() => {
    if (results) {
      sessionStorage.setItem("active_results", JSON.stringify(results));
    } else {
      sessionStorage.removeItem("active_results");
    }
  }, [results]);

  useEffect(() => {
    if (progress.status !== "idle") {
      sessionStorage.setItem("active_progress", JSON.stringify(progress));
    } else {
      sessionStorage.removeItem("active_progress");
    }
  }, [progress]);

  // Función para el botón "Limpiar"
  const handleClear = () => {
    setResults(null);
    setProgress({
      percentage: 0,
      status: "idle",
      message: "Esperando configuración...",
      logs: [],
    });
    sessionStorage.removeItem("active_results");
    sessionStorage.removeItem("active_progress");
  };

  const handleExecute = async (config: ScrapingConfig) => {
    setResults(null);
    const startTime = performance.now();
    const cleanTarget = config.target.replace(/^@/, "");

    const newProgress: ProgressState = {
      percentage: 20,
      status: "running",
      message: `Iniciando extracción en ${config.platform.toUpperCase()}...`,
      logs: [
        `Plataforma seleccionada: ${config.platform}`,
        `Buscando: ${config.target}`,
        "Conectando con el scraper...",
      ],
    };
    setProgress(newProgress);

    try {
      const data = await executeScraping(config);

      const endTime = performance.now();
      const durationSeconds = ((endTime - startTime) / 1000).toFixed(1) + "s";
      const uniqueVideos = new Set(data.map((item) => item.video_id)).size;

      const completedProgress: ProgressState = {
        percentage: 100,
        status: "completed",
        message: "Scraping completado exitosamente",
        logs: [
          `Plataforma seleccionada: ${config.platform}`,
          `Buscando: ${config.target}`,
          "Conexión exitosa con el backend.",
          `Se obtuvieron ${data.length} comentarios.`,
        ],
      };
      setProgress(completedProgress);

      const finalResults: ScrapingResults = {
        comments: data.length,
        videos: uniqueVideos > 0 ? uniqueVideos : 1,
        duration: durationSeconds,
        data: data,
      };
      setResults(finalResults);

      notifySuccess(
        "Scraping completado",
        `${cleanTarget} · ${data.length} comentarios extraídos de ${config.platform}`,
        { link: "/reportes", linkLabel: "Ver reporte" }
      );

      if (config.saveProject) {
        const newReport: ReportItem = {
          id: Date.now().toString(),
          projectName: cleanTarget,
          platform: config.platform, // Guardamos la plataforma activa
          target: cleanTarget,
          date: new Date().toLocaleDateString("es-ES"),
          commentsCount: data.length,
          status: "Completado",
          data: data,
          config: config,
        };

        const existingReports: ReportItem[] = JSON.parse(
          localStorage.getItem("reports") || "[]"
        );
        localStorage.setItem(
          "reports",
          JSON.stringify([newReport, ...existingReports])
        );
      }
    } catch (err: any) {
      const status = err?.response?.status ?? err?.status;
      const info = mapScrapingError(err, status);

      setProgress({
        percentage: 100,
        status: "error",
        message: err.message || info.message,
        logs: [
          `Plataforma seleccionada: ${config.platform}`,
          `Buscando: ${config.target}`,
          `ERROR: ${err.message || "No se pudo completar el proceso."}`,
        ],
      });

      notifyError(
        "El scraping falló",
        `${cleanTarget} · ${info.message}`,
        { hint: info.hint }
      );

      if (config.saveProject) {
        const cleanTargetSave = cleanTarget;
        const failedReport: ReportItem = {
          id: Date.now().toString(),
          projectName: cleanTargetSave,
          platform: config.platform,
          target: cleanTargetSave,
          date: new Date().toLocaleDateString("es-ES"),
          commentsCount: 0,
          status: "Error",
          data: [],
          config: config,
        };

        const existingReports: ReportItem[] = JSON.parse(
          localStorage.getItem("reports") || "[]"
        );
        localStorage.setItem(
          "reports",
          JSON.stringify([failedReport, ...existingReports])
        );
      }
    }
  };

  return (
    <div className="container-fluid px-4 py-4 scraping-page">
      <div className="mb-4">
        <h1 className="fw-bold scraping-title">Scraping</h1>
        <p className="scraping-subtitle">
          Configura y ejecuta un nuevo proyecto de scraping.
        </p>
      </div>

      <PlatformTabs platform={platform} onChange={(p) => setPlatform(p)} />

      <div className="row g-4">
        <div className="col-12 col-xl-4">
          <ConfigCard
            platform={platform}
            onExecute={handleExecute}
            disabled={progress.status === "running"}
          />
        </div>

        <div className="col-12 col-xl-4">
          <ProgressCard progress={progress} />
        </div>

        <div className="col-12 col-xl-4">
          <ResultsCard results={results} onClear={handleClear} />
        </div>
      </div>
    </div>
  );
}