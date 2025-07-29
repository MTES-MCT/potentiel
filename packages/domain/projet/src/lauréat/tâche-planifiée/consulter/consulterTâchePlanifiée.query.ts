import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';

import { TâchePlanifiéeEntity } from '../tâchePlanifiée.entity';

export type ConsulterTâchePlanifiéeReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  typeTâche: string;
  misÀJourLe: DateTime.ValueType;
  àExécuterLe: DateTime.ValueType;
};

export type ConsulterTâchePlanifiéeQuery = Message<
  'Tâche.Query.ConsulterTâchePlanifiée',
  {
    identifiantProjet: string;
    misÀJourLe?: string;
    àExécuterLe?: string;
  },
  ConsulterTâchePlanifiéeReadModel
>;

export type ConsulterTâchePlanifiéeQueryDependencies = {
  find: Find;
};

export const registerConsulterTâchePlanifiéeQuery = ({
  find,
}: ConsulterTâchePlanifiéeQueryDependencies) => {
  const handler: MessageHandler<ConsulterTâchePlanifiéeQuery> = async ({
    identifiantProjet,
    misÀJourLe,
    àExécuterLe,
  }) => {
    const tâchePlanifiée = await find<TâchePlanifiéeEntity>(
      `tâche-planifiée|${identifiantProjet}`,
      {
        where: {
          misÀJourLe,
          àExécuterLe,
        },
      },
    );

    if (Option.isNone(tâchePlanifiée)) {
      return tâchePlanifiée;
    }

    return mapToReadModel(tâchePlanifiée);
  };
  mediator.register('Tâche.Query.ConsulterTâchePlanifiée', handler);
};

const mapToReadModel = ({
  identifiantProjet,
  misÀJourLe,
  typeTâche,
  àExécuterLe,
}: TâchePlanifiéeEntity): ConsulterTâchePlanifiéeReadModel => {
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    misÀJourLe: DateTime.convertirEnValueType(misÀJourLe),
    àExécuterLe: DateTime.convertirEnValueType(àExécuterLe),
    typeTâchePlanifiée: typeTâche,
  };
};
