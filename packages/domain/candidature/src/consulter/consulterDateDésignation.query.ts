import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';

import { ProjetEntity } from '../projet.entity';

export type ConsulterDateDésignationReadModel = {
  dateDésignation: DateTime.RawType;
};

export type ConsulterDateDésignationQuery = Message<
  'Candidature.Query.ConsulterDateDésignation',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterDateDésignationReadModel>
>;

export type RécupérerProjetPort = (identifiantProjet: string) => Promise<Option.Type<ProjetEntity>>;

export type ConsulterDateDésignationDependencies = {
  récupérerProjet: RécupérerProjetPort;
};

export const registerConsulterDateDésignationQuery = ({
  récupérerProjet,
}: ConsulterDateDésignationDependencies) => {
  const handler: MessageHandler<ConsulterDateDésignationQuery> = async ({ identifiantProjet }) => {
    const result = await récupérerProjet(identifiantProjet);

    if (Option.isNone(result)) {
      return result;
    }

    return mapToReadModel(result);
  };

  mediator.register('Candidature.Query.ConsulterDateDésignation', handler);
};

const mapToReadModel = ({ dateDésignation }: ProjetEntity): ConsulterDateDésignationReadModel => {
  return {
    dateDésignation,
  };
};
