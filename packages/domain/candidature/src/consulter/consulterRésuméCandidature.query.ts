import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import * as StatutCandidature from '../statutCandidature.valueType';
import { CandidatureEntity } from '../candidature.entity';

export type ConsulterRésuméCandidatureReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutCandidature.ValueType;
  nomProjet: string;
  localité: {
    adresse1: string;
    adresse2: string;
    codePostal: string;
    commune: string;
    région: string;
    département: string;
  };
  notifiéeLe: Option.Type<DateTime.ValueType>;
};

export type ConsulterRésuméCandidatureQuery = Message<
  'Candidature.Query.ConsulterRésuméCandidature',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterRésuméCandidatureReadModel>
>;

export type ConsulterCandidatureDependencies = {
  find: Find;
};

export const registerConsulterRésuméCandidatureQuery = ({
  find,
}: ConsulterCandidatureDependencies) => {
  const handler: MessageHandler<ConsulterRésuméCandidatureQuery> = async ({
    identifiantProjet,
  }) => {
    const result = await find<CandidatureEntity>(`candidature|${identifiantProjet}`);

    if (Option.isNone(result)) {
      return result;
    }

    return mapToReadModel(result);
  };

  mediator.register('Candidature.Query.ConsulterRésuméCandidature', handler);
};

export const mapToReadModel = ({
  identifiantProjet,
  statut,
  nomProjet,
  localité,
  notification,
}: CandidatureEntity): ConsulterRésuméCandidatureReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  statut: StatutCandidature.convertirEnValueType(statut),
  nomProjet,
  localité,
  notifiéeLe: notification ? DateTime.convertirEnValueType(notification.notifiéeLe) : Option.none,
});
