export const applyStatutFilter = <T>(searchParams: URLSearchParams, statuts: T[] = []) => {
  for (const statut of statuts) {
    searchParams.append('statut', statut as string);
  }
};
