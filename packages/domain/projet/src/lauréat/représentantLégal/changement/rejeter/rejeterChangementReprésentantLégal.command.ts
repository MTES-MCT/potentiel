import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type RejeterChangementReprésentantLégalCommand = Message<
  'Lauréat.ReprésentantLégal.Command.RejeterChangementReprésentantLégal',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateRejet: DateTime.ValueType;
    motifRejet: string;
    rejetAutomatique: boolean;
  }
>;

export const registerRejeterChangementReprésentantLégalCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<RejeterChangementReprésentantLégalCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    dateRejet,
    motifRejet,
    rejetAutomatique,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
    await projet.lauréat.représentantLégal.rejeterDemandeChangement({
      identifiantUtilisateur,
      dateRejet,
      motifRejet,
      rejetAutomatique,
    });
  };
  mediator.register(
    'Lauréat.ReprésentantLégal.Command.RejeterChangementReprésentantLégal',
    handler,
  );
};
