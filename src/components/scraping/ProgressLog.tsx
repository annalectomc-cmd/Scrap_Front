interface ProgressLogProps {
    logs: string[];
}

export default function ProgressLog({
    logs,
}: ProgressLogProps) {
    return (
        <div className="mt-4">
            <h6 className="fw-semibold">
                Actividad
            </h6>

            <div
                className="bg-light rounded p-3"
                style={{
                    maxHeight: "220px",
                    overflowY: "auto",
                }}
            >
                {logs.length === 0 ? (
                    <small className="text-muted">
                        No hay actividad todavía.
                    </small>
                ) : (
                    <div className="d-flex flex-column gap-2">
                        {logs.map((log, index) => (
                            <div
                                key={`${log}-${index}`}
                                className="small"
                            >
                                {index === logs.length - 1 ? "⏳" : "✓"}{" "}
                                {log}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}