import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

import { loadActionnaireFactory } from '../actionnaire.aggregate';

export type AccorderDemandeChangementActionnaireCommand = Message<
  'Lauréat.Actionnaire.Command.AccorderDemandeChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    accordéLe: DateTime.ValueType;
    accordéPar: Email.ValueType;
    réponseSignée: DocumentProjet.ValueType;
  }
>;

export const registerAccorderDemandeChangementActionnaireCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadActionnaire = loadActionnaireFactory(loadAggregate);

  const handler: MessageHandler<AccorderDemandeChangementActionnaireCommand> = async ({
    identifiantProjet,
    accordéLe,
    accordéPar,
    réponseSignée,
  }) => {
    const actionnaire = await loadActionnaire(identifiantProjet, false);

    await actionnaire.accorderDemandeChangementActionnaire({
      identifiantProjet,
      accordéLe,
      accordéPar,
      réponseSignée,
    });
  };
  mediator.register('Lauréat.Actionnaire.Command.AccorderDemandeChangement', handler);
};
