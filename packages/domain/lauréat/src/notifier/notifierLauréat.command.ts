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
  const loadCandidatureAggregate = Candidature.Aggregate.loadCandidatureFactory(loadAggregate);

  const handler: MessageHandler<NotifierLauréatCommand> = async ({
    identifiantProjet,
    attestation,
    notifiéLe,
    notifiéPar,
  }) => {
    const candidature = await loadCandidatureAggregate(identifiantProjet);
    const lauréat = await loadLauréatAggregate(identifiantProjet, false);

    await lauréat.notifier({
      identifiantProjet,
      attestation,
      notifiéLe,
      notifiéPar,
      localité: candidature.localité,
      nomProjet: candidature.nomProjet,
    });
  };
  mediator.register('Lauréat.Command.NotifierLauréat', handler);
};
