import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { Candidature } from '@potentiel-domain/candidature';

import { loadPériodeFactory } from '../période.aggregate';
import * as IdentifiantPériode from '../identifiantPériode.valueType';

export type NotifierPériodeCommand = Message<
  'Période.Command.NotifierPériode',
  {
    identifiantPériode: IdentifiantPériode.ValueType;
    notifiéeLe: DateTime.ValueType;
    notifiéePar: Email.ValueType;
    candidats: ReadonlyArray<IdentifiantProjet.ValueType>;
  }
>;

export const registerNotifierPériodeCommand = (loadAggregate: LoadAggregate) => {
  const loadPériode = loadPériodeFactory(loadAggregate);
  const loadCandidature = Candidature.Aggregate.loadCandidatureFactory(loadAggregate);

  const handler: MessageHandler<NotifierPériodeCommand> = async ({
    identifiantPériode,
    notifiéeLe,
    notifiéePar,
    candidats,
  }) => {
    const lauréats: Array<IdentifiantProjet.ValueType> = [];
    const éliminés: Array<IdentifiantProjet.ValueType> = [];

    for (const candidat of candidats) {
      const candidature = await loadCandidature(candidat);

      if (candidature.statut?.estClassé()) {
        try {
          // Call NotifierLauréat
        } catch (error) {}

        lauréats.push(candidat);
      }

      if (candidature.statut?.estÉliminé()) {
        try {
          // Call NotifierÉliminé
        } catch (error) {}

        éliminés.push(candidat);
      }
    }

    const période = await loadPériode(identifiantPériode, false);
    await période.notifier({ identifiantPériode, notifiéeLe, notifiéePar, lauréats, éliminés });
  };

  mediator.register('Période.Command.NotifierPériode', handler);
};
