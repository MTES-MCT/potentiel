import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

import { loadActionnaireFactory } from '../../actionnaire.aggregate';

export type RejeterChangementActionnaireCommand = Message<
  'Lauréat.Actionnaire.Command.RejeterDemandeChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    rejetéLe: DateTime.ValueType;
    rejetéPar: Email.ValueType;
    réponseSignée: DocumentProjet.ValueType;
  }
>;

export const registerRejeterChangementActionnaireCommand = (loadAggregate: LoadAggregate) => {
  const loadActionnaire = loadActionnaireFactory(loadAggregate);

  const handler: MessageHandler<RejeterChangementActionnaireCommand> = async ({
    identifiantProjet,
    rejetéLe,
    rejetéPar,
    réponseSignée,
  }) => {
    const actionnaire = await loadActionnaire(identifiantProjet, false);

    await actionnaire.rejeterChangementActionnaire({
      identifiantProjet,
      rejetéLe,
      rejetéPar,
      réponseSignée,
    });
  };
  mediator.register('Lauréat.Actionnaire.Command.RejeterDemandeChangement', handler);
};
