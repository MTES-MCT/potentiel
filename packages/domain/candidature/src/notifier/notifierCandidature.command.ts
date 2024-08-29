import { Message, MessageHandler, mediator } from 'mediateur';

import { LoadAggregate } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { loadCandidatureFactory } from '../candidature.aggregate';

export type NotifierCandidatureCommand = Message<
  'Candidature.Command.NotifierCandidature',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateNotification: DateTime.ValueType;
  }
>;

export const registerNotifierCandidatureCommand = (loadAggregate: LoadAggregate) => {
  const loadCandidatureAggregate = loadCandidatureFactory(loadAggregate);
  const handler: MessageHandler<NotifierCandidatureCommand> = async (payload) => {
    const candidature = await loadCandidatureAggregate(payload.identifiantProjet, false);
    await candidature.notifier(payload);
  };

  mediator.register('Candidature.Command.NotifierCandidature', handler);
};
