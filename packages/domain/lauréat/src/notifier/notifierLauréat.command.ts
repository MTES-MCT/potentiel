import { Message, MessageHandler, mediator } from 'mediateur';

import { LoadAggregate } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';

import { loadLauréatFactory } from '../lauréat.aggregate';
import { Lauréat } from '..';

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
  const loadCandidatureAggregate = Candidature.Aggregate.loadCandidatureFactory(loadAggregate);

  const handler: MessageHandler<NotifierLauréatCommand> = async (payload) => {
    const Lauréat = await loadLauréatAggregate(payload.identifiantProjet, false);
    const { sociétéMère } = await loadCandidatureAggregate(payload.identifiantProjet, false);
    await Lauréat.notifier(payload);

    await mediator.send<Lauréat.ImporterActionnaireLauréatCommand>({
      type: 'Lauréat.Command.ImporterActionnaireLauréat',
      data: {
        identifiantProjet: payload.identifiantProjet,
        importéLe: payload.notifiéLe,
        actionnaire: sociétéMère,
      },
    });
  };

  mediator.register('Lauréat.Command.NotifierLauréat', handler);
};
