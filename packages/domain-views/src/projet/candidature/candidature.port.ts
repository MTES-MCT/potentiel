import { IdentifiantProjetValueType } from '@potentiel/domain-usecases';
import { Option } from '@potentiel/monads';
import { CandidatureLegacyReadModel } from './candidature.readmodel';

export type RécupérerCandidatureLegacyPort = (
  identifiantProjet: IdentifiantProjetValueType,
) => Promise<Option<CandidatureLegacyReadModel>>;
