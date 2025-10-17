import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime, Email } from '@potentiel-domain/common';

import { Candidature, IdentifiantProjet } from '.';

import { NotifierLauréatCommand } from './lauréat/notifier/notifierLauréat.command';
import { NotifierÉliminéCommand } from './éliminé/notifier/notifierÉliminé.command';

export type SubscriptionEvent = Candidature.CandidatureNotifiéeEvent & Event;

export type Execute = Message<'System.Projet.Saga.Execute', SubscriptionEvent>;

const candidatureNotifiéeHandler = async ({ payload }: Candidature.CandidatureNotifiéeEvent) => {
  const statut = Candidature.StatutCandidature.convertirEnValueType(payload.statut);
  const data = {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(payload.identifiantProjet),
    notifiéLe: DateTime.convertirEnValueType(payload.notifiéeLe),
    notifiéPar: Email.convertirEnValueType(payload.notifiéePar),
    attestation: payload.attestation,
  };

  if (statut.estClassé()) {
    await mediator.send<NotifierLauréatCommand>({
      type: 'Lauréat.Command.NotifierLauréat',
      data,
    });
  } else {
    await mediator.send<NotifierÉliminéCommand>({
      type: 'Éliminé.Command.NotifierÉliminé',
      data,
    });
  }
};

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    await match(event)
      .with({ type: 'CandidatureNotifiée-V3' }, candidatureNotifiéeHandler)
      .exhaustive();
  };
  mediator.register('System.Projet.Saga.Execute', handler);
};
