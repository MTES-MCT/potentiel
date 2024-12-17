import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { LauréatEntity } from '../lauréat.entity';
import { ActionnaireEntity } from '../actionnaire';
import { Actionnaire } from '..';

export type ConsulterLauréatReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  notifiéLe: DateTime.ValueType;
  notifiéPar: Email.ValueType;
  actionnaire: String;
};

export type ConsulterLauréatQuery = Message<
  'Lauréat.Query.ConsulterLauréat',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterLauréatReadModel>
>;

export type ConsulterLauréatDependencies = {
  find: Find;
};

export const registerConsulterLauréatQuery = ({ find }: ConsulterLauréatDependencies) => {
  const handler: MessageHandler<ConsulterLauréatQuery> = async ({ identifiantProjet }) => {
    const lauréat = await find<LauréatEntity>(`lauréat|${identifiantProjet}`);
    const actionnaire = await find<ActionnaireEntity>(`actionnaire|${identifiantProjet}`, {
      select: ['actionnaire.nom'],
    });

    if (Option.isNone(lauréat)) {
      return lauréat;
    }

    return mapToReadModel(
      lauréat,
      Option.match(actionnaire)
        .some((value) => value.actionnaire.nom)
        .none(() => ''),
    );
  };
  mediator.register('Lauréat.Query.ConsulterLauréat', handler);
};

const mapToReadModel = (
  { identifiantProjet, notifiéLe, notifiéPar }: LauréatEntity,
  actionnaire: Actionnaire.ActionnaireEntity['actionnaire']['nom'],
): ConsulterLauréatReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  notifiéLe: DateTime.convertirEnValueType(notifiéLe),
  notifiéPar: Email.convertirEnValueType(notifiéPar),
  actionnaire,
});
