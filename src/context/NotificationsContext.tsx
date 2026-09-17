/* =========================================================
   src/context/NotificationsContext.tsx

   Contexto global de notificaciones.
   Persiste en localStorage para que sobrevivan a un refresh.
   ========================================================= */

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import type { ReactNode } from "react";
import type {
    AppNotification,
    NewNotification,
    NotificationType,
} from "../types/notifications";

const STORAGE_KEY = "notifications";
const MAX_NOTIFICATIONS = 50;

interface NotificationsContextValue {
    notifications: AppNotification[];
    unreadCount: number;

    notify: (n: NewNotification) => string;

    /** Atajos para los casos más comunes. */
    notifySuccess: (title: string, message: string, extra?: Partial<NewNotification>) => string;
    notifyError: (title: string, message: string, extra?: Partial<NewNotification>) => string;

    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    remove: (id: string) => void;
    clearAll: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

function createId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
    // Estado inicial leído directo de localStorage (lazy init), en vez
    // de arrancar en [] y cargar después en un useEffect aparte.
    // Eso evitaba una ventana donde notifications=[] convivía con el
    // efecto de guardado, que terminaba pisando el localStorage justo
    // después de leerlo (se notaba sobre todo con StrictMode, que
    // ejecuta los efectos dos veces en desarrollo).
    const [notifications, setNotifications] = useState<AppNotification[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            // JSON corrupto: arrancamos limpio en vez de romper la app.
            localStorage.removeItem(STORAGE_KEY);
            return [];
        }
    });

    /* Guardar en cada cambio */
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
        } catch {
            // Sin espacio en localStorage: no es crítico, seguiria en memoria.
        }
    }, [notifications]);

    const notify = useCallback((n: NewNotification) => {
        const id = createId();

        const notification: AppNotification = {
            ...n,
            id,
            createdAt: Date.now(),
            read: false,
        };

        setNotifications((prev) =>
            [notification, ...prev].slice(0, MAX_NOTIFICATIONS)
        );

        return id;
    }, []);

    const notifyWithType = useCallback(
        (
            type: NotificationType,
            title: string,
            message: string,
            extra?: Partial<NewNotification>
        ) => notify({ type, title, message, ...extra }),
        [notify]
    );

    const notifySuccess = useCallback(
        (title: string, message: string, extra?: Partial<NewNotification>) =>
            notifyWithType("success", title, message, extra),
        [notifyWithType]
    );

    const notifyError = useCallback(
        (title: string, message: string, extra?: Partial<NewNotification>) =>
            notifyWithType("error", title, message, extra),
        [notifyWithType]
    );

    const markAsRead = useCallback((id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }, []);

    const remove = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const clearAll = useCallback(() => setNotifications([]), []);

    const unreadCount = useMemo(
        () => notifications.filter((n) => !n.read).length,
        [notifications]
    );

    const value = useMemo(
        () => ({
            notifications,
            unreadCount,
            notify,
            notifySuccess,
            notifyError,
            markAsRead,
            markAllAsRead,
            remove,
            clearAll,
        }),
        [
            notifications,
            unreadCount,
            notify,
            notifySuccess,
            notifyError,
            markAsRead,
            markAllAsRead,
            remove,
            clearAll,
        ]
    );

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    );
}

export function useNotifications() {
    const ctx = useContext(NotificationsContext);

    if (!ctx) {
        throw new Error(
            "useNotifications debe usarse dentro de <NotificationsProvider>."
        );
    }

    return ctx;
}