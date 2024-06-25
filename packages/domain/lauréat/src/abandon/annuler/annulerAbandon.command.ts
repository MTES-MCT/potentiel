import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadAbandonFactory } from '../abandon.aggregate';

export type AnnulerAbandonCommand = Message<
  'Lauréat.Abandon.Command.AnnulerAbandon',
  {
    dateAnnulation: DateTime.ValueType;
    identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerAnnulerAbandonCommand = (loadAggregate: LoadAggregate) => {
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const handler: MessageHandler<AnnulerAbandonCommand> = async ({
    dateAnnulation,
    identifiantUtilisateur,
    identifiantProjet,
  }) => {
    const abandon = await loadAbandon(identifiantProjet);

    await abandon.annuler({
      dateAnnulation,
      identifiantProjet,
      identifiantUtilisateur,
    });
  };
  mediator.register('Lauréat.Abandon.Command.AnnulerAbandon', handler);
};
