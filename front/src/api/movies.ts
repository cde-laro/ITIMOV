const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function getMovies() {
  const res = await fetch(`${API_URL}/movies`);
  if (!res.ok) throw new Error("Erreur lors du chargement des films");
  return res.json();
}

export async function getMovie(id: string) {
  const res = await fetch(`${API_URL}/movies/${id}`);
  if (!res.ok) throw new Error("Erreur lors du chargement du film");
  return res.json();
}