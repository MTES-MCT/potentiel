import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

import { loadPuissanceFactory } from '../../puissance.aggregate';

export type AccorderChangementPuissanceCommand = Message<
  'Lauréat.Puissance.Command.AccorderChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    accordéLe: DateTime.ValueType;
    accordéPar: Email.ValueType;
    réponseSignée: DocumentProjet.ValueType;
  }
>;

export const registerAccorderChangementPuissanceCommand = (loadAggregate: LoadAggregate) => {
  const loadPuissance = loadPuissanceFactory(loadAggregate);

  const handler: MessageHandler<AccorderChangementPuissanceCommand> = async ({
    identifiantProjet,
    accordéLe,
    accordéPar,
    réponseSignée,
  }) => {
    const puissance = await loadPuissance(identifiantProjet);

    await puissance.accorderDemandeChangement({
      identifiantProjet,
      accordéLe,
      accordéPar,
      réponseSignée,
    });
  };
  mediator.register('Lauréat.Puissance.Command.AccorderChangement', handler);
};
