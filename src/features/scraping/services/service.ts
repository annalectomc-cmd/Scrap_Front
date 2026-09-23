// features/scraping/services/service.ts

import { apiClient, ApiError } from "../../../services/api/client";
import type { ScrapingConfig, CommentItem } from "../types/scraping";

const PLATFORM_MAP: Record<string, number> = {
  tiktok: 1,
  youtube: 3,
  instagram: 2,
};

const DEPTH_TO_SCROLL: Record<string, number> = {
  low: 5,
  medium: 15,
  high: 30,
};

const SEARCH_TYPE_MAP: Record<string, number> = {
  profile: 1,
  hashtag: 2,
};

/**
 * El backend a veces responde 200 con un cuerpo que NO es el
 * array de comentarios: puede venir envuelto ({ data: [...] } o
 * { comments: [...] }), o puede ser un error de negocio con
 * status 200 ({ error: "..." }, { message: "..." }).
 *
 * Esta función es el único lugar que decide qué forma tiene la
 * respuesta, para que el resto de la app pueda confiar en que
 * executeScraping() siempre devuelve CommentItem[] o lanza un
 * Error con un mensaje real.
 */
function extractComments(raw: unknown): CommentItem[] {
  if (Array.isArray(raw)) {
    return raw;
  }

  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;

    if (typeof obj.error === "string") {
      throw new Error(obj.error);
    }
    if (typeof obj.message === "string" && obj.success === false) {
      throw new Error(obj.message);
    }

    if (Array.isArray(obj.data)) return obj.data as CommentItem[];
    if (Array.isArray(obj.comments)) return obj.comments as CommentItem[];
    if (Array.isArray(obj.results)) return obj.results as CommentItem[];
  }

  throw new Error(
    `El backend respondió con un formato inesperado: ${JSON.stringify(raw).slice(0, 200)}`
  );
}

export async function executeScraping(config: ScrapingConfig): Promise<CommentItem[]> {
  const platformId = PLATFORM_MAP[config.platform] || 1;
  const scrollValue = DEPTH_TO_SCROLL[config.depth] || 5;
  const typeValue = SEARCH_TYPE_MAP[config.searchType] || 1;

  const cleanProfile = config.target.replace(/^@/, "");

  const queryParams = new URLSearchParams({
    platform: platformId.toString(),
    profile: cleanProfile,
    cant: config.videoCount.toString(),
    type: typeValue.toString(),
    scroll: scrollValue.toString(),
  });

  try {
    const raw = await apiClient.get<unknown>(`/scrap/comments?${queryParams.toString()}`);
    return extractComments(raw);
  } catch (err) {
    if (err instanceof ApiError) throw err; // ya trae el mensaje real del backend
    throw err; // re-lanza el error de extractComments tal cual (formato inesperado, error de negocio, etc.)
  }
}