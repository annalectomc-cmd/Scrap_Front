const API_URL = "http://localhost:5000"


export async function getComments(search:string, cant:string, type:string, scroll:string) {
    const response = await fetch(`${API_URL}/comments?profile=${encodeURIComponent(search)}&cant=${encodeURIComponent(Number(cant))}&type=${encodeURIComponent(Number(type))}&scroll=${encodeURIComponent(Number(scroll))}`)
    if(!response.ok) {
        throw new Error("No se pudieron obtener comentarios");
    }
    return await response.json()
}