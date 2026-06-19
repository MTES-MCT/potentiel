import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { Find } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';

import { IdentifiantProjet } from '../../../index.js';
import type { DétailCandidatureVérifié, DétailCandidatureVérifiéEntity } from '../../index.js';

export type ConsulterDétailCandidatureReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  détail: DétailCandidatureVérifié;
};

export type ConsulterDétailCandidatureQuery = Message<
  'Candidature.Query.ConsulterDétailCandidature',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterDétailCandidatureReadModel>
>;

export type ConsulterCandidatureDependencies = {
  find: Find;
};

export const registerConsulterDétailCandidatureQuery = ({
  find,
}: ConsulterCandidatureDependencies) => {
  const handler: MessageHandler<ConsulterDétailCandidatureQuery> = async ({
    identifiantProjet,
  }) => {
    const détailCandidature = await find<DétailCandidatureVérifiéEntity>(
      `détail-candidature-vérifié|${identifiantProjet}`,
    );

    if (Option.isNone(détailCandidature)) {
      return Option.none;
    }

    return mapToReadModel(détailCandidature);
  };

  mediator.register('Candidature.Query.ConsulterDétailCandidature', handler);
};

type MapToReadModel = (
  candidature: Omit<DétailCandidatureVérifiéEntity, 'type'>,
) => ConsulterDétailCandidatureReadModel;

export const mapToReadModel: MapToReadModel = (détail): ConsulterDétailCandidatureReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(détail.identifiantProjet),
  détail,
});
