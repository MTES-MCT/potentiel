import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime, Email } from '@potentiel-domain/common';
import { EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { Candidature, IdentifiantProjet } from '.';

import { NotifierLauréatCommand } from './lauréat/notifier/notifierLauréat.command';
import { NotifierÉliminéCommand } from './éliminé/notifier/notifierÉliminé.command';
import { GarantiesFinancières } from './lauréat';

export type SubscriptionEvent = Candidature.CandidatureNotifiéeEvent & Event;

export type Execute = Message<'System.Projet.Saga.Execute', SubscriptionEvent>;

export type ProjetSagaDependencies = {
  récupererGarantiesFinancières: GarantiesFinancières.RécupérerGarantiesFinancièresPort;
};

export const register = ({ récupererGarantiesFinancières }: ProjetSagaDependencies) => {
  const candidatureNotifiéeHandler = async ({ payload }: Candidature.CandidatureNotifiéeEvent) => {
    const statut = Candidature.StatutCandidature.convertirEnValueType(payload.statut);
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);
    const data = {
      identifiantProjet,
      notifiéLe: DateTime.convertirEnValueType(payload.notifiéeLe),
      notifiéPar: Email.convertirEnValueType(payload.notifiéePar),
      attestation: payload.attestation,
    };

    if (statut.estClassé()) {
      const garantiesFinancières = await récupererGarantiesFinancières(identifiantProjet);

      if (garantiesFinancières?.attestation) {
        await mediator.send<EnregistrerDocumentProjetCommand>({
          type: 'Document.Command.EnregistrerDocumentProjet',
          data: {
            documentProjet: garantiesFinancières.attestation.key,
            content: garantiesFinancières.attestation.content,
          },
        });
      }
      await mediator.send<NotifierLauréatCommand>({
        type: 'Lauréat.Command.NotifierLauréat',
        data: {
          ...data,
          garantiesFinancières: garantiesFinancières?.garantiesFinancières,
        },
      });
    } else {
      await mediator.send<NotifierÉliminéCommand>({
        type: 'Éliminé.Command.NotifierÉliminé',
        data,
      });
    }
  };

  const handler: MessageHandler<Execute> = async (event) => {
    await match(event)
      .with({ type: 'CandidatureNotifiée-V3' }, candidatureNotifiéeHandler)
      .exhaustive();
  };
  mediator.register('System.Projet.Saga.Execute', handler);
};
