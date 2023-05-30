export type ImporterDatesMiseEnServiceApiResult = Array<
  { référenceDossier: string } & ({ statut: 'réussi' } | { statut: 'échec'; raison: string })
>;
