import {
  IdentifiantProjet,
  RawIdentifiantProjet,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain-usecases';

import { Message, MessageHandler, mediator } from 'mediateur';
import { Find } from '@potentiel-domain/core-views';
import { Option } from '@potentiel/monads';
import { RécupérerCandidatureLegacyPort } from '../candidature.port';
import { CandidatureLegacyReadModel } from '../candidature.readmodel';

export type ConsulterCandidatureLegacyQuery = Message<
  'CONSULTER_CANDIDATURE_LEGACY_QUERY',
  {
    identifiantProjet: RawIdentifiantProjet | IdentifiantProjet;
  },
  Option<CandidatureLegacyReadModel>
>;

export type ConsulterCandidatureLegacyDependencies = {
  find: Find;
  récupérerCandidature: RécupérerCandidatureLegacyPort;
};

export const registerConsulterCandidatureLegacyQuery = ({
  find,
  récupérerCandidature,
}: ConsulterCandidatureLegacyDependencies) => {
  const queryHandler: MessageHandler<ConsulterCandidatureLegacyQuery> = async ({
    identifiantProjet,
  }) => {
    const identifiantProjetValueType = convertirEnIdentifiantProjet(identifiantProjet);
    const candidature = await récupérerCandidature(identifiantProjetValueType);

    return candidature;
  };

  mediator.register('CONSULTER_CANDIDATURE_LEGACY_QUERY', queryHandler);
};
