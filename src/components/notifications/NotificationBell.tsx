/* =========================================================
   src/components/notifications/NotificationBell.tsx
   ========================================================= */

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationsContext";
import type { NotificationType } from "../../types/notifications";
import "../../styles/Notifications.css";

const TYPE_ICON: Record<NotificationType, string> = {
    success: "bi-check-circle-fill",
    error: "bi-x-circle-fill",
    warning: "bi-exclamation-triangle-fill",
    info: "bi-info-circle-fill",
};

function timeAgo(timestamp: number) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return "hace un momento";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `hace ${minutes} min`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `hace ${hours} h`;

    const days = Math.floor(hours / 24);
    if (days === 1) return "ayer";
    if (days < 7) return `hace ${days} días`;

    return new Date(timestamp).toLocaleDateString("es-CO");
}

export default function NotificationBell() {
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        remove,
        clearAll,
    } = useNotifications();

    const [isOpen, setIsOpen] = useState(false);
    const wrapRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    /* Cerrar al hacer clic fuera o con Escape */
    useEffect(() => {
        function onClickOutside(e: MouseEvent) {
            if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }

        function onEscape(e: KeyboardEvent) {
            if (e.key === "Escape") setIsOpen(false);
        }

        document.addEventListener("mousedown", onClickOutside);
        document.addEventListener("keydown", onEscape);

        return () => {
            document.removeEventListener("mousedown", onClickOutside);
            document.removeEventListener("keydown", onEscape);
        };
    }, []);

    return (
        <div className="notif-wrap" ref={wrapRef}>

            {/* CAMPANITA */}
            <button
                className={`notif-bell ${unreadCount > 0 ? "has-unread" : ""}`}
                aria-label={
                    unreadCount > 0
                        ? `Notificaciones, ${unreadCount} sin leer`
                        : "Notificaciones"
                }
                aria-expanded={isOpen}
                onClick={() => setIsOpen((v) => !v)}
            >
                <i className="bi bi-bell"></i>

                {unreadCount > 0 && (
                    <span className="notif-badge">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* PANEL */}
            {isOpen && (
                <div className="notif-panel" role="dialog" aria-label="Notificaciones">

                    <div className="notif-panel-head">
                        <div className="notif-panel-title">
                            Notificaciones
                            {unreadCount > 0 && (
                                <span className="notif-panel-count">{unreadCount}</span>
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className="notif-panel-actions">
                                {unreadCount > 0 && (
                                    <button onClick={markAllAsRead}>
                                        Marcar todo como leído
                                    </button>
                                )}
                                <button onClick={clearAll}>Vaciar</button>
                            </div>
                        )}
                    </div>

                    <div className="notif-list">
                        {notifications.length === 0 ? (
                            <div className="notif-empty">
                                <i className="bi bi-bell-slash"></i>
                                <p>
                                    Aquí te avisamos cuando termine un scraping o
                                    cuando algo falle.
                                </p>
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={`notif-item is-${n.type} ${
                                        n.read ? "is-read" : ""
                                    }`}
                                    onClick={() => markAsRead(n.id)}
                                >
                                    <div className={`notif-item-icon is-${n.type}`}>
                                        <i className={`bi ${TYPE_ICON[n.type]}`}></i>
                                    </div>

                                    <div className="notif-item-body">
                                        <div className="notif-item-title">{n.title}</div>
                                        <div className="notif-item-message">{n.message}</div>

                                        {n.hint && (
                                            <div className="notif-item-hint">{n.hint}</div>
                                        )}

                                        <div className="notif-item-foot">
                                            <span className="notif-item-time">
                                                {timeAgo(n.createdAt)}
                                            </span>

                                            {n.link && (
                                                <button
                                                    type="button"
                                                    className="notif-item-link"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        markAsRead(n.id);
                                                        setIsOpen(false);
                                                        navigate(n.link!);
                                                    }}
                                                >
                                                    {n.linkLabel || "Ver detalle"}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        className="notif-item-close"
                                        aria-label="Descartar notificación"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            remove(n.id);
                                        }}
                                    >
                                        <i className="bi bi-x"></i>
                                    </button>

                                    {!n.read && <span className="notif-item-dot" />}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}