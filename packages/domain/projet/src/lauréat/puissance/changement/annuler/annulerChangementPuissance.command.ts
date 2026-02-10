import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';

export type AnnulerChangementPuissanceCommand = Message<
  'Lauréat.Puissance.Command.AnnulerDemandeChangement',
  {
    dateAnnulation: DateTime.ValueType;
    identifiantUtilisateur: Email.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerAnnulerChangementPuissanceCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<AnnulerChangementPuissanceCommand> = async ({
    dateAnnulation,
    identifiantUtilisateur,
    identifiantProjet,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.puissance.annulerDemandeChangement({
      dateAnnulation,
      identifiantUtilisateur,
    });
  };
  mediator.register('Lauréat.Puissance.Command.AnnulerDemandeChangement', handler);
};
