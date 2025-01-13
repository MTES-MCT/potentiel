import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadActionnaireFactory } from '../../actionnaire.aggregate';

export type SupprimerDemandeChangementActionnaireCommand = Message<
  'Lauréat.Actionnaire.Command.SupprimerDemandeChangementActionnaire',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
    dateSuppression: DateTime.ValueType;
  }
>;

export const registerSupprimerDemandeChangementActionnaireCommand = (
  loadAggregate: LoadAggregate,
) => {
  const load = loadActionnaireFactory(loadAggregate);
  const handler: MessageHandler<SupprimerDemandeChangementActionnaireCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    dateSuppression,
  }) => {
    const actionnaire = await load(identifiantProjet);

    await actionnaire.supprimer({
      identifiantProjet,
      identifiantUtilisateur,
      dateSuppression,
    });
  };
  mediator.register('Lauréat.Actionnaire.Command.SupprimerDemandeChangementActionnaire', handler);
};
