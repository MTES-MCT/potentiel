import { RawIdentifiantUtilisateur } from '@potentiel/domain';
import { Option } from '@potentiel/monads';
import { UtilisateurLegacyReadModel } from './utilisateur.readmodel';

export type RécupérerUtilisateurLegacyPort = (
  identifiantUtilisateur: RawIdentifiantUtilisateur,
) => Promise<Option<UtilisateurLegacyReadModel>>;
