import { Message, MessageHandler, mediator } from 'mediateur';

import { LoadAggregate } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';

import { loadLauréatFactory } from '../lauréat.aggregate';

export type NotifierLauréatCommand = Message<
  'Lauréat.Command.NotifierLauréat',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    notifiéLe: DateTime.ValueType;
    notifiéPar: Email.ValueType;
    attestation: { format: string };
  }
>;

export const registerNotifierLauréatCommand = (loadAggregate: LoadAggregate) => {
  const loadLauréatAggregate = loadLauréatFactory(loadAggregate);
  const handler: MessageHandler<NotifierLauréatCommand> = async (payload) => {
    const Lauréat = await loadLauréatAggregate(payload.identifiantProjet, false);
    await Lauréat.notifier(payload);
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

  mediator.register('Lauréat.Command.NotifierLauréat', handler);
};
