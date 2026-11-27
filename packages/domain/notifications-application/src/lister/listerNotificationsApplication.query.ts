import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { type List, type RangeOptions, Where } from '@potentiel-domain/entity';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import type { NotificationApplicationEntity } from '../notificationApplication.entity.js';

export type ListerNotificationsApplicationItemReadModel = {
  identifiantUtilisateur: Email.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  domaine: NotificationApplicationEntity['domaine'];
  dateChangement: DateTime.ValueType;
};

export type ListerNotificationsApplicationReadModel = {
  items: ReadonlyArray<ListerNotificationsApplicationItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerNotificationsApplicationQuery = Message<
  'NotificationApplication.Query.ListerNotificationsApplication',
  {
    identifiantUtilisateur: Email.RawType;
    range?: RangeOptions;
  },
  ListerNotificationsApplicationReadModel
>;

export type ListerNotificationsApplicationDependencies = {
  list: List;
};

export const registerListerNotificationsApplicationQuery = ({
  list,
}: ListerNotificationsApplicationDependencies) => {
  const handler: MessageHandler<ListerNotificationsApplicationQuery> = async ({
    identifiantUtilisateur,
    range,
  }) => {
    const {
      items,
      range: listRange,
      total,
    } = await list<NotificationApplicationEntity>('notification-application', {
      where: {
        identifiantUtilisateur: Where.equal(identifiantUtilisateur),
      },
      orderBy: {
        dateChangement: 'descending',
      },
      range,
    });

    return {
      items: items.map(mapToReadModel),
      range: listRange,
      total,
    };
  };

  mediator.register('NotificationApplication.Query.ListerNotificationsApplication', handler);
};

const mapToReadModel = ({
  identifiantUtilisateur,
  identifiantProjet,
  domaine,
  dateChangement,
}: NotificationApplicationEntity): ListerNotificationsApplicationItemReadModel => ({
  identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateur),
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  domaine,
  dateChangement: DateTime.convertirEnValueType(dateChangement),
});
