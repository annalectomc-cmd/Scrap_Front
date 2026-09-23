import { useState, useEffect, useMemo, useRef } from "react";
import { downloadJSON, downloadCSV } from "../../../utils/exportData";
import type { ReportItem } from "../../scraping/types/scraping";
import "../../reports/pages/Reportes.css";

/* =========================================================
   PLATAFORMA POR DEFECTO
   Se resuelve en un solo lugar para que la tarjeta y el
   buscador trabajen siempre con el mismo valor.
   ========================================================= */

const DEFAULT_PLATFORM = "TikTok";

function resolvePlatform(platform?: string) {
    return (platform || "").trim() || DEFAULT_PLATFORM;
}

/* =========================================================
   NORMALIZACIÓN DE TEXTO
   Quita acentos, pasa a minúsculas y convierte guiones bajos
   en espacios, para que "Motorola_col" se encuentre
   escribiendo "motorola", "MOTOROLA" o "motorola col".
   ========================================================= */

function normalize(text: string) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[_-]+/g, " ")
        .trim();
}

/* =========================================================
   METADATA POR PLATAFORMA
   ========================================================= */

const PLATFORM_META: Record<string, { icon: string; className: string }> = {
    tiktok: { icon: "bi-tiktok", className: "platform-tiktok" },
    instagram: { icon: "bi-instagram", className: "platform-instagram" },
    facebook: { icon: "bi-facebook", className: "platform-facebook" },
    youtube: { icon: "bi-youtube", className: "platform-youtube" },
    twitter: { icon: "bi-twitter-x", className: "platform-x" },
    x: { icon: "bi-twitter-x", className: "platform-x" },
};

function getPlatformMeta(platform?: string) {
    const key = normalize(resolvePlatform(platform));
    return PLATFORM_META[key] || { icon: "bi-globe2", className: "platform-default" };
}

/* =========================================================
   METADATA POR ESTADO
   ========================================================= */

function getStatusMeta(status?: string) {
    const s = normalize(status || "");
    if (s.includes("error") || s.includes("fall")) return { className: "is-danger" };
    if (s.includes("proceso") || s.includes("pend")) return { className: "is-warning" };
    return { className: "is-success" };
}

type Suggestion = {
    value: string;
    type: "proyecto" | "plataforma";
    count: number;
};

export default function Reportes() {
    const [reports, setReports] = useState<ReportItem[]>([]);
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [highlight, setHighlight] = useState(-1);
    const [deleteTarget, setDeleteTarget] = useState<ReportItem | null>(null);

    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem("reports");
        if (saved) {
            setReports(JSON.parse(saved));
        }
    }, []);

    /* Cerrar el desplegable al hacer clic fuera */
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* Cerrar el modal de confirmación con Escape */
    useEffect(() => {
        if (!deleteTarget) return;

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") setDeleteTarget(null);
        }
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [deleteTarget]);

    /* =========================================================
       FILTRADO
       Usa resolvePlatform para que el fallback también sea
       buscable, y normalize para ignorar acentos y guiones.
       ========================================================= */

    const filteredReports = useMemo(() => {
        const q = normalize(query);
        if (!q) return reports;

        return reports.filter((r) => {
            const haystack = normalize(
                `${r.projectName || ""} ${resolvePlatform(r.platform)} ${r.status || ""}`
            );
            return haystack.includes(q);
        });
    }, [reports, query]);

    /* =========================================================
       SUGERENCIAS DEL AUTOCOMPLETADO
       ========================================================= */

    const allSuggestions = useMemo<Suggestion[]>(() => {
        const projects = new Map<string, number>();
        const platforms = new Map<string, number>();

        reports.forEach((r) => {
            const name = (r.projectName || "").trim();
            if (name) projects.set(name, (projects.get(name) || 0) + 1);

            const platform = resolvePlatform(r.platform);
            platforms.set(platform, (platforms.get(platform) || 0) + 1);
        });

        return [
            ...Array.from(platforms, ([value, count]): Suggestion => ({
                value,
                type: "plataforma",
                count,
            })),
            ...Array.from(projects, ([value, count]): Suggestion => ({
                value,
                type: "proyecto",
                count,
            })),
        ];
    }, [reports]);

    const suggestions = useMemo(() => {
        const q = normalize(query);
        if (!q) return allSuggestions.slice(0, 6);

        return allSuggestions
            .filter((s) => normalize(s.value).includes(q))
            .slice(0, 6);
    }, [allSuggestions, query]);

    /* =========================================================
       TECLADO
       ========================================================= */

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Escape") {
            setIsOpen(false);
            setHighlight(-1);
            return;
        }

        if (!isOpen || suggestions.length === 0) {
            if (e.key === "ArrowDown") setIsOpen(true);
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlight((h) => (h + 1) % suggestions.length);
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlight((h) => (h <= 0 ? suggestions.length - 1 : h - 1));
        }

        if (e.key === "Enter") {
            e.preventDefault();
            if (highlight >= 0) {
                applySuggestion(suggestions[highlight].value);
            } else {
                setIsOpen(false);
            }
        }
    }

    function applySuggestion(value: string) {
        setQuery(value);
        setIsOpen(false);
        setHighlight(-1);
    }

    function clearSearch() {
        setQuery("");
        setIsOpen(false);
        setHighlight(-1);
    }

    /* =========================================================
       ELIMINAR PROYECTO
       ========================================================= */

    function requestDelete(report: ReportItem) {
        setDeleteTarget(report);
    }

    function cancelDelete() {
        setDeleteTarget(null);
    }

    function confirmDelete() {
        if (!deleteTarget) return;

        const updated = reports.filter((r) => r.id !== deleteTarget.id);
        setReports(updated);
        localStorage.setItem("reports", JSON.stringify(updated));
        setDeleteTarget(null);
    }

    /* =========================================================
       RESUMEN
       ========================================================= */

    const summary = useMemo(() => {
        const totalComments = reports.reduce(
            (sum, r) => sum + (Number(r.commentsCount) || 0),
            0
        );
        const platforms = Array.from(
            new Set(reports.map((r) => resolvePlatform(r.platform)))
        );
        return { total: reports.length, totalComments, platforms };
    }, [reports]);

    return (
        <div className="container-fluid px-4 py-4 reportes-container">

            {/* ENCABEZADO PRINCIPAL */}
            <div className="mb-4 reportes-header">
                <div>
                    <h1 className="fw-bold">Reportes</h1>
                    <p className="text-muted">
                        Historial de proyectos de scraping guardados.
                    </p>
                </div>

                {reports.length > 0 && (
                    <div className="reportes-search-wrap" ref={searchRef}>

                        <div className="reportes-search">
                            <i className="bi bi-search"></i>

                            <input
                                type="text"
                                placeholder="Buscar por proyecto o plataforma"
                                value={query}
                                autoComplete="off"
                                role="combobox"
                                aria-expanded={isOpen}
                                aria-controls="reportes-suggestions"
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setIsOpen(true);
                                    setHighlight(-1);
                                }}
                                onFocus={() => setIsOpen(true)}
                                onKeyDown={handleKeyDown}
                            />

                            {query && (
                                <button
                                    type="button"
                                    className="reportes-search-clear"
                                    aria-label="Limpiar búsqueda"
                                    onClick={clearSearch}
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            )}
                        </div>

                        {isOpen && suggestions.length > 0 && (
                            <ul
                                className="reportes-suggestions"
                                id="reportes-suggestions"
                                role="listbox"
                            >
                                {suggestions.map((s, i) => (
                                    <li key={`${s.type}-${s.value}`}>
                                        <button
                                            type="button"
                                            role="option"
                                            aria-selected={i === highlight}
                                            className={`suggestion-item ${
                                                i === highlight ? "is-active" : ""
                                            }`}
                                            onMouseEnter={() => setHighlight(i)}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => applySuggestion(s.value)}
                                        >
                                            <i
                                                className={`bi ${
                                                    s.type === "plataforma"
                                                        ? getPlatformMeta(s.value).icon
                                                        : "bi-folder2"
                                                }`}
                                            ></i>

                                            <span className="suggestion-value">
                                                {s.value}
                                            </span>

                                            <span className="suggestion-type">
                                                {s.type}
                                            </span>

                                            <span className="suggestion-count">
                                                {s.count}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            {/* SIN REPORTES */}
            {reports.length === 0 ? (
                <div className="reportes-empty">
                    <div className="reportes-empty-icon">
                        <i className="bi bi-inboxes"></i>
                    </div>
                    <h2>Todavía no hay proyectos guardados</h2>
                    <p>
                        Activa el checkbox <strong>"Guardar proyecto"</strong> al
                        ejecutar un nuevo scraping para que aparezca aquí.
                    </p>
                </div>
            ) : (
                <>
                    {/* BARRA DE RESUMEN */}
                    <div className="reportes-summary">
                        <div className="summary-item">
                            <span className="summary-value">{summary.total}</span>
                            <span className="summary-label">
                                {summary.total === 1
                                    ? "proyecto guardado"
                                    : "proyectos guardados"}
                            </span>
                        </div>

                        <div className="summary-divider" />

                        <div className="summary-item">
                            <span className="summary-value">
                                {summary.totalComments.toLocaleString("es-CO")}
                            </span>
                            <span className="summary-label">comentarios extraídos</span>
                        </div>

                        <div className="summary-divider" />

                        <div className="summary-platforms">
                            {summary.platforms.map((p) => {
                                const meta = getPlatformMeta(p);
                                return (
                                    <span
                                        key={p}
                                        className={`summary-platform-chip ${meta.className}`}
                                    >
                                        <i className={`bi ${meta.icon}`}></i>
                                        {p}
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    {/* LÍNEA DE RESULTADOS */}
                    {query && (
                        <div className="reportes-results-line">
                            <span>
                                {filteredReports.length}{" "}
                                {filteredReports.length === 1
                                    ? "resultado"
                                    : "resultados"}{" "}
                                para "{query}"
                            </span>

                            <button
                                type="button"
                                className="reportes-results-clear"
                                onClick={clearSearch}
                            >
                                Quitar filtro
                            </button>
                        </div>
                    )}

                    {/* SIN RESULTADOS DE BÚSQUEDA */}
                    {filteredReports.length === 0 ? (
                        <div className="reportes-empty reportes-empty-small">
                            <p>
                                Ningún proyecto coincide con "<strong>{query}</strong>".
                                Prueba con el nombre del proyecto o el de la plataforma.
                            </p>
                        </div>
                    ) : (
                        /* LISTA DE REPORTES */
                        filteredReports.map((report, index) => {
                            const platform = resolvePlatform(report.platform);
                            const platformMeta = getPlatformMeta(platform);
                            const statusMeta = getStatusMeta(report.status);

                            return (
                                <div
                                    key={report.id}
                                    className={`report-card-main mb-4 ${platformMeta.className}`}
                                    style={{ ["--stagger" as any]: index }}
                                >

                                    {/* ENCABEZADO DE LA TARJETA */}
                                    <div className="report-heading">
                                        <div className="report-heading-left">
                                            <div className="report-platform-icon">
                                                <i className={`bi ${platformMeta.icon}`}></i>
                                            </div>

                                            <div>
                                                <span className="report-project-name text-capitalize">
                                                    {report.projectName}
                                                </span>
                                                <span className="report-meta-line">
                                                    {report.date} · {report.commentsCount} comentarios
                                                </span>
                                            </div>
                                        </div>

                                        <div className="report-heading-right">
                                            <span className="report-platform-badge">
                                                {platform}
                                            </span>

                                            <button
                                                type="button"
                                                className="btn-delete-report"
                                                title="Eliminar proyecto"
                                                aria-label={`Eliminar ${report.projectName}`}
                                                onClick={() => requestDelete(report)}
                                            >
                                                <i className="bi bi-trash3"></i>
                                            </button>
                                        </div>
                                    </div>

                                    {/* CUERPO DE LA TARJETA */}
                                    <div className="report-body">

                                        <div className="report-primary">
                                            <div className="report-hero">
                                                <div className="report-hero-value">
                                                    {report.commentsCount}
                                                </div>
                                                <div className="report-hero-label">
                                                    comentarios extraídos
                                                </div>
                                            </div>

                                            <div className={`report-status ${statusMeta.className}`}>
                                                <span
                                                    className={`status-dot ${statusMeta.className}`}
                                                ></span>
                                                {report.status}
                                            </div>

                                            <button
                                                className="btn-rerun"
                                                onClick={() =>
                                                    alert(
                                                        `Re-ejecutando scraping para: ${report.target}`
                                                    )
                                                }
                                            >
                                                <i className="bi bi-arrow-repeat"></i>
                                                Ejecutar de nuevo
                                            </button>
                                        </div>

                                        <div className="report-downloads">
                                            <span className="report-downloads-label">
                                                Descargas
                                            </span>

                                            <div className="report-downloads-row">
                                                <button
                                                    className="download-chip"
                                                    title="Descargar CSV"
                                                    onClick={() =>
                                                        downloadCSV(
                                                            report.data,
                                                            `${report.projectName}_comentarios.csv`
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-file-earmark-spreadsheet"></i>
                                                    <span>CSV</span>
                                                </button>

                                                <button
                                                    className="download-chip"
                                                    title="Descargar CSV plano"
                                                    onClick={() =>
                                                        downloadCSV(
                                                            report.data,
                                                            `${report.projectName}_plano.csv`
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-table"></i>
                                                    <span>CSV plano</span>
                                                </button>

                                                <button
                                                    className="download-chip"
                                                    title="Descargar JSON"
                                                    onClick={() =>
                                                        downloadJSON(
                                                            report.data,
                                                            `${report.projectName}_comentarios.json`
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-braces"></i>
                                                    <span>JSON</span>
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            );
                        })
                    )}
                </>
            )}

            {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
            {deleteTarget && (
                <div
                    className="delete-modal-overlay"
                    role="presentation"
                    onClick={cancelDelete}
                >
                    <div
                        className="delete-modal"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-modal-title"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="delete-modal-icon">
                            <i className="bi bi-exclamation-triangle-fill"></i>
                        </div>

                        <h3 id="delete-modal-title">¿Eliminar este proyecto?</h3>

                        <p>
                            Vas a eliminar{" "}
                            <strong>{deleteTarget.projectName}</strong>. Esta
                            acción no se puede deshacer.
                        </p>

                        <div className="delete-modal-actions">
                            <button
                                type="button"
                                className="delete-modal-btn delete-modal-btn-danger"
                                onClick={confirmDelete}
                                autoFocus
                            >
                                <i className="bi bi-trash3"></i>
                                Sí, eliminar
                            </button>

                            <button
                                type="button"
                                className="delete-modal-btn delete-modal-btn-neutral"
                                onClick={cancelDelete}
                            >
                                No
                            </button>

                            <button
                                type="button"
                                className="delete-modal-btn delete-modal-btn-ghost"
                                onClick={cancelDelete}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}       