/* =========================================================
   src/utils/scrapingErrors.ts

   Traduce un error técnico a un mensaje que el usuario
   entienda, con una sugerencia de qué hacer.
   ========================================================= */

export interface ScrapingErrorInfo {
    /** Código interno, útil para logs y métricas. */
    code: string;

    /** Qué pasó, en lenguaje de usuario. */
    message: string;

    /** Qué puede hacer el usuario al respecto. */
    hint: string;
}

interface ErrorRule {
    code: string;
    /** Palabras clave que pueden venir en el mensaje o el status. */
    match: (text: string, status?: number) => boolean;
    message: string;
    hint: string;
}

/* =========================================================
   CASOS MÁS FRECUENTES EN SCRAPING DE REDES SOCIALES
   Están ordenados de más específico a más general.
   ========================================================= */

const RULES: ErrorRule[] = [
    {
        code: "PERFIL_NO_ENCONTRADO",
        match: (t, s) =>
            s === 404 ||
            t.includes("not found") ||
            t.includes("no existe") ||
            t.includes("user not found"),
        message: "No encontramos el perfil o la publicación.",
        hint: "Revisa que la URL o el usuario estén bien escritos y que el contenido siga publicado.",
    },
    {
        code: "CONTENIDO_PRIVADO",
        match: (t, s) =>
            s === 403 ||
            t.includes("private") ||
            t.includes("privado") ||
            t.includes("forbidden"),
        message: "El contenido es privado o tiene restricción de acceso.",
        hint: "Solo podemos extraer comentarios de cuentas y publicaciones públicas.",
    },
    {
        code: "LIMITE_DE_PETICIONES",
        match: (t, s) =>
            s === 429 ||
            t.includes("rate limit") ||
            t.includes("too many requests") ||
            t.includes("throttle"),
        message: "La plataforma bloqueó temporalmente las peticiones por exceso de solicitudes.",
        hint: "Espera unos minutos antes de volver a ejecutar. Reducir la cantidad de comentarios ayuda.",
    },
    {
        code: "SESION_EXPIRADA",
        match: (t, s) =>
            s === 401 ||
            t.includes("unauthorized") ||
            t.includes("token") ||
            t.includes("credential") ||
            t.includes("login"),
        message: "La sesión con la plataforma expiró o las credenciales no son válidas.",
        hint: "Vuelve a conectar la cuenta desde Configuración y ejecuta de nuevo.",
    },
    {
        code: "CAPTCHA",
        match: (t) =>
            t.includes("captcha") ||
            t.includes("verify you are human") ||
            t.includes("challenge"),
        message: "La plataforma pidió una verificación antihumano que bloqueó la extracción.",
        hint: "Espera unos minutos e intenta de nuevo. Si se repite, prueba con menos comentarios por corrida.",
    },
    {
        code: "TIEMPO_AGOTADO",
        match: (t) =>
            t.includes("timeout") ||
            t.includes("timed out") ||
            t.includes("etimedout") ||
            t.includes("aborted"),
        message: "La extracción superó el tiempo máximo de espera.",
        hint: "Puede ser una publicación con demasiados comentarios. Intenta con un límite más bajo.",
    },
    {
        code: "SIN_CONEXION",
        match: (t) =>
            t.includes("failed to fetch") ||
            t.includes("network") ||
            t.includes("econnrefused") ||
            t.includes("enotfound") ||
            t.includes("err_connection"),
        message: "No pudimos conectarnos con el servicio de scraping.",
        hint: "Revisa tu conexión y que el servidor esté activo, luego vuelve a ejecutar.",
    },
    {
        code: "ERROR_DEL_SERVIDOR",
        match: (_t, s) => typeof s === "number" && s >= 500,
        message: "El servicio de scraping respondió con un error interno.",
        hint: "Vuelve a intentar en unos minutos. Si persiste, revisa los logs del servidor.",
    },
    {
        code: "RESPUESTA_INVALIDA",
        match: (t) =>
            t.includes("json") ||
            t.includes("unexpected token") ||
            t.includes("parse") ||
            t.includes("selector"),
        message: "La respuesta llegó en un formato que no pudimos leer.",
        hint: "La plataforma pudo haber cambiado su estructura. Reporta el caso para actualizar el extractor.",
    },
    {
        code: "SIN_COMENTARIOS",
        match: (t) =>
            t.includes("sin comentarios") ||
            t.includes("no comments") ||
            t.includes("empty"),
        message: "La publicación no tiene comentarios disponibles para extraer.",
        hint: "Verifica que los comentarios estén habilitados en la publicación.",
    },
];

const FALLBACK: ScrapingErrorInfo = {
    code: "ERROR_DESCONOCIDO",
    message: "El scraping se detuvo por un error inesperado.",
    hint: "Vuelve a ejecutarlo. Si sigue fallando, revisa la consola para ver el detalle técnico.",
};

/* =========================================================
   API PRINCIPAL
   ========================================================= */

export function mapScrapingError(error: unknown, status?: number): ScrapingErrorInfo {
    const raw =
        error instanceof Error
            ? error.message
            : typeof error === "string"
            ? error
            : JSON.stringify(error ?? "");

    const text = raw.toLowerCase();

    const rule = RULES.find((r) => r.match(text, status));

    if (!rule) return FALLBACK;

    return {
        code: rule.code,
        message: rule.message,
        hint: rule.hint,
    };
}