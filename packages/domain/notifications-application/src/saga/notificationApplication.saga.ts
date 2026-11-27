import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { DateTime, Email } from '@potentiel-domain/common';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import type { ListerUtilisateursQuery } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import type { AjouterNotificationApplicationCommand } from '../ajouter/ajouterNotificationApplication.command.js';

export type SubscriptionEvent =
  Lauréat.ReprésentantLégal.ChangementReprésentantLégalEnregistréEvent;

export type Execute = Message<'System.NotificationApplication.Saga.Execute', SubscriptionEvent>;

const notificationApplicationAjoutéeHandler = async ({
  payload: { identifiantProjet, enregistréLe },
}: SubscriptionEvent) => {
  const projet = await mediator.send<Lauréat.ConsulterLauréatQuery>({
    type: 'Lauréat.Query.ConsulterLauréat',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(projet)) {
    throw new Error('Projet non trouvé');
  }

  const dreals = await mediator.send<ListerUtilisateursQuery>({
    type: 'Utilisateur.Query.ListerUtilisateurs',
    data: {
      actif: true,
      roles: ['dreal'],
      région: projet.localité.région,
    },
  });

  if (!dreals.items.length) {
    return;
  }

  for (const dreal of dreals.items) {
    await mediator.send<AjouterNotificationApplicationCommand>({
      type: 'NotificationApplication.Command.Ajouter',
      data: {
        domaine: 'représentant-légal',
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
        identifiantUtilisateur: Email.convertirEnValueType(dreal.email),
        dateChangement: DateTime.convertirEnValueType(enregistréLe),
      },
    });
  }
};

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    await match(event)
      .with(
        { type: 'ChangementReprésentantLégalEnregistré-V1' },
        notificationApplicationAjoutéeHandler,
      )
      .exhaustive();
  };
  mediator.register('System.NotificationApplication.Saga.Execute', handler);
};
