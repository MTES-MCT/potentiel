import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';

import { IdentifiantProjet } from '../../..';
import { DétailCandidatureEntity } from '../détailCandidature.entity';
import { DétailCandidature } from '../..';

export type ConsulterDétailCandidatureReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  détail: DétailCandidature.RawType;
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
    const détailCandidature = await find<DétailCandidatureEntity>(
      `détail-candidature|${identifiantProjet}`,
    );

    if (Option.isNone(détailCandidature)) {
      return Option.none;
    }

    return mapToReadModel(détailCandidature);
  };

  mediator.register('Candidature.Query.ConsulterDétailCandidature', handler);
};

type MapToReadModel = (
  candidature: Omit<DétailCandidatureEntity, 'type'>,
) => ConsulterDétailCandidatureReadModel;

export const mapToReadModel: MapToReadModel = ({
  identifiantProjet,
  détail,
}): ConsulterDétailCandidatureReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  détail,
});
