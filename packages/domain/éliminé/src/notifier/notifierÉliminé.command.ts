import { Message, MessageHandler, mediator } from 'mediateur';

import { LoadAggregate } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';

import { loadÉliminéFactory } from '../éliminé.aggregate';

export type NotifierÉliminéCommand = Message<
  'Éliminé.Command.NotifierÉliminé',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    notifiéLe: DateTime.ValueType;
    notifiéPar: Email.ValueType;
    attestation: { format: string };
  }
>;

export const registerNotifierÉliminéCommand = (loadAggregate: LoadAggregate) => {
  const loadÉliminéAggregate = loadÉliminéFactory(loadAggregate);
  const handler: MessageHandler<NotifierÉliminéCommand> = async (payload) => {
    const éliminé = await loadÉliminéAggregate(payload.identifiantProjet, false);
    await éliminé.notifier(payload);
    await mediator.send<Candidature.NotifierCandidatureUseCase>({
      type: 'Candidature.UseCase.NotifierCandidature',
      data: {
        identifiantProjetValue: payload.identifiantProjet.formatter(),
        notifiéeLeValue: payload.notifiéLe.formatter(),
        notifiéeParValue: payload.notifiéPar.formatter(),
        attestationValue: {
          format: 'application/pdf',
        },
      },
    });
  };

  mediator.register('Éliminé.Command.NotifierÉliminé', handler);
};
