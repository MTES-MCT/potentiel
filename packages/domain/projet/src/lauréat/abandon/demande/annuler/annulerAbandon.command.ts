import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type AnnulerAbandonCommand = Message<
  'Lauréat.Abandon.Command.AnnulerAbandon',
  {
    dateAnnulation: DateTime.ValueType;
    identifiantUtilisateur: Email.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerAnnulerAbandonCommand = (getProjetAggregateRoot: GetProjetAggregateRoot) => {
  const handler: MessageHandler<AnnulerAbandonCommand> = async ({
    dateAnnulation,
    identifiantUtilisateur,
    identifiantProjet,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.abandon.annuler({
      dateAnnulation,
      identifiantUtilisateur,
    });
  };
  mediator.register('Lauréat.Abandon.Command.AnnulerAbandon', handler);
};
