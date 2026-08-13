// utils/exportData.ts
import type { CommentItem } from "../types/scraping";

export function downloadJSON(data: CommentItem[], filename = "comentarios.json") {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadCSV(data: CommentItem[], filename = "comentarios.csv") {
  if (!data || data.length === 0) return;

  // Extraer encabezados del objeto
  const headers = Object.keys(data[0]);
  
  // Construir filas de texto formateando caracteres especiales e incrustando comillas para evitar rupturas de sintaxis
  const csvRows = [
    headers.join(","), // Fila del encabezado
    ...data.map((row) =>
      headers
        .map((header) => {
          const val = row[header as keyof CommentItem] || "";
          const escaped = ("" + val).replace(/"/g, '""'); // Escapar comillas dobles
          return `"${escaped}"`; // Envolver en comillas
        })
        .join(",")
    ),
  ];

  const csvString = csvRows.join("\n");
  // Se agrega BOM (\uFEFF) para que Excel abra el archivo directamente interpretando UTF-8 (emojis, tildes, etc.)
  const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}