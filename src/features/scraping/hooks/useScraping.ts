import { useState, useCallback } from "react";
import { executeScraping } from "../services/service"; 
import type { ScrapingConfig, ProgressState, CommentItem } from "../types/scraping";

const initialProgress: ProgressState = {
  percentage: 0,
  status: "idle",
  message: "",
  logs: [],
};

export function useScraping() {
  const [progress, setProgress] = useState<ProgressState>(initialProgress);
  const [results, setResults] = useState<CommentItem[] | null>(null);

  const startScraping = useCallback(async (config: ScrapingConfig) => {
    setResults(null);
    setProgress({
      percentage: 0,
      status: "running",
      message: "Iniciando scraping...",
      logs: [`Iniciando scraping de ${config.platform} para "${config.target}"`],
    });

    try {
      const data = await executeScraping(config);

      setResults(data);
      setProgress({
        percentage: 100,
        status: "completed",
        message: `Scraping completado: ${data.length} comentarios obtenidos.`,
        logs: [`Se obtuvieron ${data.length} comentarios correctamente.`],
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error desconocido durante el scraping.";

      setProgress({
        percentage: 0,
        status: "error",
        message,
        logs: [`Error: ${message}`],
      });
    }
  }, []);

  const reset = useCallback(() => {
    setProgress(initialProgress);
    setResults(null);
  }, []);

  return { progress, results, startScraping, reset };
}