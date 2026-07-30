import type { Candidature } from '@potentiel-domain/projet';

export const afficherStatutCandidature = (value: Candidature.StatutCandidature.ValueType) =>
  value.estClassé() ? 'lauréat' : value.formatter();
