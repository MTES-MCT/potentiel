import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';

export type SupprimerChangementPuissanceCommand = Message<
  'Lauréat.Puissance.Command.SupprimerChangementPuissance',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateSuppression: DateTime.ValueType;
  }
>;

export const registerSupprimerChangementPuissanceCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<SupprimerChangementPuissanceCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    dateSuppression,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.puissance.supprimerDemandeChangement({
      identifiantUtilisateur,
      dateSuppression,
    });
  };
  mediator.register('Lauréat.Puissance.Command.SupprimerChangementPuissance', handler);
};
