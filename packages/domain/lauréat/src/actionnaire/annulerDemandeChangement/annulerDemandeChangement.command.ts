import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadActionnaireFactory } from '../actionnaire.aggregate';

export type AnnulerDemandeChangementActionnaireCommand = Message<
  'Lauréat.Actionnaire.Command.AnnulerDemandeChangement',
  {
    dateAnnulation: DateTime.ValueType;
    identifiantUtilisateur: Email.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerAnnulerDemandeChangementCommand = (loadAggregate: LoadAggregate) => {
  const loadActionnaire = loadActionnaireFactory(loadAggregate);

  const handler: MessageHandler<AnnulerDemandeChangementActionnaireCommand> = async ({
    dateAnnulation,
    identifiantUtilisateur,
    identifiantProjet,
  }) => {
    const actionnaire = await loadActionnaire(identifiantProjet);

    await actionnaire.annulerDemandeChangement({
      dateAnnulation,
      identifiantProjet,
      identifiantUtilisateur,
    });
  };
  mediator.register('Lauréat.Actionnaire.Command.AnnulerDemandeChangement', handler);
};
