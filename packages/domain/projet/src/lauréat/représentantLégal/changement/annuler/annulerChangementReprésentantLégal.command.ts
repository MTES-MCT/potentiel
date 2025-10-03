import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type AnnulerChangementReprésentantLégalCommand = Message<
  'Lauréat.ReprésentantLégal.Command.AnnulerChangementReprésentantLégal',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateAnnulation: DateTime.ValueType;
  }
>;

export const registerAnnulerChangementReprésentantLégalCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<AnnulerChangementReprésentantLégalCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    dateAnnulation,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
    await projet.lauréat.représentantLégal.annulerDemandeChangement({
      identifiantUtilisateur,
      dateAnnulation,
    });
  };
  mediator.register(
    'Lauréat.ReprésentantLégal.Command.AnnulerChangementReprésentantLégal',
    handler,
  );
};
