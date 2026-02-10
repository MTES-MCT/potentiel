import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';

export type SupprimerChangementActionnaireCommand = Message<
  'Lauréat.Actionnaire.Command.SupprimerChangementActionnaire',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateSuppression: DateTime.ValueType;
  }
>;

export const registerSupprimerChangementActionnaireCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<SupprimerChangementActionnaireCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    dateSuppression,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.actionnaire.supprimerDemandeChangement({
      identifiantUtilisateur,
      dateSuppression,
    });
  };
  mediator.register('Lauréat.Actionnaire.Command.SupprimerChangementActionnaire', handler);
};
