import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { DocumentProjet } from '@potentiel-domain/document';

import type { IdentifiantProjet } from '../../..';
import type { GetProjetAggregateRoot } from '../../../getProjetAggregateRoot.port';

export type RejeterRecoursCommand = Message<
  'Éliminé.Recours.Command.RejeterRecours',
  {
    dateRejet: DateTime.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: DocumentProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
  }
>;

export const registerRejeterRecoursCommand = (getProjetAggregateRoot: GetProjetAggregateRoot) => {
  const handler: MessageHandler<RejeterRecoursCommand> = async ({
    identifiantProjet,
    réponseSignée,
    dateRejet,
    identifiantUtilisateur,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.éliminé.recours.rejeter({
      dateRejet,
      identifiantUtilisateur,
      réponseSignée,
    });
  };
  mediator.register('Éliminé.Recours.Command.RejeterRecours', handler);
};
