import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { StatutProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/core';

import { CandidatureEntity } from '../candidature.entity';

export type ConsulterCandidatureReadModel = {
  statut: StatutProjet.RawType;
  nom: string;
};

export type ConsulterCandidatureQuery = Message<
  'Candidature.Query.ConsulterCandidature',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterCandidatureReadModel>
>;

export type ConsulterCandidatureDependencies = {
  find: Find;
};

export const registerConsulterCandidatureQuery = ({ find }: ConsulterCandidatureDependencies) => {
  const handler: MessageHandler<ConsulterCandidatureQuery> = async ({ identifiantProjet }) => {
    const result = await find<CandidatureEntity>(`candidature|${identifiantProjet}`);

    if (Option.isNone(result)) {
      return result;
    }

    return mapToReadModel(result);
  };

  mediator.register('Candidature.Query.ConsulterCandidature', handler);
};

const mapToReadModel = ({ nom, statut }: CandidatureEntity): ConsulterCandidatureReadModel => {
  return {
    nom,
    statut,
  };
};
