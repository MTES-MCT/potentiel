export const getPériodePrixMoyenPondéré = (projets: { puissance: number; prix: number }[]) => {
  const { totalPondéré, totalPuissance } = projets.reduce(
    (acc, p) => ({
      totalPondéré: acc.totalPondéré + p.puissance * p.prix,
      totalPuissance: acc.totalPuissance + p.puissance,
    }),
    { totalPondéré: 0, totalPuissance: 0 },
  );

  return totalPondéré / totalPuissance;
};
