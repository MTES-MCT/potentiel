import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

import { loadActionnaireFactory } from '../../actionnaire.aggregate';

export type AccorderChangementActionnaireCommand = Message<
  'Lauréat.Actionnaire.Command.AccorderChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    accordéeLe: DateTime.ValueType;
    accordéePar: Email.ValueType;
    réponseSignée: DocumentProjet.ValueType;
  }
>;

export const registerAccorderChangementActionnaireCommand = (loadAggregate: LoadAggregate) => {
  const loadActionnaire = loadActionnaireFactory(loadAggregate);

  const handler: MessageHandler<AccorderChangementActionnaireCommand> = async ({
    identifiantProjet,
    accordéeLe,
    accordéePar,
    réponseSignée,
  }) => {
    const actionnaire = await loadActionnaire(identifiantProjet, false);

    await actionnaire.accorderChangementActionnaire({
      identifiantProjet,
      accordéeLe,
      accordéePar,
      réponseSignée,
    });
  };
  mediator.register('Lauréat.Actionnaire.Command.AccorderChangement', handler);
};
