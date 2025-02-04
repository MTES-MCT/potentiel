import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadRecoursFactory } from '../recours.aggregate';

export type RejeterRecoursCommand = Message<
  'Éliminé.Recours.Command.RejeterRecours',
  {
    dateRejet: DateTime.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: DocumentProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
  }
>;

export const registerRejeterRecoursCommand = (loadAggregate: LoadAggregate) => {
  const loadRecours = loadRecoursFactory(loadAggregate);
  const handler: MessageHandler<RejeterRecoursCommand> = async ({
    identifiantProjet,
    réponseSignée,
    dateRejet,
    identifiantUtilisateur,
  }) => {
    const recours = await loadRecours(identifiantProjet);

    await recours.rejeter({
      dateRejet,
      identifiantProjet,
      identifiantUtilisateur,
      réponseSignée,
    });
  };
  mediator.register('Éliminé.Recours.Command.RejeterRecours', handler);
};
