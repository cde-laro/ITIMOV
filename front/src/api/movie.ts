const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function fetchMovies() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("Authorization token is missing");
  }

  const res = await fetch(`${API_URL}/movies`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Erreur lors du chargement des films");
  return res.json();
}

export async function fetchMovie(id: string) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("Authorization token is missing");
  }

  const res = await fetch(`${API_URL}/movies/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Erreur lors du chargement du film");
  return res.json();
}

export async function markMovieAsWatched(userId: string, movieId: string) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("Authorization token is missing");

  const res = await fetch(`${API_URL}/users/${userId}/movies/${movieId}/watched`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to mark movie as watched");
}

export async function markMovieAsLiked(userId: string, movieId: string) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("Authorization token is missing");

  const res = await fetch(`${API_URL}/users/${userId}/movies/${movieId}/liked`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to mark movie as liked");
}
