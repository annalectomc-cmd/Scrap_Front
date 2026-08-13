import { useState } from "react";
import type {
    Depth,
    Platform,
    SearchType,
    ScrapingConfig,
} from "../../types/scraping";

interface ConfigCardProps {
    platform: Platform;
    onExecute: (config: ScrapingConfig) => void;
    disabled?: boolean;
}

export default function ConfigCard({
    platform,
    onExecute,
    disabled = false,
}: ConfigCardProps) {
    const [searchType, setSearchType] =
        useState<SearchType>("profile");

    const [target, setTarget] = useState("");

    const [videoCount, setVideoCount] = useState(1);

    const [depth, setDepth] =
        useState<Depth>("low");

    const [saveProject, setSaveProject] =
        useState(true);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!target.trim()) {
            return;
        }

        onExecute({
            platform,
            searchType,
            target: target.trim(),
            videoCount,
            depth,
            saveProject,
        });
    };

    return (
        <div className="card shadow-sm h-100">
            <div className="card-body">
                <h4 className="card-title mb-4">
                    Configurar nuevo proyecto
                </h4>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label fw-semibold">
                            Tipo de búsqueda
                        </label>

                        <div className="d-flex gap-4">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id="profile"
                                    checked={searchType === "profile"}
                                    onChange={() => setSearchType("profile")}
                                />

                                <label
                                    className="form-check-label"
                                    htmlFor="profile"
                                >
                                    Perfil
                                </label>
                            </div>

                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id="hashtag"
                                    checked={searchType === "hashtag"}
                                    onChange={() => setSearchType("hashtag")}
                                />

                                <label
                                    className="form-check-label"
                                    htmlFor="hashtag"
                                >
                                    Hashtag
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label
                            htmlFor="target"
                            className="form-label fw-semibold"
                        >
                            {searchType === "profile"
                                ? "Usuario"
                                : "Hashtag"}
                        </label>

                        <input
                            id="target"
                            type="text"
                            className="form-control"
                            placeholder={
                                searchType === "profile"
                                    ? "@usuario"
                                    : "#hashtag"
                            }
                            value={target}
                            onChange={(event) =>
                                setTarget(event.target.value)
                            }
                            disabled={disabled}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label
                            htmlFor="videoCount"
                            className="form-label fw-semibold"
                        >
                            Cantidad de videos
                        </label>

                        <input
                            id="videoCount"
                            type="number"
                            min="1"
                            className="form-control"
                            value={videoCount}
                            onChange={(event) =>
                                setVideoCount(
                                    Number(event.target.value)
                                )
                            }
                            disabled={disabled}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">
                            Profundidad
                        </label>

                        <div className="d-flex gap-3">
                            {[
                                { value: "low", label: "Baja" },
                                { value: "medium", label: "Media" },
                                { value: "high", label: "Alta" },
                            ].map((item) => (
                                <div
                                    className="form-check"
                                    key={item.value}
                                >
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        id={item.value}
                                        checked={depth === item.value}
                                        onChange={() =>
                                            setDepth(item.value as Depth)
                                        }
                                        disabled={disabled}
                                    />

                                    <label
                                        className="form-check-label"
                                        htmlFor={item.value}
                                    >
                                        {item.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-check mb-4">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="saveProject"
                            checked={saveProject}
                            onChange={(event) =>
                                setSaveProject(event.target.checked)
                            }
                            disabled={disabled}
                        />

                        <label
                            className="form-check-label"
                            htmlFor="saveProject"
                        >
                            Guardar proyecto
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={disabled}
                    >
                        {disabled
                            ? "Ejecutando..."
                            : "Ejecutar"}
                    </button>
                </form>
            </div>
        </div>
    );
}