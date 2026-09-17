/* =========================================================
   src/types/notifications.ts
   ========================================================= */

export type NotificationType = "success" | "error" | "warning" | "info";

export interface AppNotification {
    id: string;

    type: NotificationType;

    /** Línea principal. Ej: "Scraping completado" */
    title: string;

    /** Detalle. Ej: "Motorola_col · 403 comentarios extraídos" */
    message: string;

    /** Sugerencia de qué hacer, sobre todo en errores. */
    hint?: string;

    /** Timestamp en milisegundos. */
    createdAt: number;

    read: boolean;

    /** Ruta opcional a la que navegar al hacer clic. Ej: "/reports" */
    link?: string;

    /** Etiqueta del enlace. Ej: "Ver reporte" */
    linkLabel?: string;
}

/** Lo que se pasa al crear una notificación (el resto se genera solo). */
export type NewNotification = Omit<AppNotification, "id" | "createdAt" | "read">;