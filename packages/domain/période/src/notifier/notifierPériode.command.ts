import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { Candidature } from '@potentiel-domain/candidature';

import { loadPériodeFactory } from '../période.aggregate';
import * as IdentifiantPériode from '../identifiantPériode.valueType';

export type NotifierPériodeCommand = Message<
  'Période.Command.NotifierPériode',
  {
    identifiantPériode: IdentifiantPériode.ValueType;
    candidats: ReadonlyArray<IdentifiantProjet.ValueType>;
  }
>;

export const registerNotifierPériodeCommand = (loadAggregate: LoadAggregate) => {
  const loadPériode = loadPériodeFactory(loadAggregate);
  const loadCandidature = Candidature.Aggregate.loadCandidatureFactory(loadAggregate);

  const handler: MessageHandler<NotifierPériodeCommand> = async ({
    identifiantPériode,
    candidats,
  }) => {
    const lauréats: Array<IdentifiantProjet.ValueType> = [];
    const éliminés: Array<IdentifiantProjet.ValueType> = [];

    for (const candidat of candidats) {
      const candidature = await loadCandidature(candidat);

      if (candidature.statut?.estClassé()) {
        lauréats.push(candidat);
      }

      if (candidature.statut?.estÉliminé()) {
        éliminés.push(candidat);
      }
    }

    const période = await loadPériode(identifiantPériode, false);
    await période.notifier({ identifiantPériode, lauréats, éliminés });
  };

  mediator.register('Période.Command.NotifierPériode', handler);
};
