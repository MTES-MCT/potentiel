// Third party
import { type Message, type MessageHandler, mediator } from 'mediateur';

// Workspaces
import type { DateTime, Email } from '@potentiel-domain/common';
import type { DocumentProjet } from '@potentiel-domain/document';

import type { IdentifiantProjet } from '../../..';
// Package
import type { GetProjetAggregateRoot } from '../../../getProjetAggregateRoot.port';

export type AccorderRecoursCommand = Message<
  'Éliminé.Recours.Command.AccorderRecours',
  {
    dateAccord: DateTime.ValueType;
    identifiantUtilisateur: Email.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: DocumentProjet.ValueType;
  }
>;

export const registerAccorderRecoursCommand = (getProjetAggregateRoot: GetProjetAggregateRoot) => {
  const handler: MessageHandler<AccorderRecoursCommand> = async ({
    dateAccord,
    identifiantUtilisateur,
    identifiantProjet,
    réponseSignée,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.éliminé.recours.accorder({
      dateAccord,
      identifiantUtilisateur,
      réponseSignée,
    });
  };
  mediator.register('Éliminé.Recours.Command.AccorderRecours', handler);
};
