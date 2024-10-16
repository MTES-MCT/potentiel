import { Message, MessageHandler, mediator } from 'mediateur';

import { LoadAggregate } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { loadCandidatureFactory } from '../candidature.aggregate';

export type NotifierCandidatureCommand = Message<
  'Candidature.Command.NotifierCandidature',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    notifiéeLe: DateTime.ValueType;
    notifiéePar: Email.ValueType;
    validateur: AppelOffre.Validateur;
    attestation?: { format: string };
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
