import { ReadModel } from '@potentiel-domain/core-views';
import { RawIdentifiantUtilisateur } from '@potentiel/domain-usecases';

export type UtilisateurLegacyReadModel = ReadModel<
  'utilisateur',
  {
    identifiantUtilisateur: RawIdentifiantUtilisateur;
    nomComplet: string;
    fonction: string;
  }
>;
