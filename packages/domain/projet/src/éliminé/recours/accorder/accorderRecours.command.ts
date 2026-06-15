// Third party
import { type Message, type MessageHandler, mediator } from 'mediateur';

// Workspaces
import type { DateTime, Email } from '@potentiel-domain/common';

// Package
import type { GetProjetAggregateRoot } from '../../../getProjetAggregateRoot.port.js';
import type { DocumentProjet, IdentifiantProjet } from '../../../index.js';

export type AccorderRecoursCommand = Message<
  'Éliminé.Recours.Command.AccorderRecours',
  {
    dateAccord: DateTime.ValueType;
    accordéLe: DateTime.ValueType;
    identifiantUtilisateur: Email.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: DocumentProjet.ValueType;
  }
>;

export const registerAccorderRecoursCommand = (getProjetAggregateRoot: GetProjetAggregateRoot) => {
  const handler: MessageHandler<AccorderRecoursCommand> = async ({
    dateAccord,
    accordéLe,
    identifiantUtilisateur,
    identifiantProjet,
    réponseSignée,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.éliminé.recours.accorder({
      dateAccord,
      accordéLe,
      identifiantUtilisateur,
      réponseSignée,
    });
  };
  mediator.register('Éliminé.Recours.Command.AccorderRecours', handler);
};
