import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';

export type ConfirmerAbandonCommand = Message<
  'Lauréat.Abandon.Command.ConfirmerAbandon',
  {
    dateConfirmation: DateTime.ValueType;
    identifiantUtilisateur: Email.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerConfirmerAbandonCommand = (getProjetAggregateRoot: GetProjetAggregateRoot) => {
  const handler: MessageHandler<ConfirmerAbandonCommand> = async ({
    identifiantProjet,
    dateConfirmation,
    identifiantUtilisateur,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.abandon.confirmer({
      dateConfirmation,
      identifiantUtilisateur,
    });
  };
  mediator.register('Lauréat.Abandon.Command.ConfirmerAbandon', handler);
};
