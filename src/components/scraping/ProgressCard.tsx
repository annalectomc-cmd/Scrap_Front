import type { ProgressState } from "../../types/scraping";
import ProgressLog from "./ProgressLog";

interface ProgressCardProps {
    progress: ProgressState;
}

export default function ProgressCard({
    progress,
}: ProgressCardProps) {
    const getStatusText = () => {
        switch (progress.status) {
            case "running":
                return "Ejecutando...";
            case "completed":
                return "Finalizado";
            case "error":
                return "Error";
            default:
                return "Esperando";
        }
    };

    return (
        <div className="card shadow-sm h-100">
            <div className="card-body">
                <h4 className="card-title">
                    Progreso
                </h4>

                <p className="text-muted mb-1">
                    Estado del scraping
                </p>

                <h3 className="mb-3">
                    {getStatusText()}
                </h3>

                <div className="progress mb-2">
                    <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                            width: `${progress.percentage}%`,
                        }}
                        aria-valuenow={progress.percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    >
                        {progress.percentage}%
                    </div>
                </div>

                <p className="small text-muted">
                    {progress.message}
                </p>

                <ProgressLog logs={progress.logs} />
            </div>
        </div>
    );
}