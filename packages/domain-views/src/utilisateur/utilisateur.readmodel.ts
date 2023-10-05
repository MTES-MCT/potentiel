import { ReadModel } from '@potentiel/core-domain-views';
import { RawIdentifiantUtilisateur } from '@potentiel/domain';

export type UtilisateurLegacyReadModel = ReadModel<
  'utilisateur',
  {
    identifiantUtilisateur: RawIdentifiantUtilisateur;
    nomComplet: string;
    fonction: string;
  }
>;
