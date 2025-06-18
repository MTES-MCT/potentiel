import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type AnnulerChangementActionnaireCommand = Message<
  'Lauréat.Actionnaire.Command.AnnulerDemandeChangement',
  {
    dateAnnulation: DateTime.ValueType;
    identifiantUtilisateur: Email.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerAnnulerChangementActionnaireCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<AnnulerChangementActionnaireCommand> = async ({
    dateAnnulation,
    identifiantUtilisateur,
    identifiantProjet,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.actionnaire.annulerDemandeChangement({
      dateAnnulation,
      identifiantProjet,
      identifiantUtilisateur,
    });
  };
  mediator.register('Lauréat.Actionnaire.Command.AnnulerDemandeChangement', handler);
};
