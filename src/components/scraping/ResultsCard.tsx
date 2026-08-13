import { downloadJSON, downloadCSV } from "../../utils/exportData";
import type { ScrapingResults } from "../../types/scraping";

interface ResultsCardProps {
    results: ScrapingResults | null;
    onClear?: () => void; // <-- AQUÍ SE DECLARA
}

export default function ResultsCard({
    results,
    onClear, // 2. Recibimos la función
}: ResultsCardProps) {
    const handleExportJSON = () => {
        if (results?.data) {
            downloadJSON(results.data);
        }
    };

    const handleExportCSV = () => {
        if (results?.data) {
            downloadCSV(results.data);
        }
    };

    const hasData = Boolean(results?.data && results.data.length > 0);

    return (
        <div className="card shadow-sm h-100">
            <div className="card-body">
                {/* 3. Renderizamos el botón "Limpiar" arriba a la derecha */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="card-title m-0">Finalizado</h4>
                    {hasData && onClear && (
                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={onClear}
                        >
                            Limpiar
                        </button>
                    )}
                </div>

                {!results ? (
                    <div className="text-center text-muted py-5">
                        <div className="fs-1 mb-3">✓</div>
                        <p>Los resultados aparecerán aquí cuando finalice el scraping.</p>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-4">
                            <div className="fs-1">✓</div>
                            <h3>¡Scraping finalizado!</h3>
                        </div>

                        <div className="d-flex flex-column gap-3">
                            <div className="border rounded p-3 text-center">
                                <small className="text-muted">Comentarios</small>
                                <div className="fs-3 fw-bold">{results.comments}</div>
                            </div>

                            <div className="border rounded p-3 text-center">
                                <small className="text-muted">Videos</small>
                                <div className="fs-3 fw-bold">{results.videos}</div>
                            </div>

                            <div className="border rounded p-3 text-center">
                                <small className="text-muted">Duración</small>
                                <div className="fs-3 fw-bold">{results.duration}</div>
                            </div>
                        </div>

                        <div className="d-flex gap-2 mt-4">
                            <button
                                type="button"
                                className="btn btn-outline-secondary flex-fill"
                                onClick={handleExportJSON}
                                disabled={!hasData}
                            >
                                JSON
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-secondary flex-fill"
                                onClick={handleExportCSV}
                                disabled={!hasData}
                            >
                                CSV
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}