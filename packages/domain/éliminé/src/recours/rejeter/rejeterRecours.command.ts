import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { LoadAggregate } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { loadRecoursFactory } from '../recours.aggregate';

export type RejeterRecoursCommand = Message<
  'REJETER_RECOURS_COMMAND',
  {
    dateRejet: DateTime.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: DocumentProjet.ValueType;
    identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
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
  mediator.register('REJETER_RECOURS_COMMAND', handler);
};
