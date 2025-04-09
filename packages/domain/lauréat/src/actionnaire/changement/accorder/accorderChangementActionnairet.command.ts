import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

import { loadActionnaireFactory } from '../../actionnaire.aggregate';

export type AccorderChangementActionnaireCommand = Message<
  'Lauréat.Actionnaire.Command.AccorderDemandeChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    accordéLe: DateTime.ValueType;
    accordéPar: Email.ValueType;
    réponseSignée: DocumentProjet.ValueType;
  }
>;

export const registerAccorderChangementActionnaireCommand = (loadAggregate: LoadAggregate) => {
  const loadActionnaire = loadActionnaireFactory(loadAggregate);

  const handler: MessageHandler<AccorderChangementActionnaireCommand> = async ({
    identifiantProjet,
    accordéLe,
    accordéPar,
    réponseSignée,
  }) => {
    const actionnaire = await loadActionnaire(identifiantProjet, false);

    await actionnaire.accorderChangementActionnaire({
      identifiantProjet,
      accordéLe,
      accordéPar,
      réponseSignée,
    });
  };
  mediator.register('Lauréat.Actionnaire.Command.AccorderDemandeChangement', handler);
};
