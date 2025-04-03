import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadActionnaireFactory } from '../../actionnaire.aggregate';

export type SupprimerChangementActionnaireCommand = Message<
  'Lauréat.Actionnaire.Command.SupprimerChangementActionnaire',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateSuppression: DateTime.ValueType;
  }
>;

export const registerSupprimerChangementActionnaireCommand = (loadAggregate: LoadAggregate) => {
  const load = loadActionnaireFactory(loadAggregate);
  const handler: MessageHandler<SupprimerChangementActionnaireCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    dateSuppression,
  }) => {
    const actionnaire = await load(identifiantProjet, false);

    await actionnaire.supprimerDemandeChangement({
      identifiantProjet,
      identifiantUtilisateur,
      dateSuppression,
    });
  };
  mediator.register('Lauréat.Actionnaire.Command.SupprimerChangementActionnaire', handler);
};
