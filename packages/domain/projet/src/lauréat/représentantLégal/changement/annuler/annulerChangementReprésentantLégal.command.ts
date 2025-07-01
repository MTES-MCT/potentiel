import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type AnnulerChangementReprésentantLégalCommand = Message<
  'Lauréat.ReprésentantLégal.Command.AnnulerChangementReprésentantLégal',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
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
