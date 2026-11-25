import type { Utilisateur } from '@potentiel-domain/utilisateur';

export type PotentielUtilisateur = Utilisateur.ValueType & {
  nom?: string;
  accountUrl?: string;
  isImpersonated?: true;
};
