export const distinctObjectArray = (tableau) => {
  // tableau represente la liste de film avec ses doublons
  const result = []; // tableau resultat
  const map = new Map(); // dictionnaire vide
  for (const movie of tableau) // Pour chaque movie du tableau
    if (!map.has(movie.id)) {
      // Si l'id n'est pas présent dans notre dictionnaire
      map.set(movie.id, true); // On ajoute l'id au dictionnaire
      result.push({
        // et on rajoute le film a notre tableau final
        ...movie,
      });
    }
  return result;
};
