// services/scraping/service.ts

import type { ScrapingConfig, CommentItem } from "../../types/scraping";

const BASE_URL = "http://localhost:5000"; // Tu backend en Flask

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

export async function executeScraping(config: ScrapingConfig): Promise<CommentItem[]> {
  const platformId = PLATFORM_MAP[config.platform] || 1;
  const scrollValue = DEPTH_TO_SCROLL[config.depth] || 5;
  const typeValue = SEARCH_TYPE_MAP[config.searchType] || 1;

  // 1. Limpiamos el '@' por si el usuario lo ingresa en el input
  const cleanProfile = config.target.replace(/^@/, "");

  const queryParams = new URLSearchParams({
    platform: platformId.toString(),
    profile: cleanProfile,
    cant: config.videoCount.toString(),
    type: typeValue.toString(),
    scroll: scrollValue.toString(),
  });

  // 2. Agregamos '/scrap' a la ruta de la petición
  const response = await fetch(`${BASE_URL}/scrap/comments?${queryParams.toString()}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al realizar el scraping");
  }

  return await response.json();
}