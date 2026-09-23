export type Platform = "tiktok" | "instagram" | "youtube";

export type SearchType = "profile" | "hashtag";

export type Depth = "low" | "medium" | "high";

export interface ScrapingConfig {
    platform: Platform;
    searchType: SearchType;
    target: string;
    videoCount: number;
    depth: Depth;
    saveProject: boolean;
}


export interface ReportItem {
  id: string;
  projectName: string;
  platform: Platform;
  target: string;
  date: string;
  commentsCount: number;
  status: "Completado" | "Error" | "En progreso";
  data: CommentItem[];
  config: ScrapingConfig;
}

export interface ProgressState {
    percentage: number;
    status: "idle" | "running" | "completed" | "error";
    message: string;
    logs: string[];
}

// Estructura exacta del JSON que devuelve el backend en Flask
export interface CommentItem {
    comment: string;
    date: string;
    likes: string;
    media: string;
    user: string;
    video_id: string;
}

export interface ScrapingResults {
    comments: number;
    videos: number;
    duration: string;
    data?: CommentItem[]; // Arreglo opcional con la lista completa de comentarios
}